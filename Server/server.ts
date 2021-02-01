import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";
import { ParsedUrlQuery } from "querystring";

/**
 * User class
 */
class User {
    eMail: string;
    password: string;
    name: string;
    surName: string;
    degreeCourse: string;
    semester: string;
    country: string;

    /**
     * Ctor
     * @param eMail 
     * @param name 
     * @param surName 
     * @param degreeCourse
     * @param semester 
     * @param country 
     */
    constructor(
        eMail: string,
        name: string,
        surName: string,
        degreeCourse: string,
        semester: string,
        country: string
    ) {
        this.eMail = eMail;
        this.name = name;
        this.surName = surName;
        this.degreeCourse = degreeCourse;
        this.semester = semester;
        this.country = country;
    }
}

class ExtendedUser extends User {

    isSubscribed: boolean;

    /**
     * Ctor
     * @param eMail 
     * @param name 
     * @param surName 
     * @param degreeCourse
     * @param semester 
     * @param country 
     */
    constructor(
        eMail: string,
        name: string,
        surName: string,
        degreeCourse: string,
        semester: string,
        country: string,
        isSubscribed: boolean
    ) {
        super(eMail, name, surName, degreeCourse, semester, country);

        this.isSubscribed = isSubscribed;
    }
}

/**
 * Subscription class
 */
class Subscription {
    subscriber: string;
    subcsriptionTarget: string;

    /**
     * Ctor
     * @param subscriber 
     * @param subcsriptionTarget 
     */
    constructor(
        subscriber: string,
        subcsriptionTarget: string
    ) {
        this.subscriber = subscriber;
        this.subcsriptionTarget = subcsriptionTarget;
    }
}

/**
 * Subscription class
 */
class MessageBase {
    userMail: string;
    text: string;

    /**
     * Ctor
     * @param userMail 
     * @param text 
     */
    constructor(
        userMail: string,
        text: string
    ) {
        this.userMail = userMail;
        this.text = text;
    }
}

class Message extends MessageBase {
    user: User;

    /**
     * Ctor
     * @param userMail 
     * @param user 
     * @param message 
     */
    constructor(
        userMail: string,
        user: User,
        message: string
    ) {
        super(userMail, message);
        this.user = user;
    }
}


/**
 * Status codes
 */
const enum StatusCodes {
    Good = 1,
    BadDatabaseProblem = 2,
    BadEmailExists = 3,
    BadWrongPassword = 4,
    AlreadySubscribed = 5,
    BadDataRecived = 6
}

export namespace Server {

    // Start the HTTP server
    console.log("Starting server");
    let port: number = Number(process.env.PORT);
    if (!port)
        port = 8100;

    let server: Http.Server = Http.createServer();

