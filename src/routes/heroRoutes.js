const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
const failAction = (request, headers, erro) => {
  throw erro;
};

const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown();

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
        tags: ["api"],
        description: "Should list the heroes",
        notes: "Can page results and apply filters",
        validate: {
          failAction,
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
          },
          headers
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, name } = request.query;
          const query = name ? { name: { $regex: `.*${name}*.` } } : {};
          return this.db.read(query, skip, limit);
        } catch (error) {
          console.log("Something went wrong --> ", error);
          return Boom.internal();
        }
      }
    };
  }

  create() {
    return {
      path: "/heroes",
      method: "POST",
      config: {
        tags: ["api"],
        description: "Should create a hero",
        notes: "Should create a hero by name and power",
        validate: {
          failAction,
          headers,
          payload: {
            name: Joi.string()
              .required()
              .min(3)
              .max(100),
            power: Joi.string()
              .required()
              .min(2)
              .max(100)
          }
        },
        handler: async (request, headers) => {
          try {
            const { name, power } = request.payload;
            const result = await this.db.create({ name, power });
            return {
              message: "Hero created",
              _id: result._id
            };
          } catch (error) {
            console.log("Something went wrong --> ", error);
            return Boom.internal();
          }
        }
      }
    };
  }

  update() {
    return {
      path: "/heroes/{id}",
      method: "PATCH",
      config: {
        tags: ["api"],
        description: "Should update a hero by id",
        notes: "Can update any field",
        validate: {
          params: {
            id: Joi.string().required()
          },
          headers,
          payload: {
            name: Joi.string()
              .min(3)
              .max(100),
            power: Joi.string()
              .min(2)
              .max(100)
          }
        }
      },
      handler: async request => {
        try {
          const { id } = request.params;
          const { payload } = request;
          const dataString = JSON.stringify(payload);
          const data = JSON.parse(dataString);
          const result = await this.db.update(id, data);
          if (result.nModified !== 1)
            return Boom.preconditionFailed("Hero not found");

          return {
            message: "Hero updated"
          };
        } catch (error) {
          console.log("Something went wrong --> ", error);
          return Boom.internal();
        }
      }
    };
  }

  delete() {
    return {
      path: "/heroes/{id}",
      method: "DELETE",
      config: {
        tags: ["api"],
        description: "Should delete a hero by id",
        notes: "ID must be valid",
        validate: {
          failAction,
          headers,
          params: {
            id: Joi.string().required()
          }
        }
      },
      handler: async request => {
        try {
          const { id } = request.params;
          const result = await this.db.delete(id);
          if (result.n !== 1) {
            return Boom.preconditionFailed("Hero not found");
          }
          return {
            message: "Hero deleted"
          };
        } catch (error) {
          console.log("Something went wrong --> ", error);
          return Boom.internal();
        }
      }
    };
  }
}
module.exports = HeroRoutes;
