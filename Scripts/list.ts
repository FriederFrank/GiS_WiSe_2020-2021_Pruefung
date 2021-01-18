

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

    // For each user
    for (const user of users) {

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

getUsersFromServer();