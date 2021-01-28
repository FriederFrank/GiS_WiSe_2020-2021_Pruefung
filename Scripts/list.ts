

async function onUserClick(mouseEvent: MouseEvent): Promise<void> {

    let currentTarget: Element = mouseEvent.currentTarget as Element;

    // Get Current User from LocalStorage
    let currentUser: string = localStorage.getItem("currentUser");

    // Get the form content and prepare the http request
    let query: URLSearchParams = new URLSearchParams();
    query.append("subscriber", currentUser);
    query.append("subscriptionTarget", currentTarget.id);
    let queryUrl: string = url + "subscribe" + "?" + query.toString();

    // Fetch the response
    let response: Response = await fetch(queryUrl);

    let text: HTMLParagraphElement = document.createElement("p");

    if (response.status != 200) {
        // Server Error
        text.innerText = "Unbekannter Server Fehler!";
    }
    else {
        // Get return value
        let responseText: string = await response.text();
        let statusCode: StatusCodes = Number.parseInt(responseText) as StatusCodes;

        // Interpret return value
        if (statusCode == StatusCodes.AlreadySubscribed) {
            text.innerText = "User bereits abonniert!";
        }
        else if (statusCode == StatusCodes.Good) {
            text.innerText = "Erfolgreich abonniert!";
        }
        else if (statusCode == StatusCodes.BadDatabaseProblem) {
            text.innerText = "Unbekanntes Datenbank Problem";
        }
    }

    let serverResult: HTMLElement = document.getElementById("serverresult");
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
async function getUsersFromServer(): Promise<void> {

    // Get current user
    let currentUser: string = localStorage.getItem("currentUser");

    let query: URLSearchParams = new URLSearchParams();
    query.append("user", currentUser);
    let queryUrl: string = url + "list" + "?" + query.toString();

    // Fetch data from server
    let response: Response = await fetch(queryUrl);

    // Deserialize data to user array
    let users: ExtendedUser[] = await response.json();

    // Get the "users" div
    let usersDiv: HTMLElement = document.getElementById("users");

    // Clear Users for refresh
    while (usersDiv.hasChildNodes()) {
        usersDiv.removeChild(usersDiv.firstChild);
    }

    // For each user
    for (const user of users) {

        if (user.eMail == currentUser) {
            continue;
        }

        let userDiv: HTMLDivElement = document.createElement("div");
        userDiv.id = user.eMail;
        userDiv.setAttribute("class", "user");
        let userDivClasses: string = "user";

        let nameDiv: HTMLDivElement = document.createElement("div");
        nameDiv.textContent = user.name + " " + user.surName;
        userDiv.appendChild(nameDiv);

        if (user.isSubscribed) {
            let subscribedDiv: HTMLDivElement = document.createElement("div");
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


async function onSendMessageClick(): Promise<void> {

    // Get current user
    let currentUser: string = localStorage.getItem("currentUser");

    // Get message element
    let messageTextArea: HTMLTextAreaElement = document.getElementById("message") as HTMLTextAreaElement;

    // Get the form content and prepare the http request
    let query: URLSearchParams = new URLSearchParams();
    query.append("user", currentUser);
    query.append("message", messageTextArea.value);
    let queryUrl: string = url + "message" + "?" + query.toString();

    // Fetch the response
    let response: Response = await fetch(queryUrl);

    let text: HTMLParagraphElement = document.createElement("p");

    if (response.status != 200) {
        // Server Error
        text.innerText = "Unbekannter Server Fehler!";
    }
    else {
        // Get return value
        let responseText: string = await response.text();
        let statusCode: StatusCodes = Number.parseInt(responseText) as StatusCodes;

        // Interpret return value
        if (statusCode == StatusCodes.Good) {
            messageTextArea.value = "";
            text.innerText = "Nachricht erfolgreich verschickt!";
        }
        else if (statusCode == StatusCodes.BadDatabaseProblem) {
            text.innerText = "Unbekanntes Datenbank Problem";
        }
    }

    let serverResult: HTMLElement = document.getElementById("serverresult");
    while (serverResult.hasChildNodes()) {
        serverResult.removeChild(serverResult.firstChild);
    }
    serverResult.appendChild(text);


    initializeMessages();
}

async function initializeMessages(): Promise<void> {

    let sendMessageButton: HTMLElement = document.getElementById("sendmessage");
    sendMessageButton.addEventListener("click", onSendMessageClick);


    // Get current user
    let currentUser: string = localStorage.getItem("currentUser");

    // Get the form content and prepare the http request
    let query: URLSearchParams = new URLSearchParams();
    query.append("user", currentUser);
    let queryUrl: string = url + "messages" + "?" + query.toString();

    // Fetch data from server
    let response: Response = await fetch(queryUrl);

    // Deserialize data to messages array
    let messages: Message[] = await response.json();

    // Get the "users" div
    let messagesDiv: HTMLElement = document.getElementById("messages");

    // Clear Users for refresh
    while (messagesDiv.hasChildNodes()) {
        messagesDiv.removeChild(messagesDiv.firstChild);
    }

    // For each message
    for (const message of messages.reverse()) {

        let messageDiv: HTMLDivElement = document.createElement("div");
        messageDiv.setAttribute("class", "message");

        let textDiv: HTMLDivElement = document.createElement("div");
        textDiv.textContent = message.text;
        textDiv.setAttribute("class", "message-text");

        let nameDiv: HTMLDivElement = document.createElement("div");
        nameDiv.textContent = message.user.name + " " + message.user.surName + " <" + message.userMail + ">";
        nameDiv.setAttribute("class", "message-name");

        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(nameDiv);

        // Add message to messagesDiv
        messagesDiv.appendChild(messageDiv);
    }
}

getUsersFromServer();
initializeMessages();