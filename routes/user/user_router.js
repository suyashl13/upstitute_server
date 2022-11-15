const userRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const passport = require('passport');

const prisma = new PrismaClient();

/**
 * @route "/user"
 * @method "POST"
 * @desc "A route to create a user."
 */
userRouter.post('/', async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            role,
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    phone: phone,
                    role: role,
                    password: hashedPassword,
                    is_active: true
                }
            });
            return res.json(newUser);
        } catch (error) {
            if (error.code == 'P2002') {
                throw new Error("UNIQUE CONSTRAINT FAILED");
            } else
                throw error;            
        }
    } catch (error) {
        next(error);
    }
});

userRouter.get('/', passport.authenticate('local', {}) ,async (req, res) => {
    res.send(req.user);
})

module.exports = userRouter;
