module.exports = errorHandler = (error, req, res, next) => {

    console.error("\x1b[31m" + error.code);
    console.log("\x1b[37m");

    switch (error.message) {
        case "HASH_ERROR":
            res.status(400)
            res.json({ 'err': "Bad formatted data." });
            break;

        default:
            res.status(500).json({ 'err': error.message })
            break;
    }
}