const BearerStrategy = require('passport-http-bearer').Strategy;
const jsonwebtoken = require('jsonwebtoken');
const { prisma } = require('../singleton/prisma_db');
const redisClient = require('./redis_config');


module.exports = (passport) => {
    passport.use(new BearerStrategy(
        async function (jwtEncrypted, done) {
            try {
                const webTokenDecoded = jsonwebtoken.decode(jwtEncrypted, process.env.SECRET_KEY);
                
                if ((await redisClient.keys('*')).includes(webTokenDecoded.token)) {
                    const cachedToken = await redisClient.json.get(webTokenDecoded.token);
                    delete cachedToken['user']['password'];
                    return done(null, cachedToken?.user, {scope: true});
                }

                const authToken =  await prisma.token.findFirst({
                    where: {
                        token: webTokenDecoded.token
                    },
                    include: {
                        user: true
                    }
                })

                delete authToken['user']['password'];

                try {
                    await redisClient.json.set(authToken.token, '.', authToken);
                    await redisClient.expire(authToken.token, 60 * 60)
                } catch (error) {
                    console.error("Unable to cache current auth token");
                }
                
                return done(null, authToken.user, { scope: 'all' });

                
            } catch (error) {
                console.log(error);
                return done(null, false, null);
            }
        }
    ));
}