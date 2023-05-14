import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import CreateWorkspace from "./CreateWorkspace";
import editIcon from "../../assets/edit-icon.svg";
import EditWorkspace from "./EditWorkspace";

const Workspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null); // Add selectedWorkspaceId state

  const { credentials } = useContext(UserContext);

  const handleEditClick = (workspaceId) => {
    setSelectedWorkspaceId(workspaceId); // Set the selectedWorkspaceId when edit is clicked
    setIsEditOpen(true);
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api("/workspaces", "GET", null, credentials);
        if (response.status === 200) {
          const data = await response.json();
          setWorkspaces(data);
          console.log(data);
        } else {
          throw new Error("Failed to fetch workspaces");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkspaces();
  }, [credentials]);

  return (
    <section className="bg-gray-50 h-screen">
      <div className="workspace-container">
        <div className="workspace-header">
          <div className="workspace-header-text">
            <h1>👋 Welcome back</h1>
          </div>
        </div>
        <div className="workspace-body">
          <div className="workspace-title">
            Workspaces for {credentials.emailAddress}
          </div>
          <div className="workspace-list divide-y">
            {workspaces.map((workspace) => (
              <div className="workspace-list-item" key={workspace.id}>
                <div className="workspace-list-detail">
                  <div className="workspace-detail-icon">
                    {workspace.workspaceLogoUrl ? (
                      <img
                        className="workspace-detail-icon"
                        alt="workspace-logo"
                        src={workspace.workspaceLogoUrl}
                      />
                    ) : (
                      <div className="workspace-detail-icon bg-primary-600 text-white flex justify-center items-center text-3xl">
                        {workspace.workspaceTitle &&
                          workspace.workspaceTitle.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="workspace-detail-content">
                    <span
                      className="workspace-detail-title inline-flex cursor-pointer"
                      onClick={() => handleEditClick(workspace.id)} // Pass workspace.id to handleEditClick
                    >
                      {workspace.workspaceTitle}
                      <img src={editIcon} alt="edit" className="ml-2" />
                    </span>

                    <div className="workspace-detail-description">
                      <span className="workspace-description-text">
                        {workspace.workspaceDescription}
                      </span>
                      <Link to={`/workspace/${workspace.id}/members`}>
                        <span className="workspace-members-count hover:underline text-primary-600 hover:text-black font-bold">
                          Members
                        </span>
                      </Link>
                    </div>
                  </div>
                  <Link
                    to={`/workspace/${workspace.id}`}
                    className="workspace-launch-button"
                  >
                    <span className="workspace-launch-text">
                      Launch Workspace
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="workspace-footer">
            <button
              className="workspace-button-secondary"
              onClick={() => setIsCreateWorkspaceOpen(true)}
            >
              <span className="font-normal text-black">
                Create New Workspace
              </span>
            </button>
          </div>
          {isCreateWorkspaceOpen && (
            <CreateWorkspace onClose={() => setIsCreateWorkspaceOpen(false)} />
          )}
          {isEditOpen && (
            <EditWorkspace
              workspaceId={selectedWorkspaceId} // Pass the selectedWorkspaceId to EditWorkspace
              onClose={() => setIsEditOpen(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Workspace;
