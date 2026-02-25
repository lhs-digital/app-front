import { LabelOutlined } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";

const PermissionCategory = ({
  category,
  permissions,
  selectedPermissions = [],
  setSelectedPermissions = () => {},
  readOnly = false,
}) => {
  return (
    <div className="flex flex-col">
      <h2 className="font-semibold px-4 py-2 border-y bg-zinc-200 dark:bg-zinc-800 my-2">
        <span>
          <LabelOutlined fontSize="small" className="mr-2 mb-0.5" />
        </span>
        {category}
      </h2>
      <table className="w-full">
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.id} className="[&>*]:py-2">
              <td className="px-4 w-1/3">{permission.label}</td>
              <td className="px-2">
                <Checkbox
                  checked={selectedPermissions.some(
                    (rolePermission) => rolePermission.id === permission.id,
                  )}
                  slotProps={{
                    input: {
                      "aria-label": "controlled",
                    },
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
