"use strict";
let textbtn = document.getElementById("textarea");
textbtn.addEventListener("click", setText);
async function setText() {
    // Get the form content and prepare the http request
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    let queryUrl = url + "register" + "?" + query.toString();
    // Fetch the response
    var response = await fetch(queryUrl);
}
//# sourceMappingURL=text.js.map