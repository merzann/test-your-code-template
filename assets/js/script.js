import { API_KEY } from "../../config.js";

const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// eventListeners for check key and post the form
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// function to process option selection in correct format expected as input by API
function processOptions(form) {
    let optArray = [];

    for (let e of form.entries()) {
        if (e[0] === "options") {
            optArray.push(e[1]);
        }
    }

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

// async function for POST request to API
async function postForm(e) {

    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    // Promise to check results returned from postForm
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }

}

// async function for GET request
async function getStatus(e) {

    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }

}

// function for handling API errors and displaying a message to user in modal
function displayException(data) {
    let heading = `<div class="error-heading">An Exception Occurred</div>`;

    const statusCode = data.status_code || "N/A";
    const errorNo = data.error_no || "N/A";
    const errorText = data.error || "No additional information available.";

    let results = `<div>The API returned status code ${statusCode}</div>`;
    results += `<div>Error number: <strong>${errorNo}</strong></div>`;
    results += `<div>Error text: <strong>${errorText}</strong></div>`;

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

// function to display results from postForm in modal
function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

// function to display key expiry date in console and modal
function displayStatus(data) {
    
    console.log(`Expiry Date: ${data.expiry}`);
    
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}
