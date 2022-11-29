const BearerStrategy = require('passport-http-bearer').Strategy;
const jsonwebtoken = require('jsonwebtoken');
const redisClient = require('./redis_config');

module.exports = (passport) => {
    passport.use(new BearerStrategy(
        async function (token, done) {
            try {
                const tkn = jsonwebtoken.decode(token, process.env.SECRET_KEY);
                const nwuser = await redisClient.json.GET(`authtoken:${tkn.token}`);
                return done(null, nwuser, { scope: 'all' });
            } catch (error) {
                console.log(error);
                return done(null, false, null);
            }
        }
    ));
}