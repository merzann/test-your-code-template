import { API_KEY } from "../../config.js";

const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// eventListeners for check key and post the form
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// async function for POST request to API
async function postForm(e) {

    const form = new FormData(document.getElementById("checksform"));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

}

// async function for GET request
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

// function to display key expry date in both, console and modal
function displayStatus(data) {
    
    console.log(`Expiry Date: ${data.expiry}`);
    
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}
