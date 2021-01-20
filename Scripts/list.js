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
    // Get current user
    let currentUser = localStorage.getItem("currentUser");
    // For each user
    for (const user of users) {
        if (user.eMail == currentUser) {
            continue;
        }
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
async function onSendMessageClick() {
    // Get current user
    let currentUser = localStorage.getItem("currentUser");
    // Get message element
    let messageTextArea = document.getElementById("message");
    // Get the form content and prepare the http request
    let query = new URLSearchParams();
    query.append("user", currentUser);
    query.append("message", messageTextArea.value);
    let queryUrl = url + "message" + "?" + query.toString();
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
        if (statusCode == 1 /* Good */) {
            text.innerText = "Nachricht erfolgreich verschickt!";
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
async function initializeMessages() {
    let sendMessageButton = document.getElementById("sendmessage");
    sendMessageButton.addEventListener("click", onSendMessageClick);
    // Get current user
    let currentUser = localStorage.getItem("currentUser");
    // Get the form content and prepare the http request
    let query = new URLSearchParams();
    query.append("user", currentUser);
    let queryUrl = url + "messages" + "?" + query.toString();
    // Fetch data from server
    let response = await fetch(queryUrl);
    // Deserialize data to messages array
    let messages = await response.json();
    // Get the "users" div
    let messagesDiv = document.getElementById("messages");
    // For each user
    for (const message of messages.reverse()) {
        let messageDiv = document.createElement("div");
        messageDiv.setAttribute("class", "message");
        let textDiv = document.createElement("div");
        textDiv.textContent = message.text;
        textDiv.setAttribute("class", "message-text");
        let nameDiv = document.createElement("div");
        nameDiv.textContent = message.userMail;
        nameDiv.setAttribute("class", "message-name");
        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(nameDiv);
        // Add message to messagesDiv
        messagesDiv.appendChild(messageDiv);
    }
}
getUsersFromServer();
initializeMessages();
//# sourceMappingURL=list.js.map