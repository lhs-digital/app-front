import React, { useContext } from "react";
import ListActivities from "../../components/ListActivities/ListActivities";
import { AuthContext } from "../../contexts/auth";

const Home = () => {
  const { user, permissions } = useContext(AuthContext);
  const tasksPermissions = ["view_any_tasks", "update_tasks"];

  const hasPermission = (thePermissions) => {
    return permissions.some((permission) =>
      thePermissions.includes(permission.name),
    );
  };

  return (
    <div>{hasPermission(tasksPermissions) ? <ListActivities /> : null}</div>
  );
};

export default Home;
