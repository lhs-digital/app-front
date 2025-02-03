import { PersonOutline } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";

const MyPermissions = () => {
  const { permissions } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-4 w-full">
      <PageTitle
        icon={<PersonOutline />}
        title="Minhas Permissões"
        subtitle="Visualização das suas permissões"
      />
      <Box>
        {permissions.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Permissão</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions
                  .reduce((acc, permission) => {
                    const categoryExists = acc.find(
                      (cat) => cat.category === permission.category,
                    );
                    if (!categoryExists) {
                      acc.push({ category: permission.category, items: [] });
                    }
                    acc
                      .find((cat) => cat.category === permission.category)
                      ?.items.push(permission);
                    return acc;
                  }, [])
                  .map((group, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <p className="font-bold">{group.category}</p>
                      </TableCell>
                      <TableCell>
                        {group.items.map((permission, idx) => (
                          <Box
                            key={idx}
                            display="flex"
                            alignItems="center"
                            gap={2}
                          >
                            <Checkbox checked={true} disabled />
                            <p>{permission.label}</p>
                          </Box>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Você não possui permissões</Typography>
        )}
      </Box>
    </div>
  );
};

export default MyPermissions;
