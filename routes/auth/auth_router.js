const authRouter = require('express').Router()
const bcrypt = require('bcrypt');
const redisClient = require('../../config/redis_config');
const { v4 } = require('uuid');
const { prisma } = require('../../singleton/prisma_db');
const jsonwebtoken = require('jsonwebtoken');

/**
 * @route /login
 * @method POST
 * @desc A route to login a user.
 */
authRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email: email } })
        const authResult = await bcrypt.compare(password, user.password);
        delete user['password'];
        if (authResult) {
            const token = await prisma.token.create({
                data: {
                    device: req.header['User-Agent'],
                    user_id: user.id,
                },
                include: {
                    user: true
                }
            });

            const jwt = jsonwebtoken.sign(token, process.env.SECRET_KEY);

            try {
                await redisClient.json.set(token.token, '.', token);
                await redisClient.expire(token.token ,60 * 60)
            } catch (error) {
                console.error("Unable to cache current auth token");
            }

            res
                .cookie('Authorization', `Bearer ${jwt}`, { httpOnly: true })
                .json({ jwt: jwt });
        } else
            res
                .status(400)
                .json({ err: 'Invalid password' })
    } catch (error) {
        next(error)
    }
});

/**
 * @route /login
 * @method GET
 * @desc A route to logout a user.
 */
authRouter.get('/logout', (req, res) => { });

module.exports = authRouter;