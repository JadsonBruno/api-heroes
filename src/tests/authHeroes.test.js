const assert = require("assert");
const api = require("./../api");
const Context = require("./../db/strategies/base/contextStrategy");
const Postgres = require("./../db/strategies/postgres/postgres");
const UserSchema = require("./../db/strategies/postgres/schemas/userSchema");

let app = {};

const USER = {
  username: "joseph",
  password: "12345"
};

const USER_DB = {
  ...USER,
  password: "$2a$04$yVt2th/Np8mygL4f6eAY1uwNavJXly6JTd7VGvZybYF7n4igvIUbm"
};

describe("Auth test suite", function() {
  this.beforeAll(async () => {
    app = await api;
    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UserSchema);
    const postgres = new Context(new Postgres(connectionPostgres, model));
    const result = await postgres.update(null, USER_DB, true);
  });

  it("should get a token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    assert.deepEqual(statusCode, 200);
    assert.ok(data.token.length > 10);
  });

  it("should return unauthorized", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "somethingelse",
        password: "idontknow"
      }
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    assert.deepEqual(statusCode, 401);
    assert.ok(data.error, "Unauthorized");
  });
});
