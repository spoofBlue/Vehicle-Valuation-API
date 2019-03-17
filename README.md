# Vehicle-Valuation-API
A server with an API that receives vehicle information, validates the vehicle and provides the estimated value of the vehicle.

## Project setup
```
npm install
```

### Run server (node server.js)
```
npm start
```

Documentation Notes:
-	Expect a query string with the required keys: make, model, marketvalue, age, owners.
-	Additionally, the query string may have these optional keys: mileage, collision.
-	Errors will return a json object with an error key.
-	age value should be provided in months
-	owners value should be a number.
-	marketvalue value should be a number.
- collision value should be a number.

To Do List:
-	Create testing for the endpoint (will be using Mocha/Chai)
-	Provide more detail to documentation on this README.md
-	Revisit function comment descriptions
- Could further validate requests (check for integers/ reasonable values)
-	Could setup Travis CI/Heroku deployment  
