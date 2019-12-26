const assert = require("assert");
const PasswordHelper = require("../helpers/passwordHelper");
const MOCK_PASSWORD = "Jadson@31232123";
const MOCK_HASH =
  "$2a$04$Hvvpi5kD/UNHid1OQqQ1NeFbsBz6fY4Je3IqGc3fSdxQqMkG/xECK";

describe("UserHelper test suite", function() {
  it("should generate a hash by password", async () => {
    const result = await PasswordHelper.hashPassword(MOCK_PASSWORD);
    assert.ok(result.length > 10);
  });

  it("should compare a password and your hash", async () => {
    const result = await PasswordHelper.comparePassword(
      MOCK_PASSWORD,
      MOCK_HASH
    );
    assert.ok(result);
  });
});
