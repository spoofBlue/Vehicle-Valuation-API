
console.log(`In valueRouter.js now.`);

// Dependencies
const express = require("express");
const fetch = require('node-fetch');

// Setup Dependencies
const router = express.Router();

// Routing
router.get(``, function (req, res) {
    const { marketvalue, make, model, age, milage, owners, collisions } = req.query;
    console.log(marketvalue, make, model, age, milage, owners, collisions);
    let errorFields = checkQueryForErrors(req.query);
    if (errorFields.length > 0) {
        res.status(400).json(errorFields);
    }
    return validateMake(make)
        .then(() => {
            let cost = marketvalue;
            res.status(200).json({ value: cost });
        })
        .catch(err => {
            res.status(422);
        });

    // Make model age owners is required.
    //AGE:
    //Given the number of months of how old the car is, reduce its value one-half (0.5) percent.  
    //After 10 years, it's value cannot be reduced further by age. This is not cumulative.

    //MILEAGE:
    //Given the vehicle’s mileage, reduce its value by one-fifth of a percent (0.2) for every 1,000 miles.
    //After 150,000 miles, it's value cannot be reduced further by miles.  Do not consider any remaining miles.

    //OWNERS:
    //If the car has had more than 2 previous owners, reduce its value by twenty-five (25) percent.
    //If the car has had no previous owners, add ten (10) percent to the FINAL car value at the end.

    //COLLISIONS:
    //For every reported collision the car has been in, remove two (2) percent of its value, up to five (5) collisions.


});

// Helper Functions

function checkQueryForErrors(query) {
    // Given an object (query), determines if required fields are present.
    // Errors found are represented as an object, pushed into the area errorFields.
    // Returns an array of objects, or an empty array if there's no errors.
    const errorFields = [];
    const requiredFields = ["marketValue", "make", "model", "age", "owners"];
    requiredFields.forEach(field => {
        if (!query[field]) {
            errorFields.push({ [field]: "Field not present." });
        }
    });
    return errorFields;
}

function validateMake(make) {
    // Given a string make, validates whether the make is present in the NHTSA database.
    // // Exam-related note, I could use tertuary statements in place of if-else if necessary.  Whichever conventions are preferred.
    // // Exam-related note, I could use other API retrieval libraries (built-in http, axiom). Just have some preference for node-fetch.
    return fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make.toUpperCase()}?format=json`)
        .then(res => res.json())
        .then(res => {
            console.log(`arrived here. res.Count=`, res.Count);
            if (res.Count > 0) {
                return true;
            } else {
                res.status(422).send("Invalid Make requested.");
            }
        })
        .catch(() => {
            res.status(424).send("A 3rd-party API is down.");
        });
}


module.exports = router;