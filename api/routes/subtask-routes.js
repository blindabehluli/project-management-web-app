"use strict";

const express = require("express");
const { Task, Subtask } = require("../models");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");
const { workspaceAccess } = require("../middleware/workspace-access");
const { errorHandler } = require("../middleware/error-handler");

// Router instance
const router = express.Router();

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks GET route that will return all subtasks for a specific task
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const subtasks = await Subtask.findAll({
      where: { taskId: req.params.taskId },
    });
    res.json(subtasks);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id GET route that will return a specific subtask for a specific task
  with a 200 HTTP status code.
*/
router.get(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    const subtask = await Subtask.findOne({
      where: {
        id: req.params.id,
        taskId: req.params.taskId,
      },
    });

    if (!subtask) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    res.json(subtask);
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks POST route that will create a new subtask for a specific task,
  set the Location header to "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id", and return a
  201 HTTP status code and no content.
*/
router.post(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.params.taskId,
          columnId: req.params.columnId,
        },
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const subtask = await task.createSubtask(req.body);
      res
        .status(201)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.boardId}/columns/${req.params.columnId}/tasks/${req.params.taskId}/subtasks/${subtask.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id PUT route that will update a specific subtask for a specific task,
  set the Location header to "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id", and return a
  204 HTTP status code and no content.
*/
router.put(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const subtask = await Subtask.findOne({
        where: {
          id: req.params.id,
          taskId: req.params.taskId,
        },
      });
      if (!subtask) {
        return res.status(404).json({ message: "Subtask not found" });
      }

      await subtask.update(req.body);

      res
        .status(204)
        .location(
          `/workspaces/${req.params.workspaceId}/boards/${req.params.boardId}/columns/${req.params.columnId}/tasks/${req.params.taskId}/subtasks/${req.params.id}`
        )
        .end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

/*
  A /api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id DELETE route that will delete a specific subtask for a specific task,
  and return a 204 HTTP status code and no content.
*/
router.delete(
  "/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/subtasks/:id",
  authenticateUser,
  workspaceAccess("member"),
  asyncHandler(async (req, res) => {
    try {
      const subtask = await Subtask.findOne({
        where: {
          id: req.params.id,
          taskId: req.params.taskId,
        },
      });
      if (!subtask) {
        return res.status(404).json({ message: "Subtask not found" });
      }

      await subtask.destroy();
      res.status(204).end();
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

module.exports = router;
