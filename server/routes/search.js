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

    atlasSearch(req.query.type, req.query.q)
        .then((queryResult) => {
            res.status(200).json(queryResult);
        })
        .catch(err => {
            console.log(err);
            res.status(('err_code' in err) ? err.err_code : 500).send(('reason' in err) ? err.reason : 'Internal Error');
        });
});

function atlasSearch(type, queryStr) {
    let ModelType;
    let indexName;
    let fieldName;

    // TODO: Find a better way of grouping together related information for each data type 
    //       (ie. the Model, index name, and field to search)
    
    console.log(type);
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

    return ModelType.aggregate().search({
        index: 'complete',
        autocomplete: {
            query: queryStr,
            path: fieldName
        }
    });
}

module.exports = router;