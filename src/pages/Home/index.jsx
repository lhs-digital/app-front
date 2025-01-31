import React from 'react'
import './index.css'
import Header from '../../components/Header';
import { Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import ListActivities from '../../components/ListActivities/ListActivities';

const Home = () => {
  const { user, permissions } = useContext(AuthContext)
  const tasksPermissions = ['view_any_tasks', 'update_tasks'];

  const hasPermission = (thePermissions) => {
    return permissions.some(permission =>
      thePermissions.includes(permission.name)
    );
  }

  return (
    <>
      <Header width="100%" />
      <Flex
        align="center"
        justify="center"
        flexDirection="column"
        fontSize="20px"
        fontFamily="poppins"
        mt="20px"
        gap="24px"
        width="100%"
        paddingX="24px"
      >
        {
          hasPermission(tasksPermissions) ?
            (
              <ListActivities />
            ) : null
        }

      </Flex>
    </>
  )
}

export default Home