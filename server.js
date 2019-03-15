
// Dependencies
const express = require("express");

const valueRouter = require("./routes/valueRouter");
const { PORT } = require("./config");

// Setup Dependencies
const app = express();

// Routing
app.use('/value', valueRouter);

app.use(`*`, function (req, res) {
    res.status(400).send("Invalid route request.");
});

// Opening Server
function runServer() {    // Starting the app can now be exported for testing.
    app.listen(port = PORT, () => {
        console.log(`The app is listening at port ${port}`);
    });
}

if (require.main === module) {
    runServer();
}

// Exports
module.exports = { app };