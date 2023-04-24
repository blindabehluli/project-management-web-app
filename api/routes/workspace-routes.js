"use strict";
const express = require("express");
const { Workspace, WorkspaceMember, User } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
const { errorHandler } = require("../middleware/error-handler");
// Router instance
const router = express.Router();

/*
  A /api/workspaces GET route that will return all workspaces a user is a member of
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const userId = req.currentUser.id;

    // Find all workspace members where the user is a member
    const workspaceMembers = await WorkspaceMember.findAll({
      where: {
        userId,
      },
      include: {
        model: Workspace,
        attributes: ["id", "workspaceTitle", "workspaceDescription", "userId"],
      },
    });

    // Extract the workspaces from the workspace members
    const workspaces = workspaceMembers.map((wm) => wm.Workspace);

    res.json(workspaces);
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
