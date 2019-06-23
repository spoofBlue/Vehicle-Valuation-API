
$(main())

function main() {
    const APIURL = `https://cryptic-plains-11682.herokuapp.com/value`;   // Current online API used.

    formSubmission();

    function formSubmission() {
        // Handles the form submission event. Storing user input into data object and sending object into ajax call.
        clearOutput();
        $("form").on("click", "#car-value-submit-button", function () {
            let data = {
                make: $("#car-make").val(),
                model: $("#car-model").val(),
                marketValue: $("#car-marketvalue").val(),
                age: $("#car-age").val(),
                owners: $("#car-owners").val(),
                mileage: $("#car-mileage").val(),
                collisions: $("#car-collisions").val()
            }
            callVehicleValuationAPI(data, displayValue, failedAjax);
        });
    }

    function clearOutput() {
        $("#api-output").html(``);
    }

    function callVehicleValuationAPI(data, callback, failcall) {
        // Makes a call to the Vehicle-Valuation-API to get a cost analysis given the criteria. given data object.
        // // The API will validate the make/model first. Returns the cost if validated.
        // Runs callback function on success, failcall function in an error.
        const apiLink = APIURL;
        const queryString =
            `?make=${data.make}&model=${data.model}&marketvalue=${data.marketValue}&age=${data.age}&collisions=${data.collisions}&owners=${data.owners}&mileage=${data.mileage}`;
        const settings = {
            url: apiLink + queryString,
            path: `GET`,
            dataType: `json`,
            success: callback,
            error: failcall
        }

        $.ajax(settings);
    }

    function displayValue(output) {
        // On a successful return from the vehicle valuation API. We receive:
        // A calculated value { value : 1000 }
        if (output.value) {
            $("#api-output").html(`Value : ${output.value}`);
        }
    }

    function failedAjax(output) {
        // If there is an invalidation error. We receive:
        // An error notification { responseJSON : {error : {field: "description of fault", field: "description of fault"}}}
        // Otherwise (an Ajax call fails), display a generic response.
        if (output.responseJSON.error) {
            $("#api-output").html(`Error!<br>`);
            Object.entries(output.responseJSON.error).forEach(entry => {
                $("#api-output").append(`${entry[0]}: ${entry[1]}<br>`);
            });
        } else {
            $("#api-output").html(`Error!<br>Server : Our Vehicle Valuation API is not active at this time.`);
        }
    }
}