var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var crypto = require("crypto-js");
var Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
var credentials = require("../credentials");
const { response } = require("express");
//to capture the json body
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());
//initialize sequelize to connect to the database

var databaseConnection = new Sequelize(
  credentials.databaseName,
  credentials.userName,
  credentials.password,
  {
    dialect: "mssql",
    host: credentials.hostName,
    port: 1433, // DB default Port
    logging: false,
    dialectOptions: {
      requestTimeout: 30000, // time out is 30 seconds
    },
  }
);
//defining the model
var Brand = databaseConnection.define(
  "Brand",
  {
    brandId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    brandName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    isDeleted: Sequelize.BOOLEAN,
  },
  {
    timestamps: false,
    freezeTableName: true, //so Sequelize doesnt pluralize the table name
  }
);

//create new brand
router.post("/create_new_brand", (request, response) => {
  //set headers
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log(request.body);
  Brand.create(request.body).then((brand) => {
    response.json(brand);
  });
});

//TODO fetch all the brands

//TODO fetch specific brand by id

//TODO update brand

//TODO delete: can use the paranoid method but we dont have a deletion timestamp column
//so we will just set the isDeleted to false

//test connection
router.get("/testconnection", function (request, response) {
  //set headers
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.send("Brand Management Test");
});

//to export the class
module.exports = router;
