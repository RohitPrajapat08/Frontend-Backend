require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // replace with your domain
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); // Include PATCH method
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Include "content-type" and "authorization"

  // Additional headers you might need to include
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Content-Length, X-Requested-With"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "PATCH"); // Include PATCH method in preflight response
    res.sendStatus(200);
  } else {
    next();
  }
});

let port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//* import routes

const adminRouter = require("./admin/routes/adminRoutes");
const adminRouterForExpert = require("./admin/routes/expertRoutes");
const adminRouterForUser = require("./admin/routes/userRoutes");
const userRouter = require("./user/routes/userRoutes");
const xpertRouter = require("./xpert/routes/xpertRoutes");

app.use("/api/admin", adminRouter, adminRouterForExpert, adminRouterForUser);
app.use("/api/user", userRouter);
app.use("/api/xpert", xpertRouter);

app.use(cookieParser());
const connection = require("./models/dbconnection");

connection();

app.listen(port, () => console.log(`port is running on ${port}`));
