
// Dependencies
const express = require("express");
const fetch = require('node-fetch');

// Setup Dependencies
const router = express.Router();

// Routing
router.get(``, function (req, res) {
    let invalidFields = checkQueryForErrors(req.query);
    if (invalidFields.length > 0) {
        res.status(400).send({ error: { invalidFields } });
    }
    return validateMake(req.query.make, req.query.model)
        .then(validMake => {
            if (!validMake) {
                res.status(422).send({ error: { "make-model": "Invalid Make/Model requested." } });
            }
            const cost = determineValue(req.query);
            res.status(200).send({ value: cost });
        })
        .catch(err => {
            res.status(422);
        });
});

// Helper Functions

function checkQueryForErrors(data) {
    // Given an object (query), determines if required fields are present.
    // Errors found are represented as an object, pushed into the area errorFields.
    // Returns an array of objects, or an empty array if there's no errors.
    const invalidFields = [];
    const requiredFields = ["marketvalue", "make", "model", "age", "owners"];
    const numberFields = ["marketvalue", "age", "mileage", "collisions", "owners"];
    requiredFields.forEach(field => {
        if (!data[field]) {
            invalidFields.push({ [field]: "Field not present." });
        }
    });
    numberFields.forEach(field => {
        if (data[field] && isNaN(data[field]) && isNaN(parseFloat(data[field]))) {
            invalidFields.push({ [field]: "Field must be a number." });
        }
    });
    return invalidFields;
}

function validateMake(make, model) {
    // Given two strings (make, model), validates whether the make & model are present in the NHTSA database.
    // // Exam-related note, I could use tertuary statements in place of if-else if necessary.  Whichever conventions are preferred.
    // // Exam-related note, I could use other API retrieval libraries (built-in http.get, axiom). Just have some preference for node-fetch.
    return fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make.trim()}?format=json`)
        .then(res => res.json())
        .then(res => {
            if (res.Count === 0) {
                return false;
            }
            return res.Results.findIndex(car => car.Make_Name.toLowerCase() === make.toLowerCase().trim()) !== -1 &&
                res.Results.findIndex(car => car.Model_Name.toLowerCase() === model.toLowerCase().trim()) !== -1;
        })
        .catch(() => {
            res.status(424).send({ error: { server: "A 3rd-party API is down." } });
        });
}

function determineValue(data) {
    // Given an object (query), values the used car based on multiple factors.
    // Note: ownersFactor must be calculated last here.
    const { marketvalue, age, mileage, owners, collisions } = data;
    let cost = marketvalue;
    ageFactorReduction();
    mileageFactorReduction();
    collisionFactorReduction();
    ownersFactor();

    function ageFactorReduction() {
        //Given the number of months of how old the car is, reduce its value one-half (0.5) percent.  
        //After 10 years, it's value cannot be reduced further by age. This is not cumulative.
        const maxMonths = 120;
        const reductionPerMonth = 0.005;

        cost -= age >= maxMonths ? (cost * maxMonths * reductionPerMonth) : (cost * age * reductionPerMonth);
    }

    function mileageFactorReduction() {
        //Given the vehicle’s mileage, reduce its value by one-fifth of a percent (0.2) for every 1,000 miles.
        //After 150,000 miles, it's value cannot be reduced further by miles.  Do not consider any remaining miles.
        // Note: Assuming cumulative reduction, calculated per 1000 miles.
        const maxMileage = 150000;
        const mileageIncrement = 1000;
        const reductionPerMileageIncrement = .002;

        let increments = mileage >= maxMileage ? Math.floor(maxMileage / mileageIncrement) : Math.floor(mileage / mileageIncrement);
        while (increments > 0) {
            cost -= cost * reductionPerMileageIncrement;
            increments--;
        }
    }

    function collisionFactorReduction() {
        //For every reported collision the car has been in, remove two (2) percent of its value, up to five (5) collisions.
        // Note: Assuming cumulative reduction, calculated per collision.
        const maxCollisions = 5;
        const reductionPerCollision = .02;

        let increments = collisions >= maxCollisions ? maxCollisions : collisions;
        while (increments > 0) {
            cost -= cost * reductionPerCollision;
            increments--;
        }
    }

    function ownersFactor() {
        //If the car has had more than 2 previous owners, reduce its value by twenty-five (25) percent.
        //If the car has had no previous owners, add ten (10) percent to the FINAL car value at the end.
        const reductionForManyOwners = 0.25;
        const noOwnersIncrease = 0.1;

        if (owners > 2) {
            cost -= cost * reductionForManyOwners;
        } else if (owners === "0") {
            cost += cost * noOwnersIncrease;
        }
    }

    return parseFloat(cost.toFixed(2));
}

module.exports = router;