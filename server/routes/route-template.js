const express = require('express');
const mongoose = require('mongoose');

// Returns a router for ModelType, handles the most common operations
function buildDefaultRouter(routeNameStr, ModelType) {
    const router = express.Router();

    // Get all entries of ModelType in the DB
    router.get(`/${routeNameStr}`, async (req, res) => {
        const results = await ModelType.find({});
        res.status(200).json(results);
    });

    // Get a specific entry of ModelType by _id
    router.get(`/${routeNameStr}/:id`, async(req, res) => {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid ID: ' + id });
        }

        const result = await ModelType.findById(id);
        if (!result) {
            res.status(404).json({error : 'No matching ID: ' + id});
            return;
        }

        res.status(200).json(result);
    });

    // Add new entry for ModelType
    router.post(`/${routeNameStr}`, async (req, res) => {
        try {
            const model = new ModelType({
                _id: new mongoose.Types.ObjectId(),
                ...req.body
            })
    
            const result = await model.save();
            res.status(201).json(model);
        } catch(error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } 
    });

    // Delete specific entry for ModelType based on _id
    router.delete(`/${routeNameStr}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({ error: 'No such id: ' + id });
            }
            const result = await ModelType.findByIdAndDelete(id);
            if (!result) {
                return res.status(404).json({ error: 'No such route: ' + routeNameStr });
            }
            res.send("Successfully deleted entry");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });

    // Update an existing entry's data based on _id
    router.put(`/${routeNameStr}/:id`, async (req, res) => {
        try {
            const result = await ModelType.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!result) {
                return res.status(404).json({ error: 'No such route: ' +  routeNameStr});
            }
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

module.exports = buildDefaultRouter;