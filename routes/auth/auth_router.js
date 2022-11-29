const authRouter = require('express').Router()
const bcrypt = require('bcrypt');
const redisClient = require('../../config/redis_config');
const { v4 } = require('uuid');
const { prisma } = require('../../services/prisma_db');
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
                data : {
                    device: req.header['User-Agent'],
                    user_id: user.id,
                },
            });
            token['user'] = user;
            const jwt  = jsonwebtoken.sign(token, process.env.SECRET_KEY);
            res.json({jwt: jwt});
        } else
            res
                .status(400)
                .json({err: 'Invalid password'})
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