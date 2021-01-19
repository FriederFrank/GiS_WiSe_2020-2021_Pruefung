"use strict";
let registerbtn = document.getElementById("register");
registerbtn.addEventListener("click", register);
let oldText;
/**
 * Registers a new user
 */
async function register() {
    // Get the form content and prepare the http request
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    let currentUser = query.get("eMail");
    let currentPassword = query.get("password");
    let queryUrl = url + "register" + "?" + query.toString();
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
        if (statusCode == 3 /* BadEmailExists */) {
            text.innerText = "E-Mail existiert bereits!";
        }
        else if (statusCode == 1 /* Good */) {
            text.innerText = "Erfolgreich registriert!";
            localStorage.setItem("currentUser", currentUser);
            localStorage.setItem("currentPassword", currentPassword);
        }
        else if (statusCode == 2 /* BadDatabaseProblem */) {
            text.innerText = "Unbekanntes Datenbank Problem";
        }
    }
    let serverResult = document.getElementById("serverresult");
    if (oldText != undefined) {
        serverResult.replaceChild(text, oldText);
    }
    else {
        serverResult.appendChild(text);
    }
    oldText = text;
}
//# sourceMappingURL=register.js.map