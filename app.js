const express = require('express');
const bodyParser = require('body-parser').json;
const logger = require('morgan');
const mongoose = require('mongoose');

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

const app = express();


app.use(bodyParser());
//app.use(bodyParser.urlencoded({ extended: true}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));


mongoose.connect('mongodb://localhost/kanban', { useNewUrlParser: true }, {useMongoClient: true})
	.then(() => console.log('connection to kanban db successful'))
	.catch((err) => console.error(err));

mongoose.set('debug', true);


// Add models
require('./models');

// Add routes
const laneRouter = require('./routes/lane.js')
const noteRouter = require('./routes/note.js')

app.use('/', laneRouter);
app.use('/', noteRouter);

//catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not found');
	err.status = 404;
	next(err);
});

// Error Handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json( {
		error: {
			message: err.message
		}
	});
});

const port = process.env.PORT || 3001;

const server = app.listen(port, () => console.log('Server started on http://localhost:3001'));