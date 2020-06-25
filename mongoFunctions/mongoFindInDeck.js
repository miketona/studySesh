const findInDeck = function (collectionName, username, callback) {
  const MongoClient = require("mongodb").MongoClient;
  const uriGet = require("./mongoUri"); //put the connection string in a git ignore file for privacy reasons
  const uri = uriGet();
  let queryResult = 2;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) throw err;
    //if we are calling this function to search for a card, and not a username from the username collection
    if (collectionName !== "username")
      collectionName = username + "-" + collectionName;

    const db = client.db("flashCard");
    db.collection(collectionName)
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        //return the collection
        callback(result);
      });
  });
};
module.exports = findInDeck;
