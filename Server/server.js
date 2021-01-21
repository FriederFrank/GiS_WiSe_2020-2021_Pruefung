"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
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
var Server;
(function (Server) {
    // Start the HTTP server
    console.log("Starting server");
    let port = Number(process.env.PORT);
    if (!port)
        port = 8100;
    let server = Http.createServer();
    // Add listeners
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);
    // MongoDb connection string
    let url = "mongodb+srv://gis-wise-ffr:TpNSSTkmaCmPIlz9@cluster0.rnxgu.mongodb.net/App2?retryWrites=true&w=majority";
    // Create a mongo client
    let options;
    let mongoClient = new Mongo.MongoClient(url, options);
    mongoClient.connect();
    /**
     * Show that the server listenss
     */
    function handleListen() {
        console.log("Listening");
    }
    /**
     * Handle HTTP request
     * @param _request
     * @param _response
     */
    async function handleRequest(_request, _response) {
        // Parse request url
        let q = Url.parse(_request.url, true);
        // Skip favicon requests
        if (q.path == "/favicon.ico") {
            _response.end();
            return;
        }
        // Set header responses
        _response.setHeader("Access-Control-Allow-Origin", "*");
        // Log path and search
        console.log(q.pathname);
        console.log(q.search);
        if (q.pathname == "/login") {
            // Handle login command     
            _response.setHeader("content-type", "text/html; charset=utf-8");
            let queryParameters = q.query;
            // Login user 
            let loginResult = await loginUserViaMongoDb(queryParameters.eMail, queryParameters.password);
            // Write statuscode to response
            _response.write(String(loginResult));
        }
        else if (q.pathname == "/register") {
            // Handle register command
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create user object from query
            let queryParameters = q.query;
            let user = new User(queryParameters.eMail, queryParameters.name, queryParameters.surName, queryParameters.semester, queryParameters.degreeCourse, queryParameters.country);
            user.password = queryParameters.password;
            // Register user in database
            let registerResult = await addUserToMongoDb(user);
            // Write statuscode to response
            _response.write(String(registerResult));
        }
        else if (q.pathname == "/list") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");
            // Create subscription object from query
            let queryParameters = q.query;
            // Get users from database
            let users = await getUsersFromMongoDb(queryParameters.user.toString());
            // Write users as json to response
            _response.write(JSON.stringify(users));
        }
        else if (q.pathname == "/subscribe") {
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create subscription object from query
            let queryParameters = q.query;
            if (!queryParameters.subscriber || queryParameters.subscriber.length === 0) {
                _response.write(String(6 /* BadDataRecived */));
            }
            else {
                let subscription = new Subscription(queryParameters.subscriber.toString(), queryParameters.subscriptionTarget.toString());
                let subscribeResult = await subscribeUserToMongoDb(subscription);
                _response.write(String(subscribeResult));
            }
        }
        else if (q.pathname == "/message") {
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create subscription object from query
            let queryParameters = q.query;
            if (!queryParameters.user || queryParameters.user.length === 0
                || !queryParameters.message || queryParameters.message.length === 0) {
                _response.write(String(6 /* BadDataRecived */));
            }
            else {
                let message = new MessageBase(queryParameters.user.toString(), queryParameters.message.toString());
                let messageResult = await sendMessageToMongoDb(message);
                _response.write(String(messageResult));
            }
        }
        else if (q.pathname == "/messages") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");
            // Create subscription object from query
            let queryParameters = q.query;
            // Get users from database
            let messages = await getSubscribedMessagesFromMongoDb(queryParameters.user.toString());
            // Write users as json to response
            _response.write(JSON.stringify(messages));
        }
        else {
            // Log unhandled paths
            _response.setHeader("content-type", "text/html; charset=utf-8");
            _response.write(String(1337));
            console.log(_request.url);
        }
        //End response
        _response.end();
    }
    async function subscribeUserToMongoDb(subscription) {
        let subscriptions = mongoClient.db("App").collection("Subscriptions");
        let existingSubscription = await subscriptions.countDocuments({ "subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget });
        if (existingSubscription > 0) {
            // User with email already exists in db
            let result = await subscriptions.deleteMany({ "subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget });
            if (result.result.ok) {
                // User successfully added
                return 1 /* Good */;
            }
            else {
                // Database problem
                return 2 /* BadDatabaseProblem */;
            }
        }
        else {
            // Insert subscription in database
            let result = await subscriptions.insertOne(subscription);
            if (result.insertedCount == 1) {
                // User successfully added
                return 1 /* Good */;
            }
            else {
                // Database problem
                return 2 /* BadDatabaseProblem */;
            }
        }
    }
    async function sendMessageToMongoDb(message) {
        let messages = mongoClient.db("App").collection("Messages");
        let result = await messages.insertOne(message);
        if (result.insertedCount == 1) {
            // User successfully added
            return 1 /* Good */;
        }
        else {
            // Database problem
            return 2 /* BadDatabaseProblem */;
        }
    }
    async function getSubscribedUsers(user) {
        let subscriptionCollection = mongoClient.db("App").collection("Subscriptions");
        let subscriptions = await subscriptionCollection.find({ "subscriber": user }).toArray();
        let subscribedUsers = subscriptions.map((value) => value.subcsriptionTarget);
        subscribedUsers.push(user);
        return subscribedUsers;
    }
    /**
     * Gets all users and their details from the MongoDb
     */
    async function getSubscribedMessagesFromMongoDb(user) {
        let subscribedUsers = await getSubscribedUsers(user);
        // Get all subscribed users from database
        let usersCollection = mongoClient.db("App").collection("Users");
        let users = await usersCollection.find({ "eMail": { $in: subscribedUsers } }).toArray();
        // Get all messages from database
        let messagesCollection = mongoClient.db("App").collection("Messages");
        let messages = await messagesCollection.find({ "userMail": { $in: subscribedUsers } }).toArray();
        // Decode each user document to a user object
        let fullMessages = messages.map((message) => new Message(message.userMail, users.find((user) => user.eMail === message.userMail), message.text));
        // Return users array
        return fullMessages;
    }
    /**
     * Adds a user to the MongoDb if its email does not exist already
     * @param user
     */
    async function addUserToMongoDb(user) {
        // Check for existing user
        let users = mongoClient.db("App").collection("Users");
        let existingUserCount = await users.countDocuments({ "eMail": user.eMail });
        if (existingUserCount > 0) {
            // User with email already exists in db
            return 3 /* BadEmailExists */;
        }
        else {
            // Insert user in database
            let result = await users.insertOne(user);
            if (result.insertedCount == 1) {
                // User successfully added
                return 1 /* Good */;
            }
            else {
                // Database problem
                return 2 /* BadDatabaseProblem */;
            }
        }
    }
    /**
      * Tests if the login with the given password works by checking the MongoDb
      * @param eMail
      * @param password
      */
    async function loginUserViaMongoDb(eMail, password) {
        // Check if theres an user with the given email and password
        let users = mongoClient.db("App").collection("Users");
        let existingUserCount = await users.countDocuments({ "eMail": eMail, "password": password });
        if (existingUserCount > 0) {
            // User successfully logged in
            return 1 /* Good */;
        }
        else {
            // No user with this email password combination
            return 4 /* BadWrongPassword */;
        }
    }
    /**
     * Gets all users and their details from the MongoDb
     */
    async function getUsersFromMongoDb(user) {
        let subscribedUsers = await getSubscribedUsers(user);
        // Get all users from database
        let userCollection = mongoClient.db("App").collection("Users");
        let userDocuments = await userCollection.find().toArray();
        let users = userDocuments.map((user) => new ExtendedUser(user.eMail, user.name, user.surName, user.degreeCourse, user.semester, user.country, subscribedUsers.find((su) => su === user.eMail) != undefined));
        // Return users array
        return users;
    }
})(Server = exports.Server || (exports.Server = {}));
//# sourceMappingURL=server.js.map