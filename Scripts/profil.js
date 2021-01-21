"use strict";
async function onEditProfilClick(mouseEvent) {
    let nameInput = document.getElementById("name");
    let surNameInput = document.getElementById("surName");
    let eMailInput = document.getElementById("eMail");
    let degreeCourseInput = document.getElementById("degreeCourse");
    let semesterInput = document.getElementById("semester");
    let countryInput = document.getElementById("country");
    let passwordInput = document.getElementById("password");
    // Get the form content and prepare the http request
    let query = new URLSearchParams();
    query.append("name", nameInput.value);
    query.append("surName", surNameInput.value);
    query.append("eMail", eMailInput.value);
    query.append("degreeCourse", degreeCourseInput.value);
    query.append("semester", semesterInput.value);
    query.append("country", countryInput.value);
    query.append("password", passwordInput.value);
    let queryUrl = url + "edituser" + "?" + query.toString();
    // Fetch the response
    let response = await fetch(queryUrl);
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
        if (statusCode == 5 /* AlreadySubscribed */) {
            text.innerText = "User bereits abonniert!";
        }
        else if (statusCode == 1 /* Good */) {
            text.innerText = "Erfolgreich abonniert!";
        }
        else if (statusCode == 2 /* BadDatabaseProblem */) {
            text.innerText = "Unbekanntes Datenbank Problem";
        }
    }
    let serverResult = document.getElementById("serverresult");
    while (serverResult.hasChildNodes()) {
        serverResult.removeChild(serverResult.firstChild);
    }
    serverResult.appendChild(text);
    getUserFromServer();
}
/**
 * Gets the users from the server
 */
async function getUserFromServer() {
    // Get current user
    let currentUser = localStorage.getItem("currentUser");
    let query = new URLSearchParams();
    query.append("user", currentUser);
    query.append("requesteduser", currentUser);
    let queryUrl = url + "user" + "?" + query.toString();
    // Fetch data from server
    let response = await fetch(queryUrl);
    // Deserialize data to user array
    let user = await response.json();
    // Get the "users" div
    let nameInput = document.getElementById("name");
    let surNameInput = document.getElementById("surName");
    let eMailInput = document.getElementById("eMail");
    let degreeCourseInput = document.getElementById("degreeCourse");
    let semesterInput = document.getElementById("semester");
    let countryInput = document.getElementById("country");
    let passwordInput = document.getElementById("password");
    nameInput.value = user.name;
    surNameInput.value = user.surName;
    eMailInput.value = user.eMail;
    degreeCourseInput.value = user.degreeCourse;
    semesterInput.value = user.semester;
    countryInput.value = user.country;
    passwordInput.value = user.password;
}
getUserFromServer();
let sendMessageButton = document.getElementById("editProfil");
sendMessageButton.addEventListener("click", onEditProfilClick);
//# sourceMappingURL=profil.js.map