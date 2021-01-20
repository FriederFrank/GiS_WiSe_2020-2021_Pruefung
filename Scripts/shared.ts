
/**
 * Server url
 */
const url: String = "https://gis-wise-2020-2021-pruefung.herokuapp.com/";

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
 * StatusCodes
 */
const enum StatusCodes {
  Good = 1,
  BadDatabaseProblem = 2,
  BadEmailExists = 3,
  BadWrongPassword = 4,
  AlreadySubscribed = 5
}
