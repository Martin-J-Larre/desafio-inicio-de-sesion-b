import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./db/options/mongoose.js";
import bcrypt from "bcrypt";

//HELPER FUNCTIONS
function isValidPassword(user, password) {
	return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

//LOGIN
passport.use(
	"login",
	new LocalStrategy((username, password, done) => {
		User.findOne({ username }, (err, user) => {
			if (err) {
				return done(err);
			}

			if (!user || !isValidPassword(user, password)) {
				return done(null, false);
			}

			return done(null, user);
		});
	})
);

//REGISTER
passport.use(
	"register",
	new LocalStrategy((username, password, done) => {
		User.findOne({ username }, (err, user) => {
			if (err) {
				return done(err);
			}

			if (user) {
				return done(null, false);
			}

			const newUser = {
				username: username,
				password: createHash(password),
			};

			User.create(newUser, (err, userWithId) => {
				if (err) {
					return done(err);
				}

				return done(null, userWithId);
			});
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, done);
});

export { passport };