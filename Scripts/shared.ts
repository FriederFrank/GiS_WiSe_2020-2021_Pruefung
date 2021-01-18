
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
 * StatusCodes
 */
const enum StatusCodes {
  Good = 1,
  BadDatabaseProblem = 2,
  BadEmailExists = 3,
  BadWrongPassword = 4,
  AlreadySubscribed = 5
}
