import React from "react";
import Header from "../../components/Header";
import {
  Box,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Title from "../../components/Title";

const MyPermissions = () => {
  const { permissions } = useContext(AuthContext);

  return (
    <>
      <Header />
      <Title
        title="Minhas Permissões"
        subtitle="Visualização das suas permissões"
      />
      <Flex
        fontSize="20px"
        mt="20px"
        marginX="auto"
        maxWidth="800px"
        padding="0 12px"
      >
        <Box textAlign="justify" px={2}>
          {permissions.length > 0 ? (
            permissions
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
                <Box key={index} mb={4} width="100%">
                  <b>{group.category}</b>
                  <Flex wrap="wrap" gap={2} mt={2}>
                    {group.items.map((permission, idx) => (
                      <Flex key={idx} alignItems="center" gap={2}>
                        <Checkbox isChecked={true} disabled />
                        <Text>{permission.label}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              ))
          ) : (
            <span>Você não possui permissões</span>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default MyPermissions;
