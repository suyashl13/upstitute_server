const authRouter = require('./auth/auth_router');
const userRouter = require('./user/user_router');
const baseRouter = require('express').Router()


// Routers
baseRouter.use('/auth', authRouter);
baseRouter.use('/user', userRouter);

module.exports = baseRouter;