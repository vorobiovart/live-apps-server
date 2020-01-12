const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// TODO: move this into env properties
const secret = 'some secret key';

const cookieExtractor = function(req) {
    if (req && req.cookies) return req.cookies.user;
    return null;
};

const opts = {};
// TODO: consider switching to Bearer token for scalability
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = secret;

const jwtStrategy = passport => {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        User.findOne({ email: jwt_payload.email }, function(err, user) {
            if (err) {
                return done(err, false, { message: 'Not permitted action' });
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Authentication not valid' });
            }
        });
    }));
};

module.exports = jwtStrategy;