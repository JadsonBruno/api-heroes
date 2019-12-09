// npm install mongoose
const Mongoose = require("mongoose");
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
connection.once("open", () => console.log("Database Online"));

//model
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

const model = Mongoose.model("heroes", heroSchema);

async function main() {
  const resultCreate = await model.create({
    name: "Batman",
    power: "Money"
  });
  console.log("result create ----> ", resultCreate);

  const listItems = await model.find();
  console.log("items ----> ", listItems);
}

main();
