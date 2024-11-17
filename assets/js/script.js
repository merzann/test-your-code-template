import { API_KEY } from "../../config";

const API_URL = "https://ci-jshint.herokuapp.com/api";

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if (response.ok) {
        console.log(data.expiry);
    }
}
