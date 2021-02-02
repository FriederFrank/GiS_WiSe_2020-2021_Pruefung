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
    getUsersFromServer();
    initializeMessages();
}
/**
 * Gets the users from the server
 */
async function getUsersFromServer() {
    // Get current user
    let currentUser = localStorage.getItem("currentUser");
    let query = new URLSearchParams();
    query.append("user", currentUser);
    let queryUrl = url + "list" + "?" + query.toString();
    // Fetch data from server
    let response = await fetch(queryUrl);
    // Deserialize data to user array
    let users = await response.json();
    // Get the "users" div
    let usersDiv = document.getElementById("users");
    // Clear Users for refresh
    while (usersDiv.hasChildNodes()) {
        usersDiv.removeChild(usersDiv.firstChild);
    }
    // For each user
    for (const user of users) {
        if (user.eMail == currentUser) {
            continue;
        }
        let userDiv = document.createElement("div");
        userDiv.id = user.eMail;
        userDiv.setAttribute("class", "user");
        let userDivClasses = "user";
        let nameDiv = document.createElement("div");
        nameDiv.textContent = user.name + " " + user.surName;
        userDiv.appendChild(nameDiv);
        if (user.isSubscribed) {
            let subscribedDiv = document.createElement("div");
            subscribedDiv.textContent = "Abonniert";
            userDiv.appendChild(subscribedDiv);
            userDivClasses += " subscribed";
        }
        userDiv.setAttribute("class", userDivClasses);
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
            messageTextArea.value = "";
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
    initializeMessages();
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
    // Clear Users for refresh
    while (messagesDiv.hasChildNodes()) {
        messagesDiv.removeChild(messagesDiv.firstChild);
    }
    // For each message
    for (const message of messages.reverse()) {
        let messageDiv = document.createElement("div");
        messageDiv.setAttribute("class", "message");
        let textDiv = document.createElement("div");
        textDiv.textContent = message.text;
        textDiv.setAttribute("class", "message-text");
        let nameDiv = document.createElement("div");
        nameDiv.textContent = message.user.name + " " + message.user.surName + " <" + message.userMail + ">";
        nameDiv.setAttribute("class", "message-name");
        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(nameDiv);
        // Add message to messagesDiv
        messagesDiv.appendChild(messageDiv);
    }
}
function checkCurrentUser() {
    if (localStorage.getItem("currentUser") == null || localStorage.getItem("currentPassword") == null) {
        window.location.href = "../html/index.html";
    }
}
checkCurrentUser();
getUsersFromServer();
initializeMessages();
//# sourceMappingURL=list.js.map