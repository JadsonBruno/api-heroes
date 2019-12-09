const assert = require("assert");
const Postgres = require("./../db/strategies/postgres/postgres");
const Context = require("./../db/strategies/base/contextStrategy");
const HeroSchema = require("./../db/strategies/postgres/schemas/heroesSchema");

const MOCK_HERO_CREATE = { name: "Black Hawk", power: "Arrow" };
const MOCK_HERO_UPDATE = { name: "Batman", power: "Money" };

let context = {};

describe("Postgres Strategy", function() {
  this.timeout(Infinity);
  this.beforeAll(async function() {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroSchema);
    context = new Context(new Postgres(connection, model));
    await context.delete();
    await context.create(MOCK_HERO_UPDATE);
  });

  it("PostgresSQL Connection", async function() {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it("Create", async function() {
    const result = await context.create(MOCK_HERO_CREATE);
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });

  it("Read", async function() {
    const [result] = await context.read({ name: MOCK_HERO_CREATE.name });
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });

  it("Update", async function() {
    const [updateItem] = await context.read({ name: MOCK_HERO_UPDATE.name });
    const newItem = {
      ...MOCK_HERO_UPDATE,
      name: "Wonder Woman"
    };
    const [result] = await context.update(updateItem.id, newItem);
    const [updatedItem] = await context.read({ id: updateItem.id });
    assert.deepEqual(result, 1);
    assert.deepEqual(updatedItem.name, newItem.name);
  });

  it("Delete", async function() {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
