const assert = require("assert");
const MongoDB = require("./../db/strategies/mongodb/mongodb");
const HeroSchema = require("./../db/strategies/mongodb/schemas/heroesSchema");
const Context = require("./../db/strategies/base/contextStrategy");

const MOCK_HERO_CREATE = { name: "Wonder woman", power: "Lasso of Truth" };
const MOCK_HERO_UPDATE = { name: "Green Arrow", power: "Archery" };

let MOCK_HERO_ID = "";

let context = {};
describe("MongoDB Strategy", function() {
  this.beforeAll(async () => {
    const connection = MongoDB.connect();
    context = new Context(new MongoDB(connection, HeroSchema));
    const result = await context.create(MOCK_HERO_UPDATE);
    MOCK_HERO_ID = result._id;
  });

  it("should Check the Connection", async () => {
    const result = await context.isConnected();
    const expected = "Connected";

    assert.deepEqual(result, expected);
  });

  it("should create a hero and return him", async () => {
    const { name, power } = await context.create(MOCK_HERO_CREATE);
    assert.deepEqual({ name, power }, MOCK_HERO_CREATE);
  });

  it("should read a hero by the name", async () => {
    const [{ name, power }] = await context.read(
      {
        name: MOCK_HERO_CREATE.name
      },
      6,
      10
    );
    const result = { name, power };
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });

  it("should update a hero", async () => {
    const result = await context.update(MOCK_HERO_ID, {
      name: "Superman"
    });
    assert.deepEqual(result.nModified, 1);
  });

  it("should delete a hero by id", async () => {
    const result = await context.delete(MOCK_HERO_ID);
    assert.deepEqual(result.deletedCount, 1);
  });
});
