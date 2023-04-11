"use strict";

const express = require("express");
const { User } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { errorHandler } = require("../middleware/error-handler");

// Router instance
const router = express.Router();

/*
  A /api/users GET route that will return all properties
  with exclude for the currently authenticated User along
  with a 200 HTTP status code.
*/
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = await req.currentUser;
    const filteredUser = await User.findOne({
      where: { id: user.id },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    res.json(filteredUser);
  })
);

/*
  A /api/users POST route that will create a new user,
  set the Location header to "/", and return a 201 HTTP
  status code and no content.
*/
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

module.exports = router;
