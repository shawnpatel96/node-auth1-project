const express = require("express");

const session = require("express-session");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router");
const restricted = require("../auth/restricted-middleware")


const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!", //put on secrets
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //true in production to send only over https
    httpOnly: true, //true means no access from JS

  },
  resave: false,
  saveUninitialized: true, //GDPR laws require to check with client
}

server.use(express.json());
server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;