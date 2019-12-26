const ICrud = require("../interfaces/interfaceCrud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this.connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this.connection.authenticate();
      return true;
    } catch (error) {
      console.log("fail", error);
      return false;
    }
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();
    return model;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async read(item = {}) {
    return this._schema.findAll({ where: item, raw: true });
  }

  async update(id, item, upsert = false) {
    const fn = upsert ? "upsert" : "update";
    return this._schema[fn](item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }

  static async connect() {
    // const connection = new Sequelize("heroes", "admin", "admin", {
    //   host: "192.168.99.100",
    //   dialect: "postgres",
    //   quoteIdentifiers: false,
    //   operatorsAliases: false,
    //   logging: false
    // });
    const connection = new Sequelize(process.env.POSTGRES_URL, {
      operatorsAliases: false,
      logging: false,
      quoteIdentifiers: false,
      ssl: process.env.SSL_DB,
      dialectOptions: {
        ssl: process.env.SSL_DB
      }
    });
    return connection;
  }
}
module.exports = Postgres;
