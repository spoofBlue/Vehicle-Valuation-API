# Vehicle-Valuation-API
A server with an API that receives vehicle information, validates the vehicle and provides the estimated cost of the vehicle given several factors (marketvalue, age, owners, mileage, collisions... see "Car Valuation Criteria" for details).

## Client Sample to use API
Here is a simple client to allow you to make inputs to the API:
https://cryptic-plains-11682.herokuapp.com/

## Making a Request
Make requests through the following endpoint:
https://cryptic-plains-11682.herokuapp.com/value

A model example of an API call to this endpoint:
https://cryptic-plains-11682.herokuapp.com/value?make=honda&model=civic&marketvalue=5000&age=0&owners=1&mileage=0&collisions=0

### When submitting a request, the following parameters are used:

- **make**: (required) The make of the car.  This field is validated through https://vpic.nhtsa.dot.gov/api/ .

- **model**: (required) The model of the car. This field is validated through https://vpic.nhtsa.dot.gov/api/ .

- **marketvalue**: (required) The value of the car when brand new/market value. Must be a number.

- **age**: (required) must be a number, The age of the car in months. Must be a number.

- **owners**: (required) The amount of owners the car has had. Must be a number.

- **mileage**: The amount of miles the car has been driven. Must be a number.

- **collisions**: The amount of collisions the car has undergone. Must be a number.

## Receiving a Response
### The response will come back as a json object. There are two possible responses to a request:

**Success**: An object containing a valuation of the car cost.  This response will have the "value" key, in the form of {value : 1000}.

example: https://cryptic-plains-11682.herokuapp.com/value?make=honda&model=civic&marketvalue=5000&age=0&owners=1&mileage=0&collisions=0

**Error**: An object containing details of the error. This response will have the "error" key with a value containing the type of error.

example: https://cryptic-plains-11682.herokuapp.com/value?make=honda&model=civic&marketvalue=5000&owners=1&mileage=hello&collisions=0

## Car Valuation Criteria
### The following criteria is used to determine the value of the car:

- **marketvalue**:
The starting value of the car, before other criteria are applied.

- **age**:
Given the number of months of how old the car is, reduce its value one-half (0.5) percent.  
After 10 years, it's value cannot be reduced further by age. This is not cumulative.

- **mileage**:
Given the vehicle’s mileage, reduce its value by one-fifth of a percent (0.2) for every 1,000 miles.
After 150,000 miles, it's value cannot be reduced further by miles.  Remaining miles are not considered.

- **owners**:
If the car has had more than 2 previous owners, reduce its value by twenty-five (25) percent.
If the car has had no previous owners, add ten (10) percent to the FINAL car value at the end.

- **collisions**:
For every reported collision the car has been in, remove two (2) percent of its value, up to five (5) collisions.


## Project setup
```
npm install
```

### Run server (node server.js)
```
npm start
```

### Test server (mocha)
```
npm test
```

Possible To Do List:

-	Can create additional tests for the endpoint.
