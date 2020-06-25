const deleteCard = function (collectionName, cardName, callback) {
  const MongoClient = require("mongodb").MongoClient;
  const uriGet = require("./mongoUri"); //put the connection string in a git ignore file for privacy reasons
  const uri = uriGet();
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) throw err;
    const query = { cardName: cardName };
    const db = client.db("flashCard");
    db.collection(collectionName).deleteOne(query, function (err, obj) {
      if (err) throw err;
      client.close();
      callback();
    });
  });
};
module.exports = deleteCard;
