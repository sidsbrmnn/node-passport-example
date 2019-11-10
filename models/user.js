const mongoose = require('mongoose');

const User = mongoose.model(
	'user',
	new mongoose.Schema({
		name: { type: String },
		email: { type: String, required: true },
		password: { type: String, required: true }
	})
);

module.exports = User;
