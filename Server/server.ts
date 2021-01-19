import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

/**
 * User class
 */
class User {
    eMail: string;
    password: string;
    name: string;
    surName: string;
    adress: string;
    city: string;
    postcode: string;
    country: string;

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
    constructor(
        eMail: string,
        name: string,
        surName: string,
        adress: string,
        city: string,
        postcode: string,
        country: string
    ) {
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
    AlreadySubscribed = 5
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
    let url: string = "mongodb+srv://gis-wise-ffr:TpNSSTkmaCmPIlz9@cluster0.rnxgu.mongodb.net/App?retryWrites=true&w=majority";

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
            var queryParameters: any = q.query;

            // Login user 
            var loginResult: StatusCodes = await loginUserViaMongoDb(queryParameters.eMail as string, queryParameters.password as string);

            // Write statuscode to response
            _response.write(String(loginResult));
        }
        else if (q.pathname == "/register") {
            // Handle register command
            _response.setHeader("content-type", "text/html; charset=utf-8");

            // Create user object from query
            var queryParameters: any = q.query;

            let user: User = new User(
                queryParameters.eMail as string,
                queryParameters.name as string,
                queryParameters.surName as string,
                queryParameters.adress as string,
                queryParameters.city as string,
                queryParameters.postcode as string,
                queryParameters.country as string
            );
            user.password = queryParameters.password as string;

            // Register user in database
            var registerResult: StatusCodes = await addUserToMongoDb(user);

            // Write statuscode to response
            _response.write(String(registerResult));
        }
        else if (q.pathname == "/list") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");

            // Get users from database
            var users: User[] = await getUsersFromMongoDb();

            // Write users as json to response
            _response.write(JSON.stringify(users));
        }
        else if (q.pathname == "/subscribe") {
            _response.setHeader("content-type", "text/html; charset=utf-8");

            // Create subscription object from query
            var queryParameters: any = q.query;

            var subscription = new Subscription(queryParameters.subscriber, queryParameters.subscriptionTarget);
            var subscribeResult = await subscribeUserToMongoDb(subscription);

            _response.write(String(subscribeResult));
        }
        else if (q.pathname == "/message") {
            _response.setHeader("content-type", "text/html; charset=utf-8");

            // Create subscription object from query
            var queryParameters: any = q.query;

            var message = new MessageBase(queryParameters.user, queryParameters.message);
            var messageResult = await sendMessageToMongoDb(message);

            _response.write(String(messageResult));
        }
        else if (q.pathname == "/messages") {
            // Handle list command         
            _response.setHeader("content-type", "application/json; charset=utf-8");

            // Create subscription object from query
            var queryParameters: any = q.query;

            // Get users from database
            var messages: Message[] = await getSubscribedMessagesFromMongoDb(queryParameters.user);

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

    async function subscribeUserToMongoDb(subscription: Subscription): Promise<StatusCodes> {
        let subscriptions: Mongo.Collection = mongoClient.db("App").collection("Subscriptions");
        var existingSubscription: number = await subscriptions.countDocuments({ "subscriber": subscription.subscriber, "subcsriptionTarget": subscription.subcsriptionTarget });

        if (existingSubscription > 0) {
            // User with email already exists in db
            return StatusCodes.AlreadySubscribed;
        }
        else {
            // Insert subscription in database
            var result: Mongo.InsertOneWriteOpResult<any> = await subscriptions.insertOne(subscription);

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
        let messages: Mongo.Collection = mongoClient.db("App").collection("Messages");

        var result: Mongo.InsertOneWriteOpResult<any> = await messages.insertOne(message);

        if (result.insertedCount == 1) {
            // User successfully added
            return StatusCodes.Good;
        }
        else {
            // Database problem
            return StatusCodes.BadDatabaseProblem;
        }
    }

    /**
     * Gets all users and their details from the MongoDb
     */
    async function getSubscribedMessagesFromMongoDb(user: string): Promise<Message[]> {
        let subscriptionCollection: Mongo.Collection = mongoClient.db("App").collection("Subscriptions");
        let subscriptions: Subscription[] = await subscriptionCollection.find({ "subscriber": user }).toArray();
        let subscribedUsers: string[] = subscriptions.map((value: Subscription) => value.subcsriptionTarget);

        subscribedUsers.push(user);

        // Get all messages from database
        let messagesCollection: Mongo.Collection = mongoClient.db("App").collection("Messages");
        let messages: MessageBase[] = await messagesCollection.find({ "userMail": subscribedUsers }).toArray();

        // Decode each user document to a user object
        let fullMessages: Message[] = messages.map((message: MessageBase) => new Message(message.userMail, null, message.text))

        // Return users array
        return fullMessages;
    }

    /**
     * Adds a user to the MongoDb if its email does not exist already
     * @param user 
     */
    async function addUserToMongoDb(user: User): Promise<StatusCodes> {

        // Check for existing user
        let users: Mongo.Collection = mongoClient.db("App").collection("Users");
        var existingUserCount: number = await users.countDocuments({ "eMail": user.eMail });

        if (existingUserCount > 0) {
            // User with email already exists in db
            return StatusCodes.BadEmailExists;
        }
        else {

            // Insert user in database
            var result: Mongo.InsertOneWriteOpResult<any> = await users.insertOne(user);

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
      * Tests if the login with the given password works by checking the MongoDb
      * @param eMail 
      * @param password 
      */
    async function loginUserViaMongoDb(eMail: string, password: string): Promise<StatusCodes> {

        // Check if theres an user with the given email and password
        let users: Mongo.Collection = mongoClient.db("App").collection("Users");
        var existingUserCount: number = await users.countDocuments({ "eMail": eMail, "password": password });

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
    async function getUsersFromMongoDb(): Promise<User[]> {

        // Get all users from database
        let userCollection: Mongo.Collection = mongoClient.db("App").collection("Users");
        let userDocuments: any[] = await userCollection.find().toArray();

        let users: User[] = [];

        // Decode each user document to a user object
        for (const userDocument of userDocuments) {

            let user: User = new User(
                userDocument.eMail as string,
                userDocument.name as string,
                userDocument.surName as string,
                userDocument.adress as string,
                userDocument.city as string,
                userDocument.postcode as string,
                userDocument.country as string
            );

            // Add user object to array
            users.push(user);
        }

        // Return users array
        return users;
    }

}

