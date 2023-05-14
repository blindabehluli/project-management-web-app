import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import AddWorkspaceMember from "./AddWorkspaceMember";
import EditWorkspaceMember from "./EditWorkspaceMember";

const WorkspaceMember = () => {
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api(
          `/workspaces/${workspaceId}/members`,
          "GET",
          null,
          credentials
        );
        if (response.status === 200) {
          const data = await response.json();
          setWorkspaceMembers(data);
        } else {
          throw new Error("Failed to fetch workspaces");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkspaces();
  }, [credentials, workspaceId]);

  const handleAddMemberClick = () => {
    setShowAddMemberModal(true);
  };

  const handleEditMemberClick = (memberId) => {
    setSelectedMemberId(memberId);
  };

  const handleCloseModal = () => {
    setSelectedMemberId(null); // Reset selectedMemberId when closing the modal
    setShowAddMemberModal(false);
  };

  return (
    <div className="container mx-auto mt-32 px-24">
      <div>
        <h1>
          <span className="text-primary-600">
            {workspaceMembers.length > 0 &&
              workspaceMembers[0].Workspace.workspaceTitle}
          </span>{" "}
          Members
        </h1>
        <p className="mb-8">
          {workspaceMembers.length > 0 &&
            workspaceMembers[0].Workspace.workspaceDescription}
        </p>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Surname
              </th>
              <th scope="col" className="px-6 py-3">
                Email Address
              </th>
              <th
                scope="col"
                className="px-6 py-3 hover:underline text-primary-600 hover:text-black font-bold cursor-pointer"
                onClick={handleAddMemberClick}
              >
                Add New
              </th>
            </tr>
          </thead>
          <tbody>
            {workspaceMembers.map((member) => (
              <tr
                key={member.id}
                className={`bg-white border-b ${
                  member.User.emailAddress === credentials.emailAddress
                    ? "bg-primary-200" // If the member id matched the authenticated user id highlight the tr
                    : ""
                }`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {member.role}
                </th>
                <td className="px-6 py-4">{member.User.firstName}</td>
                <td className="px-6 py-4">{member.User.lastName}</td>
                <td className="px-6 py-4">{member.User.emailAddress}</td>
                {workspaceMembers.length === 1 ? (
                  <td className="px-6 py-4 font-medium text-primary-600 cursor-not-allowed">
                    Edit
                  </td>
                ) : (
                  <td
                    className="px-6 py-4 font-medium text-primary-600 hover:underline cursor-pointer"
                    onClick={() => handleEditMemberClick(member.id)}
                  >
                    Edit
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddMemberModal && <AddWorkspaceMember onClose={handleCloseModal} />}
      {selectedMemberId && (
        <EditWorkspaceMember
          memberId={selectedMemberId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default WorkspaceMember;
