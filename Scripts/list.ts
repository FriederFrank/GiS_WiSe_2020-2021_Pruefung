
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
    
    var userCount: number = 0;

    // For each user
    for (const user of users) {
        
        let userDiv: HTMLDivElement = document.createElement("div");  
        
        let attributes: Map<string, string> = new Map<string, string>();
        attributes.set(user.surName, user.name);
        /*attributes.set("Last name:", user.surName);
        /*attributes.set("E-Mail:", user.eMail);
        attributes.set("Adress:", user.adress);
        attributes.set("City:", user.city);
        attributes.set("Country:", user.country);
        attributes.set("Postcode:", user.postcode);   */ 
        
        // Do not create blank line for first user
        if (userCount != 0 ) {
            let brDiv: HTMLBRElement = document.createElement("br");
            userDiv.appendChild(brDiv);
        }

        // Create a div for each attribute
        for (const attribute of attributes) {        
            let nameDiv: HTMLDivElement = document.createElement("div");
            /*let nameLabelDiv: HTMLDivElement = document.createElement("div");
            nameLabelDiv.textContent = attribute[0];*/
            let nameValueDiv: HTMLDivElement = document.createElement("div");
            nameValueDiv.textContent = attribute[1];        
            
            /*nameDiv.appendChild(nameLabelDiv);*/
            /*nameDiv.appendChild(nameValueDiv);*/
            userDiv.appendChild(nameDiv);
        }
          
        // Add user to userDiv
        usersDiv.appendChild(userDiv);
        userCount++;
    }
}

getUsersFromServer();