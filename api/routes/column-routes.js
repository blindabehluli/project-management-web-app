"use strict";

const express = require("express");
const { Board, Column } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
const { errorHandler } = require("../middleware/error-handler");

// Router instance
const router = express.Router();

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns GET route that will return all columns for a specific board
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/columns",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const columns = await Column.findAll({
      where: { boardId: req.params.boardId },
    });

    if (!columns) {
      return res.status(404).json({ message: "Columns not found" });
    }

    res.json(columns);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:id GET route that will return a specific column for a specific board
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/columns/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const column = await Column.findOne({
      where: { id: req.params.id, boardId: req.params.boardId },
    });

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.json(column);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns POST route that will create a new column for a specific board,
  set the Location header to "/workspaces/:workspaceId/boards/:boardId/columns/:id", and return a
  201 HTTP status code and no content.
*/
router.post(
  "/workspaces/:workspaceId/boards/:boardId/columns",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const board = await Board.findOne({
        where: { id: req.params.boardId, workspaceId: req.params.workspaceId },
      });

      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const column = await board.createColumn(req.body);
      res
        .status(201)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.boardId}/columns/${column.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:id PUT route that will update a specific column for a specific board,
  set the Location header to "/workspaces/:workspaceId/boards/:boardId/columns/:id", and return a
  204 HTTP status code and no content.
*/
router.put(
  "/workspaces/:workspaceId/boards/:boardId/columns/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const column = await Column.findOne({
        where: { id: req.params.id, boardId: req.params.boardId },
      });

      if (!column) {
        return res.status(404).json({ message: "Column not found" });
      }

      await column.update(req.body);

      res
        .status(204)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.boardId}/columns/${req.params.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
    A /api/workspaces/:workspaceId/boards/:boardId/columns/:id DELETE route that will delete a specific column for a specific board
    with a 204 HTTP status code and no content.
  */
router.delete(
  "/workspaces/:workspaceId/boards/:boardId/columns/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const column = await Column.findOne({
      where: { id: req.params.id, boardId: req.params.boardId },
    });
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    await column.destroy();

    res.status(204).end();
  })
);

module.exports = router;
