"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
iport * as;
tt;
from;
"ttp";
KKUAAU, UsBG7IIaAAa, GAAY, UAAU, awB;
IAjE, qCqC;
IACrCIAAI, WAAW, GAAW, YAAY, OAAO, , aa, AACIE9D, oDAoICpD, IIGo, I, eAe, AAECCnDKKCCM, CCYYEAAE, WAAW, CC;
IACxCKKCAAC, oBAAoB, EAAE, aAAa, , EA, CAACrDQQGGGGWAAW, GAAG, GAAG, GAAG, KAAK, QQlEqqra, MAAM, KAAK, CAAC, QAAQ, CAAC, CAAC;
IAE / C, IAAI, IAAI, GAAyaaGGQQCAAC, MAAM, IAAI, GEAAE;
QAxB, ee;
QAfIAAI, , SAAS, GAAG, 4;
BAA4B, CAACKACjD;
SAC;
QCDmmQnIIYAAY, GAAW, QQCCII, CAACCjDUUgMMQQYYgBE3EyByB;
AzB, II, UAAU, 6;
BAAi;
YC7CSSGAAG, yBAAyB, SC9C;
aACgBoEAAE;
YACrC, CAAC, SAAS, 0B0;
S / C;
aACIIAAI, 8;
BAAk, EE;
YAnDIISSGAAG, +BAA + B, CAAC;
SACpD;
KCJ;
ID, YAAY, GAAgB, QAAQ, CAAC, cAAc, cAAcCCAC;
IxE, OAAO, YAAY, aAAa, EAAE, EAAEACjC, YAAY, CAAC, WAAW, CAAC, YAY, AAC;
KCrD;
IDCCWWIIACnC, AAAAGDGAEGAACH, KAAK, UAAU, kBAkB;
AE7B, yBAAyBIACzB, IAAI, QAA, GAAa, MAAM, KAAK, CAAC, GAAG, GAAG, MAAM, CAAC, CAAC;
IniiIj, KAAK, GAAW, MAAM, QAAQCC, EAAEAC;
IE1sBsBItQQgccOOIE7mBAmB;
ICnBIIWAA, G, YAAYOO, aAAaC, AI9gBgBIhB, IAAI, IAAI, KAAK, EAAE;
QAEtB, IAAI, IAAI, CAACKKWW3B, SAAS;
SAZ;
QAEDQ, OAAO, CAAC, EAAE, GAAG, IAAI, CAAC, KAK, AAQACxB, OAAO, CAAC, YAA, CAAC, OAAO, EAAE, MAAM, CAAC, CAAC;
QtOOQ5DOOII, IAAI, GAAG, GAAGGGII, OAOQrDOOQ7BgBgB, EAAE, WAAW / CCj;
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
     * @param subscriber
     * @param subcsriptionTarget
     */
    constructor(userMail, message) {
        this.userMail = userMail;
        this.message = message;
    }
}
class Message extends MessageBase {
    /**
     * Ctor
     * @param subscriber
     * @param subcsriptionTarget
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
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create subscription object from query
            var queryParameters = q.query;
            var subscription = new Subscription(queryParameters.subscriber, queryParameters.subscriptionTarget);
            var subscribeResult = await subscribeUserToMongoDb(subscription);
            _response.write(String(subscribeResult));
        }
        else if (q.pathname == "/message") {
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create subscription object from query
            var queryParameters = q.query;
            var message = new MessageBase(queryParameters.user, queryParameters.message);
            var sendResult = await sendMessageToMongoDb(message);
            _response.write(String(subscribeResult));
        }
        else {
            // Log unhandled paths
            _response.setHeader("content-type", "text/html; charset=utf-8");
            _response.write(String(1337));
            _response.setHeader("content-type", "application/json; charset=utf-8");
            // Get users from database
            var users = await getUsersFromMongoDb();
            // Write users as json to response
            _response.write(JSON.stringify(users));
        }
        if (q.pathname == "/subscribe") {
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create subscription object from query
            var queryParameters = q.query;
            var subscription = new Subscription(queryParameters.subscriber, queryParameters.subscriptionTarget);
            var subscribeResult = await subscribeUserToMongoDb(subscription);
            _response.write(String(subscribeResult));
        }
        else if (q.pathname == "/message") {
            _response.setHeader("content-type", "text/html; charset=utf-8");
            // Create subscription object from query
            var queryParameters = q.query;
            var subscription = new Subscription(queryParameters.subscriber, queryParameters.subscriptionTarget);
            var subscribeResult = await subscribeUserToMongoDb(subscription);
            _response.write(String(subscribeResult));
        }
        else {
            // Log unhandled paths
            _response.setHeader("content-type", "text/html; charset=utf-8");
            _response.write(String(1337));
            var subscription = new Subscription(queryParameters.subscriber, queryParameters.subscriptionTarget);
            var subscribeResult = await subscribeUserToMongoDb(subscription);
            _response.write(String(subscribeResult));
        }
        {
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
        var existiSubscription = await subscriptions.countDocuments({ "subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget });
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
    async function sendMessageToMongoDb(message) {
        let messages = mongoClient.db("App").collection("Messages");
        // var existingSubscription: number = await subscriptions.countDocuments({"subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget});
        var result = await messages.insertOne(message);
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
        // User successfully added
        return 1 /* Good */;
    }
    {
        // Database problem
        return StatusCodes.BadDatabaseProblem;
    }
})(Server = exports.Server || (exports.Server = {}));
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
}
/**
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
}
/**
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
}
/**
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
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
    // User successfully added
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
}
/**
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
}
/**
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    return 1 /* Good */;
}
{
    // Database problem
    return StatusCodes.BadDatabaseProblem;
}
/**
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
 * Adds a user to the MongoDb if its email does not exist already
 * @param user
 */
async function addUserToMongoDb(user) {
    // Check for existing user
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
    let users = mongoClient.db("App").collection("Users");
    var existingUserCount = await users.coun, tDocuments;
    ({ "eMail": user.eMail });
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
//# sourceMappingURL=server.js.map