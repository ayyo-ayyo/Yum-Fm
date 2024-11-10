const express = require('express');
const Restaurant = require('../models/restaurant-model');
const MenuItem = require('../models/menuItem-model');
const router = express.Router();

// Handles requests in the form "/search/type=restaurant&q=[query here]"
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

    // TODO: Find a better way of grouping together related information for each data type 
    //       (ie. the Model, index name, and field to search)
    
    switch (type) {
        case 'restaurant':
            ModelType = Restaurant;
            indexName = 'restaurant_index';
            fieldName = 'restaurant_name';
            break;
        case 'menuitem':
            ModelType = MenuItem;
            indexName = 'menuitem_index';
            fieldName = 'item_name';
            break;
        default:
            return Promise.reject({err_code: 400, reason: 'Invalid "type" parameter'});
    }

    /*
    return ModelType.aggregate().search({
        index: indexName,
        text: {
            query: queryStr,
            path: fieldName
        }
    }).exec();
    */

    let searchAggregate = ModelType.aggregate().search({ // Do the initial search
        index: 'complete',
        autocomplete: {
            query: queryStr,
            path: fieldName
        }
    });

    if (mfilters.length > 0) { // If there are mandatory filters, include only results that have them
        searchAggregate = searchAggregate.match({
            rest_fulfilled_filters: {
                $all: mfilters
            }
        });
    }

    // TODO: Generalize so this works for more than just restaurant filters

    if (pfilters.length > 0) {
        searchAggregate = searchAggregate.addFields({
            num_matched_pfilters: {
                $size: {
                    $setIntersection: ['$rest_fulfilled_filters', pfilters]
                }
            }
        }).sort({
            num_matched_pfilters: -1 // Sort the results so that restaurants with the most matched filters appear first in results
        });
    }

    return searchAggregate;
}

module.exports = router;