"use strict";
async function onUserClick(mouseEvent) {
    let currentTarget = mouseEvent.currentTarget;
    // Get Current User from LocalStorage
    let currentUser = localStorage.getItem("currentUser");
    // Get the form content and prepare the http request
    let query = new URLSearchParams();
    query.append("subscriber", currentUser);
    query.append("subscriptionTarget", currentTarget.id);
    let queryUrl = url + "subscribe" + "?" + query.toString();
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
            text.innerText = "Erfolgreich registriert!";
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
}
/**
 * Gets the users from the server
 */
async function getUsersFromServer() {
    // Fetch data from server
    let response = await fetch(url + "list");
    // Deserialize data to user array
    let users = await response.json();
    // Get the "users" div
    let usersDiv = document.getElementById("users");
    // For each user
    for (const user of users) {
        let userDiv = document.createElement("div");
        userDiv.id = user.eMail;
        userDiv.setAttribute("class", "user");
        let nameDiv = document.createElement("div");
        nameDiv.textContent = user.name + " " + user.surName;
        userDiv.appendChild(nameDiv);
        userDiv.addEventListener("click", onUserClick);
        // Add user to userDiv
        usersDiv.appendChild(userDiv);
    }
}
getUsersFromServer();
//# sourceMappingURL=list.js.map