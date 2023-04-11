"use strict";
const express = require("express");
const { Workspace } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
// Router instance
const router = express.Router();
/*
  A /api/workspaces GET route that will return all workspaces
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const workspaces = await Workspace.findAll({
      where: { userId: req.currentUser.id }
    });
    if (workspaces) {
      res.json(workspaces);
    } else {
      res.status(404).json({ message: "Workspace not found" });
    }
  })
);
/*
  A /api/workspaces/:id GET route that will return a specific workspace
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findByPk(req.params.id);
    if (workspace) {
      if (workspace.userId === req.currentUser.id) {
        res.json(workspace);
      } else {
        res.status(403).json({ message: "Access forbidden" });
      }
    } else {
      res.status(404).json({ message: "Workspace not found" });
    }
  })
);
/*
  A /api/workspaces POST route that will create a new workspace,
  set the Location header to "/workspaces/:id", and return a
  201 HTTP status code and no content.
*/
router.post(
  "/workspaces",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const workspace = await Workspace.create({
        ...req.body,
        userId: req.currentUser.id,
      });
      res.status(201).location(`/workspaces/${workspace.id}`).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);
/*
  A /api/workspaces/:id PUT route that will update a specific workspace,
  set the Location header to "/workspaces/:id", and return a
  204 HTTP status code and no content.
*/
router.put(
  "/workspaces/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findByPk(req.params.id);
    if (workspace) {
      if (workspace.userId === req.currentUser.id) {
        await workspace.update(req.body);
        res.status(204).location(`/workspaces/${workspace.id}`).end();
      } else {
        res.status(403).json({ message: "Access forbidden" });
      }
    } else {
      res.status(404).json({ message: "Workspace not found" });
    }
  })
);
/*
  A /api/workspaces/:id DELETE route that will delete a specific workspace
  with a 204 HTTP status code and no content.
*/
router.delete(
  "/workspaces/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findByPk(req.params.id);
    if (workspace) {
      if (workspace.userId === req.currentUser.id) {
        await workspace.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({ message: "Access forbidden" });
      }
    } else {
      res.status(404).json({ message: "Workspace not found" });
    }
  })
);

module.exports = router;
