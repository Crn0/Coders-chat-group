import "dotenv/config";
import session from "express-session";
import MongoStore from "connect-mongo";
import days from "../helpers/expirationDate.mjs";

const mongoStoreOption = {
  mongoUrl: process.env.MONGO_DB,
  collectionName: "sessions",
};

export default session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  name: "SessionID",
  store: MongoStore.create(mongoStoreOption),
  cookie: {
    expires: days(7),
  },
});
