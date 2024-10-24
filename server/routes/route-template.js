const express = require('express');
const mongoose = require('mongoose');

function buildDefaultRouter(routeNameStr, ModelType) {
    const router = express.Router();

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

    router.delete(`/${routeNameStr}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({ error: 'No such route: ' + routeNameStr });
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

    // Update an existing entry's data
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