"use strict";

const express = require("express");
const { Column, Task } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
const { errorHandler } = require("../middleware/error-handler");

// Router instance
const router = express.Router();

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks GET route that will return all tasks for a specific column
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const tasks = await Task.findAll({
      where: { columnId: req.params.columnId },
    });
    res.json(tasks);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id GET route that will return a specific task for a specific column
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        columnId: req.params.columnId,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks POST route that will create a new task for a specific column,
  set the Location header to "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id", and return a
  201 HTTP status code and no content.
*/
router.post(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const column = await Column.findOne({
        where: {
          id: req.params.columnId,
          boardId: req.params.boardId,
        },
      });

      if (!column) {
        return res.status(404).json({ message: "Column not found" });
      }

      const task = await column.createTask(req.body);
      res
        .status(201)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.boardId}/columns/${req.params.columnId}/tasks/${task.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id PUT route that will update a specific task for a specific column,
  set the Location header to "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id", and return a
  204 HTTP status code and no content.
*/
router.put(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          columnId: req.params.columnId,
        },
      });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await task.update(req.body);
      res
        .status(204)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.boardId}/columns/${req.params.columnId}/tasks/${task.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id DELETE route that will delete a specific task for a specific column,
  and return a 204 HTTP status code and no content.
*/
router.delete(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.id,
          columnId: req.params.columnId,
        },
      });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await task.destroy();
      res.status(204).end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

module.exports = router;
