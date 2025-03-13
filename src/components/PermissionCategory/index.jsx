import Checkbox from "@mui/material/Checkbox";
import { handlePermissionName } from "../../services/utils";

const PermissionCategory = ({
  category,
  permissions,
  rolePermissions = [],
}) => {
  return (
    <div className="flex flex-col">
      <h2 className="font-semibold border-b-2 border-b-black px-4 py-4 border-t">
        {category}
      </h2>
      <table className="w-full">
        <thead>
          <tr className="text-left font-medium text-sm border-b [&>*]:py-4 [&>*]:px-4 bg-neutral-100">
            <th className="w-1/3">Permissão</th>
            <th>Ativo</th>
          </tr>
        </thead>
        {permissions.map((permission) => (
          <tr key={permission.id} className="[&>*]:py-2">
            <td className="px-4">{handlePermissionName(permission.name)}</td>
            <td className="px-3">
              <Checkbox
                checked={rolePermissions.some(
                  (rolePermission) => rolePermission.id === permission.id,
                )}
              />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default PermissionCategory;
