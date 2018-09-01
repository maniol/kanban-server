const express = require('express');
const noteRouter = new express.Router();
const Lane = require("../models")

noteRouter.param('laneId', (req, res, next, id) => {
	Lane.findById(id, (err, doc) => {
		if(err) return next(err);
		if(!doc) {
			err = new Error('Not found');
			err.status = 404;
			return next(err)
		}
		req.lane = doc;
		return next();
	});
});

noteRouter.param('noteId', (req, res, next, id) => {
	req.note = req.lane.notes.id(id);
	if(!req.note) {
		err = new Error('Not found');
		err.status = 404;
		return next(err);
	}
	next();
});

//POST /lanes/:laneId/notes
// Add a note
noteRouter.post('/lanes/:laneId/notes', (req, res, next) => {
	req.lane.notes.push(req.body);
	req.lane.save((err, lane) => {
		if(err) return next(err);
		res.status(201);
		res.json(lane);
	});
});

//DELETE /lanes/:laneId/notes/:noteId
// Delete a note
noteRouter.delete('/lanes/:laneId/notes/:noteId', (req, res, next) => {
	req.note.remove((err) => {
		req.lane.save((err, lane) => {
			if(err) return nxt(err);
			res.json(lane);
		});
	});
});

//PUT /lanes/:laneId/notes/:noteId
// Update a note
noteRouter.put('/lanes/:laneId/notes/:noteId', (req, res, next) => {
	req.note.update(req.body, (err, result) => {
		if(err) return next(err);
		res.json(result);
	});
});


module.exports = noteRouter;