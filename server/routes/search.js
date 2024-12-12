const express = require('express');
const Restaurant = require('../models/restaurant-model');
const MenuItem = require('../models/menuItem-model');
const Menu = require('../models/menu-model');
const mongoose = require('mongoose');
const router = express.Router();
const tm = require('../token_manager');

/*
    This file defines custom routes to provide easy text searching of restaurants and menuitems.
*/

// Defines GET requests for the /search route, for
// requests in the form "/search/type=[restaurant | menuitem]]&q=[query here]"
// Optionally can include "mfilters=[list of mandatory filters separated by comma]"
// Optionally can include "pfilters=[list of preferred filters separated by comma]"
router.get('/search', (req, res) => {
    let userId;
    try {
        userId = tm.validateToken(req.headers.authorization);
    }
    catch (err) {
        res.status(401).send('Invalid access token');
        return;
    }

    // Ensure that the mandatory parameteres were given in the query string
    if (!('type' in req.query)) {
        res.status(400).send('"type" parameter must be provided in search query');
        return;
    }
    if (!('q' in req.query)) {
        res.status(400).send('"q" parameter must be provided in search query');
        return;
    }

    // Update the optional mfilters and pfilters if they were provided by the client
    mfilters = []
    if ('mfilters' in req.query) {
        mfilters = req.query.mfilters.split(',') // Get the mandatory filters from the search parameters
    }

    pfilters = []
    if ('pfilters' in req.query) {
        pfilters = req.query.pfilters.split(',') // Get the preferred filters to sort results by
    }
    
    // Perform the search in the database using the given query parameters
    atlasSearch(req.query.type, req.query.q, mfilters, pfilters)
        .then((queryResult) => {
            res.status(200).json(queryResult); // On success, return the documents found in the database that match the text query
        })
        .catch(err => {
            console.log(err);
            res.status(('err_code' in err) ? err.err_code : 500).send(('reason' in err) ? err.reason : 'Internal Error'); // Report the error to the client
        });
});

/*
    atlasSearch: Find documents to match the search query

    Parameters:
        - type: Either restaurant or menuitem
        - queryStr: The name to search for in the database
        - mfilters: The mandatory filters that each of these items must fulfill
        - pfilters: User preferred filters that are not mandatory, used to sort results

    Returns:
        - A promise that will fulfill with any of the matching documents with the specified mfilters, and sorted
          based on the number of pfilters each document matches with
*/
function atlasSearch(type, queryStr, mfilters, pfilters) {
    // Determine the type being searched and set the values accordingly
    switch (type) {
        case 'restaurant':
            return executeAtlasQuery(
                Restaurant,
                queryStr,
                'restaurant_autocomplete',
                'restaurant_name',
                'rest_fulfilled_filters'
            );
        case 'menuitem':
            return executeAtlasQuery(
                MenuItem,
                queryStr,
                'menuitem_autocomplete',
                'item_name',
                'item_fulfilled_filters'
            ).then(menuItems =>
                Promise.all(menuItems.map(async (curItem) => {
                    const matchingMenu = await Menu.findOne({menu_id: curItem.menu_id});
                    const matchingRest = await Restaurant.findOne({restaurant_id: matchingMenu.restaurant_id});
                    return {item: curItem, restaurant: matchingRest};
                }))
            );
        default:
            return Promise.reject({err_code: 400, reason: 'Invalid "type" parameter'});
    }

    // Construct the database query / aggregation pipeline that will return entries that match the name and mandatory filters, 
    // and then sort results by preferred filters
    
}

function executeAtlasQuery(ModelType, queryStr, indexName, fieldName, filterName) {
    let searchAggregate = ModelType.aggregate().search({ // Do the initial search
        index: indexName,
        autocomplete: {
            query: queryStr,
            path: fieldName,
        }
    });

    if (mfilters.length > 0) { // If there are mandatory filters, include only results that have them
        searchAggregate = searchAggregate.match({
            [filterName]: {
                $all: mfilters
            }
        });
    }

    if (pfilters.length > 0) { // If there preferred filters, sort the results based on the number of matches
        searchAggregate = searchAggregate.addFields({
            num_matched_pfilters: {
                $size: {
                    $setIntersection: ['$' + filterName, pfilters]
                }
            }
        }).sort({
            num_matched_pfilters: -1 // Sort the results so that restaurants with the most matched filters appear first in results
        });
    }

    return searchAggregate.exec(); // Execute the aggregate pipeline to get the results
}

module.exports = router;