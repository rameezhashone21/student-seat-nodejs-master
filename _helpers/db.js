const tedious = require('tedious');
const { Sequelize } = require('sequelize');

const { dbName, dbConfig } = require('config.json');

module.exports = db = {};

initialize();

async function initialize() {
    const dialect = 'mssql';
    const host = dbConfig.server;
    const { userName, password } = dbConfig.authentication.options;

    // create db if it doesn't already exist
    await ensureDbExists(dbName);

    // connect to db
    const sequelize = new Sequelize(dbName, userName, password, { host, dialect });
    console.log("here>>1");
    // init models and add them to the exported db object
    //db.User = require('../users/user.model')(sequelize);
      db.User = require('../users/user.model')(sequelize, Sequelize);
      db.Forum = require('../home/home.model')(sequelize, Sequelize);
      db.Post = require('../home/post.model')(sequelize, Sequelize);
      db.Faq = require('../home/faq.model')(sequelize, Sequelize);
      db.Review = require('../home/Review.model')(sequelize, Sequelize);
      db.TrustapTransaction = require('../home/TrustapTransaction.model')(sequelize, Sequelize);
      db.University = require('../university/university.model')(sequelize, Sequelize);
      //db.sequelize.sync();

      db.University.hasMany(db.Forum, { as: "forums" });
      db.Forum.belongsTo(db.University, {
        foreignKey: "UniversityId",
        as: "universities",
        });
      db.Review.belongsTo(db.User, {
        foreignKey: "userId",
        as: "users",
        });
      db.TrustapTransaction.belongsTo(db.User, {
        foreignKey: "BuyerId",
        as: "users",
        });
      db.User.hasMany(db.TrustapTransaction, {
          foreignKey: "BuyerId",
          as: "trustaptransactions_users_buyers",
          });
      db.User.hasMany(db.TrustapTransaction, {
            foreignKey: "SellerId",
            as: "trustaptransactions_users_sellers",
            });    
      db.User.belongsTo(db.University, {
            foreignKey: "UniversityId",
            as: "users_university",
            });    
      db.Forum.hasMany(db.Post, {
        foreignKey: "ForumId",
        as: "posts",
      });

    // sync all models with database //{ alter: true }
    await sequelize.sync({ alter: false });
    console.log("here>>2");
}

async function ensureDbExists(dbName) {
    return new Promise((resolve, reject) => {
        const connection = new tedious.Connection(dbConfig);
        connection.connect((err) => {
            if (err) {
                console.error(err);
                reject(`Connection Failed: ${err.message}`);
            }

            const createDbQuery = `IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbName}') CREATE DATABASE [${dbName}];`;
            const request = new tedious.Request(createDbQuery, (err) => {
                if (err) {
                    console.error(err);
                    reject(`Create DB Query Failed: ${err.message}`);
                }

                // query executed successfully
                resolve();
            });

            connection.execSql(request);
        });
    });
}
