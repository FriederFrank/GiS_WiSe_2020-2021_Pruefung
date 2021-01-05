
// Set event listener on login button 
let loginbtn: HTMLElement = document.getElementById("login");
loginbtn.addEventListener("click", login);

let oldLoginResultText: HTMLParagraphElement;

/**
 * Login the user
 */

async function login(): Promise<void> {
    
    // Get the form content and prepare the http request
    let formData: FormData = new FormData(document.forms[0]);
    let query: URLSearchParams = new URLSearchParams(<any>formData);
    let queryUrl: string = url + "login" + "?" + query.toString();
    
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
        if (statusCode == StatusCodes.BadWrongPassword) {
            text.innerText = "Falsches Passwort!";
        }
        else if (statusCode == StatusCodes.Good) {
            text.innerText = "Passwort korrekt!";
            window.location.href = "/GiS_WiSe_2020-2021_Pruefung/html/index.html";
        }
    }

    // Show message to user
    let serverResult: HTMLElement = document.getElementById("serverresult");
    if (oldLoginResultText != undefined) {
        serverResult.replaceChild(text, oldLoginResultText);
    }
    else {
        serverResult.appendChild(text);         
    }
    oldLoginResultText = text;
 }