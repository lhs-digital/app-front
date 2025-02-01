import {
  Divider,
  Flex,
  Heading,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";

const Title = ({ title, subtitle }) => {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Flex
      align={isMobile ? "flex-start" : "center"}
      justify="center"
      flexDirection="column"
      fontSize="20px"
      fontFamily="poppins"
      mt="20px"
      gap="24px"
      width="100%"
      px={2}
    >
      <Stack width={isMobile ? "100%" : "800px"} maxWidth="800px">
        <Heading mt="12px">{title}</Heading>
        <Divider borderColor="gray.300" alignSelf="left" borderWidth="2px" />
        <Heading fontSize="lg" fontWeight="regular" color="gray.500">
          {subtitle}
        </Heading>
      </Stack>
    </Flex>
  );
};

export default Title;
