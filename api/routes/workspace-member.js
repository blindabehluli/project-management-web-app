"use strict";

const express = require("express");
const { WorkspaceMember, User } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
const { errorHandler } = require("../middleware/error-handler");

// Router instance
const router = express.Router();

/*
  A /api/workspaces/:workspaceId/members GET route that will return all workspace members for a specific workspace
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/members",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const workspaceMembers = await WorkspaceMember.findAll({
      where: {
        workspaceId: req.params.workspaceId,
      },
      include: {
        model: User,
        attributes: ["emailAddress", "firstName", "lastName"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.json(workspaceMembers);
  })
);

/*
  A /api/workspaces/:workspaceId/members POST route that will add a new workspace member,
  with a specified role, to a specific workspace, set the Location header to "/workspaces/:id", and return a
  201 HTTP status code and no content.
*/
router.post(
  "/workspaces/:workspaceId/members",
  authenticateUser,
  workspaceAccess('admin'),
  asyncHandler(async (req, res) => {
    try {
      const workspace = req.workspace;
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      
      const { role, email } = req.body;
      const user = await User.findOne({
        where: { emailAddress: email },
      });      
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await WorkspaceMember.create({
        workspaceId: workspace.id,
        userId: user.id,
        role,
      });

      res.status(201).location(`/workspaces/${workspace.id}`).end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/members/:memberId PUT route that will update the role of a specific
  workspace member for a specific workspace, set the Location header to "/workspaces/:id", and return a
  204 HTTP status code and no content.
*/
router.put(
  "/workspaces/:workspaceId/members/:memberId",
  authenticateUser,
  workspaceAccess('admin'),
  asyncHandler(async (req, res) => {
    try {
      const workspace = req.workspace;
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const member = await WorkspaceMember.findOne({
        where: {
          workspaceId: req.params.workspaceId,
          id: req.params.memberId,
        },
      });

      if (!member) {
        return res.status(404).json({ message: "Workspace member not found" });
      }

      const { role } = req.body;
      member.role = role;
      await member.save();

      res.status(204).location(`/workspaces/${workspace.id}`).end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/members/:memberId DELETE route that will remove a specific workspace member
  for a specific workspace, set the Location header to "/workspaces/:id", and return a 204 HTTP status code and no content.
*/
router.delete(
  "/workspaces/:workspaceId/members/:memberId",
  authenticateUser,
  workspaceAccess('admin'),
  asyncHandler(async (req, res) => {
    try {
      const workspace = req.workspace;
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const member = await WorkspaceMember.findOne({
        where: {
          workspaceId: req.params.workspaceId,
          id: req.params.memberId,
        },
      });

      if (!member) {
        return res.status(404).json({ message: "Workspace member not found" });
      }

      await member.destroy();

      res.status(204).location(`/workspaces/${workspace.id}`).end();
    } catch (error) {
      throw error;
    }
  })
);

  module.exports = router;