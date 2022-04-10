import React from "react";

import { Button, Grid, Text } from "@chakra-ui/react";
const Home = () => {
  return (
    <Grid autoRows gap={5} alignItems={"center"} justifyContent={"center"} h="89vh">
      <Grid gap={8} autoRows justifyItems={"center"} alignItems={"center"}>
        <Text fontSize="2xl" color="gray.500" align="center">
          Select the Mode of Attendance
        </Text>
        <Button w="fit-content" colorScheme="primary" size="lg" fontSize="md">
          Take Online Attendance
        </Button>
        <Button w="fit-content" colorScheme="primary" size="lg" fontSize="md">
          Take Offline Attendance
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
