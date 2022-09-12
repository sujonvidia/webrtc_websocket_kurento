const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const {models} = require('./db/express-cassandra');
// const mongoose = require("mongoose");
// const User = mongoose.model("users");
// const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
			console.log(jwt_payload);
            models.instance.Users.findOne({ id: models.uuidFromString(jwt_payload.id) }, { raw: true, allow_filtering: true }, function(error, user) {
				if(error) console.log(error);
				if (user) {
					return done(null, user);
				}
				return done(null, false);
			});
        })
    );
};
