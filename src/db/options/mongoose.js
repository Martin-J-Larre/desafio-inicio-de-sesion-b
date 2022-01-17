import mongoose from "mongoose";

var dbConnected = false;

function connectDb(cb) {
	mongoose.connect(
		'mongodb://localhost:27017/admin', 
		{ useNewUrlParser: true, useUnifiedTopology: true },
		(err) => {
			if (!err) {
				dbConnected = true;
			}
			if (cb != null) {
				cb(err);
			}
		}
	);
}

const User = mongoose.model("Users", {
	username: String,
	password: String,
});

export { connectDb, User };