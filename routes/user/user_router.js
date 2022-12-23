const userRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const passport = require('passport');

const prisma = new PrismaClient();

/**
 * @route "/user"
 * @method "POST"
 * @description "A route to create a user."
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

/**
 * @route '/user'
 * @method GET
 * @description Get data for a user.
 */
userRouter.get('/', passport.authenticate('bearer', { session: false }), async (req, res) => {
    return res.send(req.user);
})


/**
 * @route '/user/details
 * @method POST
 * @description A route to add more details about user.
 */
userRouter.post('/details', async (req, res, next) => {
    if (req.user.role === 1) {
        // User is Admin.
        // TODO: Reserved for future.

    } else if (req.user.role === 2) {
        // User is Student.
        const {
            id,
            User,
            name,
            phone,
            institute,
            branch,
            standard,
            intrests,
            profile_picture,
        } = req.body;
    } else if (req.user.role === 3) {
        // User is Teacher.

    }
})

module.exports = userRouter;
