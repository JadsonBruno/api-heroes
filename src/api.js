const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDB = require("./db/strategies/mongodb/mongodb");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroesSchema");
const HeroRoute = require("./routes/heroRoutes");

const app = new Hapi.Server({
  port: 4000
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroSchema));

  app.route([...mapRoutes(new HeroRoute(context), HeroRoute.methods())]);

  await app.start();
  console.log("server running at", app.info.port);

  return app;
}

module.exports = main();
