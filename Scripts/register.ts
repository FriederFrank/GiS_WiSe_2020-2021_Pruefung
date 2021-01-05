
let registerbtn = document.getElementById("register");
registerbtn.addEventListener("click", register);

let oldText: HTMLParagraphElement;

/**
 * Registers a new user
 */
async function register(): Promise<void> {
    
    // Get the form content and prepare the http request
    let formData: FormData = new FormData(document.forms[0]);
    let query: URLSearchParams = new URLSearchParams(<any>formData);
    let queryUrl: string = url + "register" + "?" + query.toString();
    
    // Fetch the response
    var response: Response = await fetch(queryUrl);
    
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
        if (statusCode == StatusCodes.BadEmailExists) {
            text.innerText = "E-Mail existiert bereits!";
        }
        else if (statusCode == StatusCodes.Good) {
            text.innerText = "Erfolgreich registriert!";
            window.location.href = "/GiS_WiSe_2020-2021_Pruefung/html/login.html";
        }
        else if (statusCode == StatusCodes.BadDatabaseProblem) {
            text.innerText = "Unbekanntes Datenbank Problem";
        }
    }
    
    let serverResult: HTMLElement = document.getElementById("serverresult");
    if (oldText != undefined) {
        serverResult.replaceChild(text, oldText);
    }
    else {
        serverResult.appendChild(text);
        
    }
    oldText = text;
 }