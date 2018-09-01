const express = require('express');
const laneRouter = new express.Router();
const Lane = require("../models")

laneRouter.param('laneId', (req, res, next, id) => {
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

//GET /lanes
// Return all lanes
laneRouter.get('/lanes', (req, res, next) => {
	Lane.find({},null, {sort: {createdAt: 'descending'}}, (err, lanes) => {
		if(err) return next(err);
		res.json(lanes);
	});
});

//POST /lanes
//Add new lane
laneRouter.post('/lanes', (req, res, next) => {
	const lane = new Lane(req.body);
	lane.save((err, lane) =>{
		if (err) return next(err);
		res.status(201);
		res.json(lane);
	});
});


//DELETE /lanes/:laneId
//Delete a lane by laneId
laneRouter.delete('/lanes/:laneId', (req, res, next) => {
	req.lane.remove((err) => {
		req.lane.save((err, lane) => {
			if(err) return next(err);
			res.json(lane);
		});
	});
});

//PUT /lanes/:laneId
//Updates a lane by laneId
laneRouter.put('/lanes/:laneId', (req, res, next) => {
	req.lane.update(req.body, (err, result) => {
		if(err) return next(err);
		res.json(result);
	});
});

module.exports = laneRouter;