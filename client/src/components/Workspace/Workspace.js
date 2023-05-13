import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper"; 

const Workspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const { credentials } = useContext(UserContext);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api("/workspaces", "GET", null, credentials);
        if (response.status === 200) {
          const data = await response.json();
          setWorkspaces(data);
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
                <img
                  className="workspace-detail-icon"
                  alt="workspace-logo"
                  src="https://a.slack-edge.com/80588/img/avatars-teams/ava_0014-88.png"
                ></img>
                <div className="workspace-detail-content">
                  <span className="workspace-detail-title">
                    {workspace.workspaceTitle}
                  </span>
                  <div className="workspace-detail-description">
                    <span className="workspace-description-text">
                      {workspace.workspaceDescription}
                    </span>
                    <span className="workspace-members-count">3 members</span>
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
        <Link
          className="workspace-button-secondary"
          to="/create"
        >
          <span className="font-normal text-black">Create New Workspace</span>
        </Link>
      </div>
      </div>
    </div>
    </section>
  );
};

export default Workspace;
