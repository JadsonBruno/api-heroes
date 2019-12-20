const assert = require("assert");
const api = require("./../api");
let app = {};
describe("API Heroes test suite", function() {
  this.beforeAll(async () => {
    app = await api;
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
});
