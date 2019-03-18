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

### Test server (mocha)
```
npm test
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

-	Provide more detail to documentation on this README.md
-	Can create additional tests for the endpoint
-	Could setup Travis CI/Heroku deployment  
