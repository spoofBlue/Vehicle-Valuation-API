
// Dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server");

// Setup Dependencies
const expect = chai.expect;
chai.use(chaiHttp);

// Tests
describe("Server Testing", function () {
    before(function () {
        return runServer();
    });
    after(function () {
        return closeServer();
    });

    it("returns a value, given a valid make, valid model, marketvalue, age, and owners", function () {
        const query = `?make=honda&model=civic&marketvalue=1000&age=0&owners=1`
        return chai.request(app)
            .get(`/value${query}`)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.key("value");
                expect(res.body.value).to.equal(1000);
            })
            .catch(function (err) {
                expect(err).to.be.null;
            });
    });

    it("returns a value, given a valid make, valid model, marketvalue, age, mileage, collisions, and owners", function () {
        const query = `?make=honda&model=civic&marketvalue=1000&age=12&mileage=1000&collisions=1&owners=2`
        return chai.request(app)
            .get(`/value${query}`)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.key("value");
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
                console.log('in res', res.body);
                expect(res).to.have.status(400);
                expect(res.body).to.have.key("error");
                expect(res.body.error).to.have.keys("marketValue", "age", "owners");
            })
            .catch(function (err) {
                console.log('in catch', err.body);
            });
    });
});