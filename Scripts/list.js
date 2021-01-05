"use strict";
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
    var userCount = 0;
    // For each user
    for (const user of users) {
        let userDiv = document.createElement("div");
        let attributes = new Map();
        attributes.set("First name:", user.name);
        attributes.set("Last name:", user.surName);
        /*attributes.set("E-Mail:", user.eMail);
        attributes.set("Adress:", user.adress);
        attributes.set("City:", user.city);
        attributes.set("Country:", user.country);
        attributes.set("Postcode:", user.postcode);   */
        // Do not create blank line for first user
        if (userCount != 0) {
            let brDiv = document.createElement("br");
            userDiv.appendChild(brDiv);
        }
        // Create a div for each attribute
        for (const attribute of attributes) {
            let nameDiv = document.createElement("div");
            let nameLabelDiv = document.createElement("div");
            nameLabelDiv.textContent = attribute[0];
            let nameValueDiv = document.createElement("div");
            nameValueDiv.textContent = attribute[1];
            nameDiv.appendChild(nameLabelDiv);
            nameDiv.appendChild(nameValueDiv);
            userDiv.appendChild(nameDiv);
        }
        // Add user to userDiv
        usersDiv.appendChild(userDiv);
        userCount++;
    }
}
getUsersFromServer();
//# sourceMappingURL=list.js.map