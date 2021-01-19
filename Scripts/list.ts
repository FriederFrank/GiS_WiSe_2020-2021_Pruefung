

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
            text.innerText = "Erfolgreich registriert!";
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
}


/**
 * Gets the users from the server
 */
async function getUsersFromServer(): Promise<void> {

    // Fetch data from server
    let response: Response = await fetch(url + "list");

    // Deserialize data to user array
    let users: User[] = await response.json();

    // Get the "users" div
    let usersDiv: HTMLElement = document.getElementById("users");

    // Get current user
    let currentUser: string = localStorage.getItem("currentUser");

    // For each user
    for (const user of users) {

        if (user.eMail == currentUser) {
            continue;
        }

        let userDiv: HTMLDivElement = document.createElement("div");
        userDiv.id = user.eMail;
        userDiv.setAttribute("class", "user");
        let nameDiv: HTMLDivElement = document.createElement("div");
        nameDiv.textContent = user.name + " " + user.surName;
        userDiv.appendChild(nameDiv);
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
}

async function initializeMessages() {

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

    // For each user
    for (const message of messages.reverse()) {

        let messageDiv: HTMLDivElement = document.createElement("div");
        messageDiv.setAttribute("class", "message");

        let textDiv: HTMLDivElement = document.createElement("div");
        textDiv.textContent = message.text;

        let nameDiv: HTMLDivElement = document.createElement("div");
        nameDiv.textContent = message.userMail;

        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(nameDiv);
        messageDiv.addEventListener("click", onUserClick);

        // Add message to messagesDiv
        messagesDiv.appendChild(messageDiv);
    }
}

getUsersFromServer();
initializeMessages();