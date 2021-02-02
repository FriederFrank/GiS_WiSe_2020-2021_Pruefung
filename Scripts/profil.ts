async function onEditProfilClick(): Promise<void> {

    let nameInput: HTMLInputElement = document.getElementById("name") as HTMLInputElement;
    let surNameInput: HTMLInputElement = document.getElementById("surName") as HTMLInputElement;
    let eMailInput: HTMLInputElement = document.getElementById("eMail") as HTMLInputElement;
    let degreeCourseInput: HTMLInputElement = document.getElementById("degreeCourse") as HTMLInputElement;
    let semesterInput: HTMLInputElement = document.getElementById("semester") as HTMLInputElement;
    let countryInput: HTMLInputElement = document.getElementById("country") as HTMLInputElement;
    let passwordInput: HTMLInputElement = document.getElementById("password") as HTMLInputElement;

    // Get the form content and prepare the http request
    let query: URLSearchParams = new URLSearchParams();
    query.append("name", nameInput.value);
    query.append("surName", surNameInput.value);
    query.append("eMail", eMailInput.value);
    query.append("degreeCourse", degreeCourseInput.value);
    query.append("semester", semesterInput.value);
    query.append("country", countryInput.value);
    query.append("password", passwordInput.value);

    let queryUrl: string = url + "edituser" + "?" + query.toString();

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
            text.innerText = "Erfolgreich geändert!";
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

    getUserFromServer();
}

/**
 * Gets the users from the server
 */
async function getUserFromServer(): Promise<void> {

    // Get current user
    let currentUser: string = localStorage.getItem("currentUser");

    let query: URLSearchParams = new URLSearchParams();
    query.append("user", currentUser);
    query.append("requesteduser", currentUser);
    let queryUrl: string = url + "user" + "?" + query.toString();

    // Fetch data from server
    let response: Response = await fetch(queryUrl);

    // Deserialize data to user array
    let user: ExtendedUser = await response.json();

    // Get the "users" div
    let nameInput: HTMLInputElement = document.getElementById("name") as HTMLInputElement;
    let surNameInput: HTMLInputElement = document.getElementById("surName") as HTMLInputElement;
    let eMailInput: HTMLInputElement = document.getElementById("eMail") as HTMLInputElement;
    let degreeCourseInput: HTMLInputElement = document.getElementById("degreeCourse") as HTMLInputElement;
    let semesterInput: HTMLInputElement = document.getElementById("semester") as HTMLInputElement;
    let countryInput: HTMLInputElement = document.getElementById("country") as HTMLInputElement;
    let passwordInput: HTMLInputElement = document.getElementById("password") as HTMLInputElement;

    nameInput.value = user.name;
    surNameInput.value = user.surName;
    eMailInput.value = user.eMail;
    degreeCourseInput.value = user.degreeCourse;
    semesterInput.value = user.semester;
    countryInput.value = user.country;
    if (user.password != undefined) {
        passwordInput.value = user.password;
    }
}

checkCurrentUser();
getUserFromServer();

let sendMessageButton: HTMLElement = document.getElementById("editProfil");
sendMessageButton.addEventListener("click", onEditProfilClick);