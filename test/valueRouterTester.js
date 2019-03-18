
// Dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server");

const { determineValue } = require("../routes/valueRouter");  // !!!!

// Setup Dependencies
const expect = chai.expect;
chai.use(chaiHttp);

// Helper Functions

const DEFAULTDATA = {
    make: "honda",
    model: "civic",
    marketvalue: 1000,
    age: 0,
    owners: 1,
    mileage: 0,
    collisions: 0
}

// This can be removed.
function generateQuery(data = DEFAULTDATA) {
    // Given an object data, returns a string with the key=value data formatted into a url query.  !!!!
    /*
    const possibleFactors = [make, model, marketvalue, age, owners, mileage, collisions];
    return possibleFactors.reduce(function(queryString, factor) {
        return data.factor ? `${factor}=${data[factor]}&` : ``;
    }, `?`).slice(-1,1);
    */
    return `?make=${data.make}&model=${data.model}&marketvalue=${data.marketvalue}` +
        `&age=${data.age}&owners=${data.owners}&mileage=${data.mileage}&collisions=${data.collisions}`;
}

describe("Server Testing", function () {
    before(function () {
        return runServer();
    });
    after(function () {
        return closeServer();
    });

    it("returns a value, given a valid make, valid model, marketvalue, age, and owners", function () {
        const query = `?make=honda%20&model=%20civic&marketvalue=1000&age=0&owners=1`
        return chai.request(app)
            .get(`/value${query}`)
            .then(function (res) {
                console.log(res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.key("value");
                expect(res.body.value).to.equal(1000);
            })
            .catch(function (err) {
                expect(err).to.be.null;
            });
    });

    it("returns an error due to an invalid make", function () {
        const query = `?make=zyx1111&model=civic&marketvalue=1000&age=0&owners=1`
        return chai.request(app)
            .get(`/value${query}`)
            .then(function (res) {
                console.log(res.body);
                expect(res).to.have.status(422);
                expect(res.body).to.have.key("error");
                expect(res.body.error["make-model"]).to.equal("Invalid Make/Model requested.");
            })
            .catch(function (err) {
                expect(err).to.be.null;
            });

    });

    it("returns an error due to missing request criteria. 3 missing keys in this case.", function () {
        const query = `?make=honda&model=civic`
        return chai.request(app)
            .get(`/value${query}`)
            .then(function (res) {
                console.log(res.body);
                expect(res).to.have.status(400);
                expect(res.body).to.have.key("error");
                expect(res.body.error["invalidFields"]).to.have.length(3);
            })
            .catch(function (err) {
                expect(err).to.be.null;
            });

    });


});

// /value?make=honda&model=civic&marketvalue=1000&age=0&owners=1&mileage=0&collisions=0   !!!