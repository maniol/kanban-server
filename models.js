const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// hack for UnhandledPromiseRejectionWarning: MongoError: Unknown modifier: $pushAll.
mongoose.plugin(schema => { schema.options.usePushEach = true });


const noteSchema = new Schema({
	task: { type: 'String', required: true },
	id: {type: 'String'},
	_id: {type: 'String'},
	editing: {type: 'Boolean'},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// method to update the subdocument
noteSchema.method("update", function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	this.parent().save(callback);
});


const laneSchema = new Schema({
	name: { type: 'String', required: true },
	notes: [noteSchema],
	id: {type: 'String'},
	_id: {type: 'String'},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	editing: {type: 'Boolean'}
});

//modified update method of the parent so that the whole doc is returned in response
laneSchema.method("update", function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	this.save(callback);
});

/*laneSchema.pre("save", (next) => {
	this.notes.sort({ updatedAt: 'descending'});
	next();
})*/

module.exports =  mongoose.model('Lane', laneSchema );