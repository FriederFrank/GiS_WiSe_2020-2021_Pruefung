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
     * @param adress
     * @param city
     * @param postcode
     * @param country
     */
    constructor(eMail, name, surName, adress, city, postcode, country) {
        this.eMail = eMail;
        this.name = name;
        this.surName = surName;
        this.adress = adress;
        this.city = city;
        this.postcode = postcode;
        this.country = country;
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
    let url = "mongodb+srv://gis-wise-ffr:TpNSSTkmaCmPIlz9@cluster0.rnxgu.mongodb.net/App?retryWrites=true&w=majority";
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
            let user = new User(queryParameters.eMail, queryParameters.name, queryParameters.surName, queryParameters.adress, queryParameters.city, queryParameters.postcode, queryParameters.country);
            user.password = queryParameters.password;
            // Register user in database
            let registerResult = await addUserToMongoDb(user);
            // Write statuscode to response
            _response.write(String(registerResult));
        }
        else if (q.pathname == "/list") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");
            // Get users from database
            let users = await getUsersFromMongoDb();
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
            return 5 /* AlreadySubscribed */;
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
    /**
     * Gets all users and their details from the MongoDb
     */
    async function getSubscribedMessagesFromMongoDb(user) {
        let subscriptionCollection = mongoClient.db("App").collection("Subscriptions");
        let subscriptions = await subscriptionCollection.find({ "subscriber": user }).toArray();
        let subscribedUsers = subscriptions.map((value) => value.subcsriptionTarget);
        subscribedUsers.push(user);
        console.log("SubscribedUsers:");
        console.log(JSON.stringify(subscribedUsers));
        // Get all messages from database
        let messagesCollection = mongoClient.db("App").collection("Messages");
        let messages = await messagesCollection.find({ "userMail": { $in: subscribedUsers } }).toArray();
        console.log("Messages:");
        console.log(JSON.stringify(messages));
        // Decode each user document to a user object
        let fullMessages = messages.map((message) => new Message(message.userMail, null, message.text));
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
    async function getUsersFromMongoDb() {
        // Get all users from database
        let userCollection = mongoClient.db("App").collection("Users");
        let userDocuments = await userCollection.find().toArray();
        let users = [];
        // Decode each user document to a user object
        for (const userDocument of userDocuments) {
            let user = new User(userDocument.eMail, userDocument.name, userDocument.surName, userDocument.adress, userDocument.city, userDocument.postcode, userDocument.country);
            // Add user object to array
            users.push(user);
        }
        // Return users array
        return users;
    }
})(Server = exports.Server || (exports.Server = {}));
//# sourceMappingURL=server.js.map