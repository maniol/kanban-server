const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// hack for UnhandledPromiseRejectionWarning: MongoError: Unknown modifier: $pushAll.
mongoose.plugin(schema => { schema.options.usePushEach = true });


const noteSchema = new Schema({
	task: { type: 'String', required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

noteSchema.method("update", function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	this.parent().save(callback);
});


const laneSchema = new Schema({
	name: { type: 'String', required: true },
	notes: [noteSchema],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

laneSchema.method("update", function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	this.save(callback);
});

/*laneSchema.pre("save", (next) => {
	this.notes.sort({ updatedAt: 'descending'});
	next();
})*/

module.exports =  mongoose.model('Lane', laneSchema);