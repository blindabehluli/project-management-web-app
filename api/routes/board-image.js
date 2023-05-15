"use strict";

const express = require("express");
const { Workspace, Board, BoardImage } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
const { errorHandler } = require("../middleware/error-handler");

// Router instance
const router = express.Router();

/*
  A /api/workspaces/:workspaceId/boards/:boardId/images GET route that will return all images for a specific board
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/images",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const board = await Board.findOne({
      where: { id: req.params.boardId, workspaceId: req.params.workspaceId },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const boardImages = await board.getBoardImages();
    res.json(boardImages);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/images/:id GET route that will return a specific image for a specific board
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/images/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const boardImage = await BoardImage.findOne({
      where: {
        id: req.params.id,
        boardId: req.params.boardId,
      },
    });

    if (!boardImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(boardImage);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/images POST route that will create a new image for a specific board,
  set the Location header to "/workspaces/:workspaceId/boards/:boardId/images/:id", and return a
  201 HTTP status code and no content.
*/
router.post(
  "/workspaces/:workspaceId/boards/:boardId/images",
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

      const boardImage = await board.createBoardImage(req.body);
      res
        .status(201)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.boardId}/images/${boardImage.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/images/:id DELETE route that will delete a specific image for a specific board
  with a 204 HTTP status code and no content.
*/
router.delete(
  "/workspaces/:workspaceId/boards/:boardId/images/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const boardImage = await BoardImage.findOne({
      where: {
        id: req.params.id,
        boardId: req.params.boardId,
      },
    });

    if (!boardImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    await boardImage.destroy();

    res.status(204).end();
  })
);

module.exports = router;