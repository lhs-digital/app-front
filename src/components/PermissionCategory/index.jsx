import { LabelOutlined } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import { handlePermissionName } from "../../services/utils";

const PermissionCategory = ({
  category,
  permissions,
  selectedPermissions = [],
  setSelectedPermissions = () => {},
  readOnly = false,
}) => {
  return (
    <div className="flex flex-col">
      <h2 className="font-semibold border-b-2 border-b-black dark:border-b-white px-4 py-4 border-t dark:border-t-white/20">
        <span>
          <LabelOutlined fontSize="small" className="mr-2 mb-0.5" />
        </span>
        {category}
      </h2>
      <table className="w-full">
        <thead>
          <tr className="text-left font-medium text-sm border-b [&>*]:py-4 [&>*]:px-4 bg-neutral-100 dark:bg-neutral-700/50">
            <th className="w-1/3">Permissão</th>
            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.id} className="[&>*]:py-2">
              <td className="px-4">{handlePermissionName(permission.name)}</td>
              <td className="px-3">
                <Checkbox
                  checked={selectedPermissions.some(
                    (rolePermission) => rolePermission.id === permission.id,
                  )}
                  inputProps={{
                    "aria-label": "controlled",
                  }}
                  onChange={(e) => {
                    if (readOnly) return;
                    if (e.target.checked) {
                      setSelectedPermissions((prev) => [...prev, permission]);
                    } else {
                      setSelectedPermissions((prev) =>
                        prev.filter(
                          (rolePermission) =>
                            rolePermission.id !== permission.id,
                        ),
                      );
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionCategory;
