
// Dependencies
const express = require("express");
const cors = require("cors");

const valueRouter = require("./routes/valueRouter");
const { PORT } = require("./config");

// Setup Dependencies
const app = express();

// Client
app.use(express.static('public'));

// Routing
app.use('/value', valueRouter);

app.use(`*`, function (req, res) {
    res.status(400).send({ error: "Invalid route request." });
});

// Opening Server
let server;

function runServer() {    // Starting the app can now be exported for testing.
    server = app.listen(port = PORT, () => {
        console.log(`The app is listening at port ${port}`);
    });
}

function closeServer() {
    server.close(function (err) {
        if (err) {
            console.log("Error: ", err);
        }
        console.log("App has closed");
    });
}

if (require.main === module) {
    runServer();
}

// Exports
module.exports = { app, runServer, closeServer };