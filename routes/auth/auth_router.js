const { PrismaClient } = require('@prisma/client');
const authRouter = require('express').Router()
const bcrypt = require('bcrypt');
const redisClient = require('../../config/redis_config');
const { v4 } = require('uuid');

const prisma = new PrismaClient();

/**
 * @route "/login"
 * @method "POST"
 * @desc "A route to login a user."
 */
authRouter.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email: email } })
        const authResult = await bcrypt.compare(password, user.password);

        if (authResult) {
            const token = v4();
            const redisResult = await redisClient.sendCommand(['SET', token, JSON.stringify({
                ...user,
                device: req.header['User-Agent']
            })])
            res.send(token + redisResult);
        }
    } catch (error) {
        next(error)
    }
});

/**
 * @route "/login"
 * @method "GET"
 * @desc "A route to logout a user."
 */
authRouter.get('/logout', (req, res) => { });

module.exports = authRouter;