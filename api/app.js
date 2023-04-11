"use strict";

const express = require("express");
const morgan = require("morgan");

// Declare route variables
const userRoutes = require('./routes/user-routes');
const workspaceRoutes = require('./routes/workspace-routes');
const boardRoutes = require('./routes/board-routes');
const workspaceMemberRoutes = require("./routes/workspace-member");

const { sequelize } = require("./models");
const cors = require('cors');

// Create the Express app.
const app = express();

// Setup request body JSON parsing.
app.use(express.json());

// Cross origin
app.use(cors());

// Setup morgan which gives us HTTP request logging.
app.use(morgan("dev"));

// Add api routes for each model.
app.use("/api", userRoutes);
app.use("/api", workspaceRoutes);
app.use("/api", workspaceMemberRoutes);
app.use("/api", boardRoutes);

// Setup a friendly greeting for the root route.
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Project Management Web App!",
  });
});

// Send 404 if no other route matched.
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// Setup a global error handler.
app.use((err, req, res, next) => {
  console.error(`Global error handler: ${JSON.stringify(err.stack)}`);

  res.status(500).json({
    message: err.message,
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

// Set our port.
app.set("port", process.env.PORT || 5001);

// Test the database connection.
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Sequelize Model synchronization, then start listening on our port.
sequelize.sync().then(() => {
  const server = app.listen(app.get("port"), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
  });
});
