const { Workspace, WorkspaceMember } = require("../models");
const { asyncHandler } = require("./async-handler");

exports.workspaceAccess = (role) => {
  return asyncHandler(async (req, res, next) => {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if the current user is a member or admin at the workspace
    const workspaceMember = await WorkspaceMember.findOne({
      where: {
        workspaceId,
        userId: req.currentUser.id,
      },
    });

    if (!workspaceMember) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    if (role === "admin" && workspaceMember.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden" });
    }

    req.workspaceMember = workspaceMember;
    req.workspace = workspace;
    next();
  });
};
