"use strict";
/**
 * Server url
 */
const url = "https://gis-wise-2020-2021-pruefung.herokuapp.com/";
//const url: String = "http://localhost:8100/";
/**
 * User class
 */
class User {
    /**
     * Ctor
     * @param eMail
     * @param name
     * @param surName
     * @param degreeCourse
     * @param semester
     * @param country
     */
    constructor(eMail, name, surName, degreeCourse, semester, country) {
        this.eMail = eMail;
        this.name = name;
        this.surName = surName;
        this.degreeCourse = degreeCourse;
        this.semester = semester;
        this.country = country;
    }
}
class ExtendedUser extends User {
    /**
     * Ctor
     * @param eMail
     * @param name
     * @param surName
     * @param degreeCourse
     * @param semester
     * @param country
     */
    constructor(eMail, name, surName, degreeCourse, semester, country, isSubscribed) {
        super(eMail, name, surName, degreeCourse, semester, country);
        this.isSubscribed = isSubscribed;
    }
}
/**
 * Subscription class
 */
class Subscription {
    /**
     * Ctor
     * @param subscriber
     * @param subcsriptionTarget
     */
    constructor(subscriber, subcsriptionTarget) {
        this.subscriber = subscriber;
        this.subcsriptionTarget = subcsriptionTarget;
    }
}
/**
 * Subscription class
 */
class MessageBase {
    /**
     * Ctor
     * @param userMail
     * @param text
     */
    constructor(userMail, text) {
        this.userMail = userMail;
        this.text = text;
    }
}
class Message extends MessageBase {
    /**
     * Ctor
     * @param userMail
     * @param user
     * @param message
     */
    constructor(userMail, user, message) {
        super(userMail, message);
        this.user = user;
    }
}
function checkCurrentUser() {
    if (localStorage.getItem("currentUser") == null || localStorage.getItem("currentPassword") == null) {
        window.location.href = "../html/index.html";
    }
}
//# sourceMappingURL=shared.js.map