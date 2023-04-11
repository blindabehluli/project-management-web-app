const { Workspace } = require("../models");

const requireWorkspaceAccess = async (req, res, next) => {
  const workspaceId = req.params.workspaceId;
  const workspace = await Workspace.findByPk(workspaceId);

  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  if (workspace.userId !== req.currentUser.id) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  req.workspace = workspace;
  
  next();
};

module.exports = { requireWorkspaceAccess };
