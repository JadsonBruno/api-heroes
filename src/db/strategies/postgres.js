const ICrud = require("./interfaces/interfaceCrud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heroes = null;
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.log("fail", error);
      return false;
    }
  }

  async defineModel() {
    this._heroes = this._driver.define(
      "heroes",
      {
        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          required: true
        },
        power: {
          type: Sequelize.STRING,
          required: true
        }
      },
      {
        tableName: "TB_HEROES",
        freezeTableName: false,
        timestamps: false
      }
    );

    await this._heroes.sync();
  }

  async create(item) {
    const { dataValues } = await this._heroes.create(item);
    return dataValues;
  }

  async read(item = {}) {
    return this._heroes.findAll({ where: item, raw: true });
  }

  async update(id, item) {
    return this._heroes.update(item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._heroes.destroy({ where: query });
  }

  async connect() {
    this._driver = new Sequelize("heroes", "admin", "admin", {
      host: "192.168.99.100",
      dialect: "postgres",
      quoteIdentifiers: false,
      operatorsAliases: false
    });
    await this.defineModel();
  }
}
module.exports = Postgres;
