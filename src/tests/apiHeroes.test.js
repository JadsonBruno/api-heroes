const assert = require("assert");
const api = require("./../api");
let app = {};

const MOCK_HERO_CREATE = {
  name: "Chapolin Colorado",
  power: "Bionic sledgehammer"
};

const MOCK_INITIAL_HERO = {
  name: "Hawkman",
  power: "Axes"
};

let MOCK_ID = "";
describe("API Heroes test suite", function() {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      payload: JSON.stringify(MOCK_INITIAL_HERO)
    });
    const data = JSON.parse(result.payload);
    MOCK_ID = data._id;
  });

  it("should list the heroes", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/heroes?skip=0&limit=0"
    });
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(JSON.parse(result.payload)));
  });

  it("should return 3 heroes records", async () => {
    const SIZE_LIMIT = 3;
    const result = await app.inject({
      method: "GET",
      url: `/heroes?skip=0&limit=${SIZE_LIMIT}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(data.length === SIZE_LIMIT);
  });

  it("should filter heroes return by name", async () => {
    const NAME = "Batman";
    const result = await app.inject({
      method: "GET",
      url: `/heroes?skip=0&limit=10&name=${NAME}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.deepEqual(data[0].name, NAME);
  });

  it("should create a hero", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      payload: MOCK_HERO_CREATE
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, "Hero created");
  });

  it("should update a hero by id partially", async () => {
    const _id = MOCK_ID;
    const expected = {
      power: "Super aim"
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/heroes/${_id}`,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, "Hero updated");
  });

  it("should delete a hero by id", async () => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${_id}`
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, "Hero deleted");
  });

  it("should not delete a hero by id", async () => {
    const _id = "5bfdb6e83f66ad3c32939fb1";
    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${_id}`
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    const expected = {
      statusCode: 412,
      error: "Precondition Failed",
      message: "Hero not found"
    };
    assert.ok(statusCode === 412);
    assert.deepEqual(data, expected);
  });

  it("should not delete a hero by invalid id", async () => {
    const _id = "invalid id";
    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${_id}`
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    const expected = {
      statusCode: 500,
      error: "Internal Server Error",
      message: "An internal server error occurred"
    };
    assert.ok(statusCode === 500);
    assert.deepEqual(data, expected);
  });
});
