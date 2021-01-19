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
            var queryParameters = q.query;
            // Login user 
            var loginResult = await loginUserViaMongoDb(queryParameters.eMail, queryParameters.password);
            // Write statuscode to response
            _response.write(String(loginResult));
        }
        else if (q.pathname == "/register") {
            // Handle register command
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create user object from query
            var queryParameters = q.query;
            let user = new User(queryParameters.eMail, queryParameters.name, queryParameters.surName, queryParameters.adress, queryParameters.city, queryParameters.postcode, queryParameters.country);
            user.password = queryParameters.password;
            // Register user in database
            var registerResult = await addUserToMongoDb(user);
            // Write statuscode to response
            _response.write(String(registerResult));
        }
        else if (q.pathname == "/list") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");
            // Get users from database
            var users = await getUsersFromMongoDb();
            // Write users as json to response
            _response.write(JSON.stringify(users));
        }
        else if (q.pathname == "/subscribe") {
            console.log(_request.url);
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create subscription object from query
            var queryParameters = q.query;
            var subscription = new Subscription(queryParameters.subscriber, queryParameters.subscriptionTarget);
            var subscribeResult = subscribeUserToMongoDb(subscription);
            _response.write(String(subscribeResult));
        }
        else {
            // Log unhandled paths
            _response.setHeader("content-type", "text/html; charset=utf-8");
            _response.write(String(1338));
            console.log(_request.url);
        }
        //End response
        _response.end();
    }
    async function subscribeUserToMongoDb(subscription) {
        let subscriptions = mongoClient.db("App").collection("Subscriptions");
        var existingSubscription = await subscriptions.countDocuments({ "subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget });
        if (existingSubscription > 0) {
            // User with email already exists in db
            return 5 /* AlreadySubscribed */;
        }
        else {
            // Insert subscription in database
            var result = await subscriptions.insertOne(subscription);
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
     * Adds a user to the MongoDb if its email does not exist already
     * @param user
     */
    async function addUserToMongoDb(user) {
        // Check for existing user
        let users = mongoClient.db("App").collection("Users");
        var existingUserCount = await users.countDocuments({ "eMail": user.eMail });
        if (existingUserCount > 0) {
            // User with email already exists in db
            return 3 /* BadEmailExists */;
        }
        else {
            // Insert user in database
            var result = await users.insertOne(user);
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
        var existingUserCount = await users.countDocuments({ "eMail": eMail, "password": password });
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