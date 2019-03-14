
console.log("In server.js now.");

// Dependencies
const express = require("express");

const validationRouter = require("./routes/validationRouter");
const valueRouter = require("./routes/valueRouter");
const { PORT } = require("./config");

// Setup Dependencies
const app = express();

app.use('/value', validationRouter, valueRouter);

app.use(`*`, function (req, res) {
    res.send("Invalid route request");
});

function runServer() {    // Starting the app can now be exporting to testing.
    app.listen(port = PORT, () => {
        console.log(`The app is listening at port ${port}`);
    });
}

if (require.main === module) {
    runServer();
}

// Exports
module.exports = { app };