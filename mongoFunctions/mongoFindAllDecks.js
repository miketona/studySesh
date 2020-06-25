const getDeckNames = function (callback) {
  const MongoClient = require("mongodb").MongoClient;
  const uriGet = require("./mongoUri"); //put the connection string in a git ignore file for privacy reasons
  const uri = uriGet();
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) throw err;
    const db = client.db("flashCard");
    db.listCollections().toArray(function (err, collections) {
      callback(collections);
    });
  });
};
module.exports = getDeckNames;
