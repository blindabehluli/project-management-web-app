"use strict";

const express = require("express");
const { Workspace, Board } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
const { errorHandler } = require("../middleware/error-handler");

// Router instance
const router = express.Router();

/*
  A /api/workspaces/:workspaceId/boards GET route that will return all boards for a specific workspace
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findByPk(req.params.workspaceId);
    const boards = await workspace.getBoards();
    res.json(boards);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:id GET route that will return a specific board for a specific workspace
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const board = await Board.findOne({
      where: { id: req.params.id, workspaceId: req.params.workspaceId },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board);
  })
);

/*
  A /api/workspaces/:workspaceId/boards POST route that will create a new board for a specific workspace,
  set the Location header to "/workspaces/:workspaceId/boards/:id", and return a
  201 HTTP status code and no content.
*/
router.post(
  "/workspaces/:workspaceId/boards",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const workspace = await Workspace.findByPk(req.params.workspaceId);
      const board = await workspace.createBoard(req.body);
      res
        .status(201)
        .json(board);
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:id PUT route that will update a specific board for a specific workspace,
  set the Location header to "/workspaces/:workspaceId/boards/:id", and return a
  204 HTTP status code and no content.
*/
router.put(
  "/workspaces/:workspaceId/boards/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const board = await Board.findOne({
        where: { id: req.params.id, workspaceId: req.params.workspaceId },
      });

      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      await board.update(req.body);

      res
        .status(204)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:id DELETE route that will delete a specific board for a specific workspace
  with a 204 HTTP status code and no content.
*/
router.delete(
  "/workspaces/:workspaceId/boards/:id",
  authenticateUser,
  workspaceAccess("admin"),
  asyncHandler(async (req, res) => {
    const board = await Board.findOne({
      where: { id: req.params.id, workspaceId: req.params.workspaceId },
    });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await board.destroy();

    res.status(204).end();
  })
);

module.exports = router;
