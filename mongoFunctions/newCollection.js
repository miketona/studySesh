const createNewDeck = function (databaseName, collectionName, callback) {
  const MongoClient = require("mongodb").MongoClient;
  const uriGet = require("./mongoUri"); //put the connection string in a git ignore file for privacy reasons
  const uri = uriGet();
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) throw err;
    const db = client.db(databaseName);
    //var query = { question: "Who am I really?" };
    db.createCollection(collectionName, (err, res) => {
      if (err) throw err;
      client.close;
      callback();
    });
    //redirect("createPage");
  });
};
module.exports = createNewDeck;
