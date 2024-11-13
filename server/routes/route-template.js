const express = require('express');
const mongoose = require('mongoose');

/*
    This file establishes a quick function for creating the routes that are 
    common to the majority of the routes defined in the server/routes folder
*/


/*
    buildDefaultRouter: Create an express router which defines the behavior for the most common
    route endpoints for GET, POST, DELETE, and PUT

    Parameters:
        - routeNameStr (string): The name of the route that should be created. For example,
          if routeNameStr is "user", it will define routes for the URL /api/user
        
        - ModelType (mongoose.Model): This is the corresponding mongoose Model for routeNameStr.
          It ensures that documents being added to the database using this route match the database schema,
          to reduce the possibility of invalid data in the database.
    
    Returns:
        - An express.Router, which can be used as middleware to process incoming requests for the common
          route operations (GET,POST,PUT,DELETE)
*/
function buildDefaultRouter(routeNameStr, ModelType) {
    const router = express.Router();

    // Define the GET /routeNameStr route, which will return all entries of ModelType in the database.
    router.get(`/${routeNameStr}`, async (req, res) => {
        ModelType.find({}).exec() // Find all documents that match ModelType
            .then((results) => {res.status(200).json(results);})  // On success, return the documents and an OK status code
            .catch((err) => { // On error,
                console.log(err); // Log the error
                res.status(500).json({error: err}); // Report an internal server error in the response
            });
    });

    // Define the GET /routeNameStr/<id> route, which will return the ModelType document with the specified _id value
    router.get(`/${routeNameStr}/:id`, async(req, res) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) { // Make sure the id is valid
            return res.status(404).json({ error: 'Invalid ID: ' + id }); // If the id is not valid, report that the document could not be found
        }

        ModelType.findById(id).exec() // If the id was valid, find the matching ModelType document with that id
            .then(result => { 
                res.status(200).json(result); // On success, return the found document
            })
            .catch(err => { // On error, log the error
                console.log(err);
                res.status(500).json({error : err}); // Report the error to the client 
            });
    });

    // Define the POST /routeNameStr/ route, which will create a new ModelType document in the database
    router.post(`/${routeNameStr}`, async (req, res) => {
        try {
            const model = new ModelType({ // Specify the properties that the new entry must follow in order to be ModelType
                _id: new mongoose.Types.ObjectId(), // Generate a new id for this
                ...req.body
            })
    
            await model.save(); // Add the new document to the database
            res.status(201).json(model); // Report to the client that the operation was successful
        } catch(err) {
            console.error(err); // Log the error
            res.status(500).json({ error: err }); // Report to the client that the operation failed
        } 
    });

    // Define the DELETE /routeNameStr/<id> route, which will delete the ModelType document with the specified _id
    router.delete(`/${routeNameStr}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) { // Make sure the id is valid
                return res.status(404).json({ error: 'No such id: ' + id });
            }
            const result = await ModelType.findByIdAndDelete(id); // Attempt to delete the document
            if (!result) { // On error,
                return res.status(404).json({ error: 'No such route: ' + routeNameStr }); // Report the error to the client
            }
            res.status(200).send(`Document id ${id} successfully deleted`);
        } catch (err) { // On error,
            console.error(err);
            res.status(500).json({ error: err }); // Report the error to the client
        }
    });

    // Define the PUT /routeNameStr/<id> route, which will update the ModelType document with the specified _id
    router.put(`/${routeNameStr}/:id`, async (req, res) => {
        try {
            const result = await ModelType.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Attempt to update the document, and create a new one if needed
            if (!result) { // On error,
                return res.status(404).json({ error: 'No such route: ' +  routeNameStr}); // Report that the operation was unsuccessful
            }
            res.status(200).json(result); // Otherwise, send the result and a successful OK code
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err }); // Report any error
        }
    });

    return router;
}

module.exports = buildDefaultRouter;