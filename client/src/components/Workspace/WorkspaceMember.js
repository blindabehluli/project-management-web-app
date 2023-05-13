import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";

const Workspace = () => {
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Workspace Members</h1>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Surname</th>
          </tr>
        </thead>
        <tbody>
          {workspaceMembers.map((member) => (
            <tr key={member.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 text-blue-500 hover:underline">
                  {member.role}
              </td>
              <td className="px-4 py-2">{member.User.emailAddress}</td>
              <td className="px-4 py-2">{member.User.firstName}</td>
              <td className="px-4 py-2">{member.User.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Workspace;
