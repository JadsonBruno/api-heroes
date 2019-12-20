const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: "/heroes",
      method: "GET",
      config: {
        validate: {
          failAction: (request, headers, erro) => {
            throw erro;
          },
          query: {
            skip: Joi.number()
              .integer()
              .default(0),
            limit: Joi.number()
              .integer()
              .default(10),
            name: Joi.string()
              .min(3)
              .max(100)
          }
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, name } = request.query;
          const query = name ? { name: { $regex: `.*${name}*.` } } : {};
          return this.db.read(query, skip, limit);
        } catch (error) {
          console.log("Something went wrong --> ", error);
          return "Intern error";
        }
      }
    };
  }
}
module.exports = HeroRoutes;
