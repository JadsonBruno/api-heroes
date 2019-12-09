const ICrud = require("./interfaces/interfaceCrud");
const Mongoose = require("mongoose");
const STATUS = {
  0: "Diconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting"
};

class MongoDB extends ICrud {
  constructor() {
    super();
    this._heroes = null;
    this._driver = null;
  }
  async isConnected() {
    const state = STATUS[this._driver.readyState];
    if (state === "Connected") return state;
    if (state !== "Connecting") return state;

    await new Promise(resolve => setTimeout(resolve, 1000));
    return STATUS[this._driver.readyState];
  }
  connect() {
    Mongoose.connect(
      "mongodb://jadson:password@192.168.99.100:27017/heroes",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      },
      function(error) {
        if (!error) return;
        console.log("Fail here: --------------->", error);
      }
    );

    const connection = Mongoose.connection;
    this._driver = connection;
    connection.once("open", () => console.log("Database Online"));
    this.defineModel();
  }
  defineModel() {
    const heroSchema = new Mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      power: {
        type: String,
        required: true
      },
      insertedAt: {
        type: Date,
        default: new Date()
      }
    });
    this._heroes = Mongoose.model("heroes", heroSchema);
  }
  create(item) {
    return this._heroes.create(item);
  }

  async read(item, skip = 0, limit = 10) {
    return await this._heroes
      .find(item)
      .skip(skip)
      .limit(limit);
  }

  update(id, item) {
    return this._heroes.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._heroes.deleteOne({ _id: id });
  }
}
module.exports = MongoDB;
