"use strict";
const express = require("express");
const { Workspace } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
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
      include: [
        {
          model: WorkspaceMember,
          where: { userId: req.currentUser.id },
        },
      ],
    });
    if (workspaces) {
      res.json(workspaces);
    } else {
      res.status(404).json({ message: "Workspace not found" });
    }
  })
);

/*
  A /api/workspaces/:workspaceId GET route that will return a specific workspace
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const workspace = req.workspace;
    if (workspace) {
      res.json(workspace);
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
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId PUT route that will update a specific workspace,
  set the Location header to "/workspaces/:id", and return a
  204 HTTP status code and no content.
*/
router.put(
  "/workspaces/:workspaceId",
  authenticateUser,
  workspaceAccess("admin"),
  asyncHandler(async (req, res) => {
    try {
      const workspace = req.workspace;
      if (workspace) {
        await workspace.update(req.body);
        res.status(204).location(`/workspaces/${workspace.id}`).end();
      } else {
        res.status(404).json({ message: "Workspace not found" });
      }
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId DELETE route that will delete a specific workspace
  with a 204 HTTP status code and no content.
*/
router.delete(
  "/workspaces/:workspaceId",
  authenticateUser,
  workspaceAccess("admin"),
  asyncHandler(async (req, res) => {
    const workspace = req.workspace;
    if (workspace) {
      await workspace.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Workspace not found" });
    }
  })
);

module.exports = router;