    // Add listeners
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);

    // MongoDb connection string
    let url: string = "mongodb+srv://gis-wise-ffr:TpNSSTkmaCmPIlz9@cluster0.rnxgu.mongodb.net/App2?retryWrites=true&w=majority";

    // Create a mongo client
    let options: Mongo.MongoClientOptions;
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(url, options);
    mongoClient.connect();

    /**
     * Show that the server listenss
     */
    function handleListen(): void {
        console.log("Listening");
    }

    /**
     * Handle HTTP request
     * @param _request 
     * @param _response 
     */
    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {

        // Parse request url
        let q: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

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
            let queryParameters: ParsedUrlQuery = q.query;

            // Login user 
            let loginResult: StatusCodes = await loginUserViaMongoDb(queryParameters.eMail as string, queryParameters.password as string);

            // Write statuscode to response
            _response.write(String(loginResult));
        }
        else if (q.pathname == "/register") {
            // Handle register command
            _response.setHeader("content-type", "text/html; charset=utf-8");

            // Create user object from query
            let queryParameters: ParsedUrlQuery = q.query;

            let user: User = new User(
                queryParameters.eMail as string,
                queryParameters.name as string,
                queryParameters.surName as string,
                queryParameters.degreeCourse as string,
                queryParameters.semester as string,
                queryParameters.country as string
            );
            user.password = queryParameters.password as string;

            // Register user in database
            let registerResult: StatusCodes = await addUserToMongoDb(user);

            // Write statuscode to response
            _response.write(String(registerResult));
        }
        else if (q.pathname == "/list") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");


            // Create subscription object from query
            let queryParameters: ParsedUrlQuery = q.query;

            // Get users from database
            let users: ExtendedUser[] = await getUsersFromMongoDb(queryParameters.user.toString());

            // Write users as json to response
            _response.write(JSON.stringify(users));
        }
        else if (q.pathname == "/subscribe") {
            _response.setHeader("content-type", "text/html; charset=utf-8");

            // Create subscription object from query
            let queryParameters: ParsedUrlQuery = q.query;


            if (!queryParameters.subscriber || queryParameters.subscriber.length === 0) {
                _response.write(String(StatusCodes.BadDataRecived));
            }
            else {
                let subscription: Subscription = new Subscription(queryParameters.subscriber.toString(), queryParameters.subscriptionTarget.toString());
                let subscribeResult: StatusCodes = await subscribeUserToMongoDb(subscription);

                _response.write(String(subscribeResult));
            }
        }
        else if (q.pathname == "/message") {
            _response.setHeader("content-type", "text/html; charset=utf-8");

            // Create subscription object from query
            let queryParameters: ParsedUrlQuery = q.query;

            if (!queryParameters.user || queryParameters.user.length === 0
                || !queryParameters.message || queryParameters.message.length === 0) {
                _response.write(String(StatusCodes.BadDataRecived));
            } else {
                let message: MessageBase = new MessageBase(queryParameters.user.toString(), queryParameters.message.toString());
                let messageResult: StatusCodes = await sendMessageToMongoDb(message);

                _response.write(String(messageResult));
            }
        }
        else if (q.pathname == "/messages") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");

            // Create subscription object from query
            let queryParameters: ParsedUrlQuery = q.query;

            // Get users from database
            let messages: Message[] = await getSubscribedMessagesFromMongoDb(queryParameters.user.toString());

            // Write users as json to response
            _response.write(JSON.stringify(messages));
        }
        else if (q.pathname == "/user") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");

            // Create subscription object from query
            let queryParameters: ParsedUrlQuery = q.query;

            // Get users from database
            let resultUser: ExtendedUser = await getUserFromMongoDb(queryParameters.user.toString(), queryParameters.requesteduser.toString());

            // Write users as json to response
            _response.write(JSON.stringify(resultUser));
        }

        else if (q.pathname == "/edituser") {
            // Handle register command
            _response.setHeader("content-type", "text/html; charset=utf-8");

            // Create user object from query
            let queryParameters: ParsedUrlQuery = q.query;

            let user: User = new User(
                queryParameters.eMail as string,
                queryParameters.name as string,
                queryParameters.surName as string,
                queryParameters.degreeCourse as string,
                queryParameters.semester as string,
                queryParameters.country as string
            );

            if (queryParameters.password) {
                user.password = queryParameters.password as string;
            }

            // Register user in database
            let registerResult: StatusCodes = await updateUserToMongoDb(user);

            // Write statuscode to response
            _response.write(String(registerResult));
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

    async function subscribeUserToMongoDb(subscription: Subscription): Promise<StatusCodes> {

        if (subscription.subscriber === subscription.subcsriptionTarget) {
            // Can`t set or remove self subscription.
            // It is always set implicit
            return StatusCodes.Good;
        }

        let subscriptions: Mongo.Collection = mongoClient.db("App2").collection("Subscriptions");
        let existingSubscription: number = await subscriptions.countDocuments({ "subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget });

        if (existingSubscription > 0) {
            // User with email already exists in db

            let result: Mongo.DeleteWriteOpResultObject = await subscriptions.deleteMany({ "subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget });

            if (result.result.ok) {
                // User successfully added
                return StatusCodes.Good;
            }
            else {
                // Database problem
                return StatusCodes.BadDatabaseProblem;
            }
        }
        else {
            // Insert subscription in database
            let result: Mongo.InsertOneWriteOpResult<any> = await subscriptions.insertOne(subscription);

            if (result.insertedCount == 1) {
                // User successfully added
                return StatusCodes.Good;
            }
            else {
                // Database problem
                return StatusCodes.BadDatabaseProblem;
            }
        }
    }


    async function sendMessageToMongoDb(message: MessageBase): Promise<StatusCodes> {
        let messages: Mongo.Collection = mongoClient.db("App2").collection("Messages");

        let result: Mongo.InsertOneWriteOpResult<any> = await messages.insertOne(message);

        if (result.insertedCount == 1) {
            // User successfully added
            return StatusCodes.Good;
        }
        else {
            // Database problem
            return StatusCodes.BadDatabaseProblem;
        }
    }

    async function getSubscribedUsers(user: string): Promise<string[]> {
        let subscriptionCollection: Mongo.Collection = mongoClient.db("App2").collection("Subscriptions");
        let subscriptions: Subscription[] = await subscriptionCollection.find({ "subscriber": user }).toArray();
        let subscribedUsers: string[] = subscriptions.map((value: Subscription) => value.subcsriptionTarget);
        subscribedUsers.push(user);

        return subscribedUsers;
    }

    /**
     * Gets all users and their details from the MongoDb
     */
    async function getSubscribedMessagesFromMongoDb(user: string): Promise<Message[]> {

        let subscribedUsers: String[] = await getSubscribedUsers(user);

        // Get all subscribed users from database
        let usersCollection: Mongo.Collection = mongoClient.db("App2").collection("Users");
        let users: User[] = await usersCollection.find({ "eMail": { $in: subscribedUsers } }).toArray();

        // Get all messages from database
        let messagesCollection: Mongo.Collection = mongoClient.db("App2").collection("Messages");
        let messages: MessageBase[] = await messagesCollection.find({ "userMail": { $in: subscribedUsers } }).toArray();

        // Decode each user document to a user object
        let fullMessages: Message[] = messages.map((message: MessageBase) => new Message(message.userMail, users.find((user) => user.eMail === message.userMail), message.text));

        // Return users array
        return fullMessages;
    }

    /**
     * Adds a user to the MongoDb if its email does not exist already
     * @param user 
     */
    async function addUserToMongoDb(user: User): Promise<StatusCodes> {

        // Check for existing user
        let users: Mongo.Collection = mongoClient.db("App2").collection("Users");
        let existingUserCount: number = await users.countDocuments({ "eMail": user.eMail });

        if (existingUserCount > 0) {
            // User with email already exists in db
            return StatusCodes.BadEmailExists;
        }
        else {

            // Insert user in database
            let result: Mongo.InsertOneWriteOpResult<any> = await users.insertOne(user);

            if (result.insertedCount == 1) {
                // User successfully added
                return StatusCodes.Good;
            }
            else {
                // Database problem
                return StatusCodes.BadDatabaseProblem;
            }
        }
    }

    /**
     * Adds a user to the MongoDb if its email does not exist already
     * @param user 
     */
    async function updateUserToMongoDb(user: User): Promise<StatusCodes> {


        // Check for existing user
        let users: Mongo.Collection = mongoClient.db("App2").collection("Users");

        if (!user.password) {
            // load any because users password is not an constructorparamter and not loaded for client calls 
            let userDocument: any = await users.findOne({ "eMail": user.eMail });
            user.password = userDocument.password;
        }

        // Insert user in database
        let result: Mongo.UpdateWriteOpResult = await users.updateOne(
            { "eMail": user.eMail },
            {
                $set: {
                    "name": user.name,
                    "surName": user.surName,
                    "degreeCourse": user.degreeCourse,
                    "semester": user.semester,
                    "country": user.country,
                    "password": user.password
                }
            });

        if (result.result.ok) {
            // User successfully added
            return StatusCodes.Good;
        }

        // Database problem
        return StatusCodes.BadDatabaseProblem;
    }

    /**
      * Tests if the login with the given password works by checking the MongoDb
      * @param eMail 
      * @param password 
      */
    async function loginUserViaMongoDb(eMail: string, password: string): Promise<StatusCodes> {

        // Check if theres an user with the given email and password
        let users: Mongo.Collection = mongoClient.db("App2").collection("Users");
        let existingUserCount: number = await users.countDocuments({ "eMail": eMail, "password": password });

        if (existingUserCount > 0) {
            // User successfully logged in
            return StatusCodes.Good;
        }
        else {
            // No user with this email password combination
            return StatusCodes.BadWrongPassword;
        }
    }

    /**
     * Gets all users and their details from the MongoDb
     */
    async function getUsersFromMongoDb(user: string): Promise<ExtendedUser[]> {

        let subscribedUsers: string[] = await getSubscribedUsers(user);


        // Get all users from database
        let userCollection: Mongo.Collection = mongoClient.db("App2").collection("Users");
        let userDocuments: User[] = await userCollection.find().toArray();

        let users: ExtendedUser[] = userDocuments.map((user) => new ExtendedUser(user.eMail, user.name, user.surName, user.degreeCourse, user.semester, user.country, subscribedUsers.find((su) => su === user.eMail) != undefined));

        // Return users array
        return users;
    }

    /**
     * Gets all userdata for a single user from the MonoDb
     */
    async function getUserFromMongoDb(user: string, requestedUser: string): Promise<ExtendedUser> {

        let subscribedUsers: string[] = await getSubscribedUsers(user);

        // Get all users from database
        let userCollection: Mongo.Collection = mongoClient.db("App2").collection("Users");
        let mongoDbUser: User = await userCollection.findOne({ "eMail": requestedUser });

        return new ExtendedUser(mongoDbUser.eMail, mongoDbUser.name, mongoDbUser.surName, mongoDbUser.degreeCourse, mongoDbUser.semester, mongoDbUser.country, subscribedUsers.find((su) => su === mongoDbUser.eMail) != undefined);
    }
}

