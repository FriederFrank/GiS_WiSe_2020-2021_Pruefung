"use strict";
// Set event listener on login button 
let loginbtn = document.getElementById("login");
loginbtn.addEventListener("click", login);
let oldLoginResultText;
/**
 * Login the user
 */
async function login() {
    // Get the form content and prepare the http request
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    let queryUrl = url + "login" + "?" + query.toString();
    // Fetch the response
    var response = await fetch(queryUrl);
    let text = document.createElement("p");
    if (response.status != 200) {
        // Server Error
        text.innerText = "Unbekannter Server Fehler!";
    }
    else {
        // Get return value
        let responseText = await response.text();
        let statusCode = Number.parseInt(responseText);
        // Interpret return value
        if (statusCode == 4 /* BadWrongPassword */) {
            text.innerText = "Falsches Passwort!";
        }
        else if (statusCode == 1 /* Good */) {
            text.innerText = "Passwort korrekt!";
            window.location.href = "/GiS_WiSe_2020-2021_Pruefung/html/index.html";
        }
    }
    // Show message to user
    let serverResult = document.getElementById("serverresult");
    if (oldLoginResultText != undefined) {
        serverResult.replaceChild(text, oldLoginResultText);
    }
    else {
        serverResult.appendChild(text);
    }
    oldLoginResultText = text;
}
//# sourceMappingURL=login.js.map