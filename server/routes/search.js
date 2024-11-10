const express = require('express');
const Restaurant = require('../models/restaurant-model');
const MenuItem = require('../models/menuItem-model');
const router = express.Router();

// Handles requests in the form "/search/type=restaurant&q=[query here]"
// Optionally can include "mfilters=[list of mandatory filters separated by comma]"
// Optionally can include "pfilters=[list of preferred filters separated by comma]"
router.get('/search', (req, res) => {
    if (!('type' in req.query)) {
        res.status(400).send('"type" parameter must be provided in search query');
        return;
    }
    if (!('q' in req.query)) {
        res.status(400).send('"q" parameter must be provided in search query');
        return;
    }

    mfilters = []
    if ('mfilters' in req.query) {
        mfilters = req.query.mfilters.split(',') // Get the mandatory filters from the search parameters
    }

    pfilters = []
    if ('pfilters' in req.query) {
        pfilters = req.query.pfilters.split(',') // Get the preferred filters to sort results by
    }
    
    atlasSearch(req.query.type, req.query.q, mfilters, pfilters)
        .then((queryResult) => {
            res.status(200).json(queryResult);
        })
        .catch(err => {
            console.log(err);
            res.status(('err_code' in err) ? err.err_code : 500).send(('reason' in err) ? err.reason : 'Internal Error');
        });
});

/*
    Find documents to match the search query
        - type: Either restaurant or menuitem
        - queryStr: The name to search for in the database
        - mfilters: The mandatory filters that each of these items must fulfill
        - pfilters: User preferred filters that are not mandatory, used to sort results
*/
function atlasSearch(type, queryStr, mfilters, pfilters) {
    let ModelType;
    let indexName;
    let fieldName;
    let filterName;

    // TODO: Find a better way of grouping together related information for each data type 
    //       (ie. the Model, index name, and field to search)
    
    switch (type) {
        case 'restaurant':
            ModelType = Restaurant;
            indexName = 'restaurant_autocomplete';
            fieldName = 'restaurant_name';
            filterName = 'rest_fulfilled_filters';
            break;
        case 'menuitem':
            ModelType = MenuItem;
            indexName = 'menuitem_autocomplete';
            fieldName = 'item_name';
            filterName = 'item_fulfilled_filters';
            break;
        default:
            return Promise.reject({err_code: 400, reason: 'Invalid "type" parameter'});
    }

    // Construct the database query that will return entries that match the name and mandatory filters, 
    // and then sort results by preferred filters
    let searchAggregate = ModelType.aggregate().search({ // Do the initial search
        index: indexName,
        autocomplete: {
            query: queryStr,
            path: fieldName
        }
    });

    if (mfilters.length > 0) { // If there are mandatory filters, include only results that have them
        searchAggregate = searchAggregate.match({
            [filterName]: {
                $all: mfilters
            }
        });
    }

    if (pfilters.length > 0) {
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

    return searchAggregate;
}

module.exports = router;