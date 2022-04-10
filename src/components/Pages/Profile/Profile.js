import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Checkbox, Container, Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton } from "@chakra-ui/react";
import { Card } from "../../Card/Card";
import CheckBoxList from "./checkBoxList";
import { Button, chakra, FormControl, FormLabel, Heading, HStack, Input, Stack, useToast, Text, Box, Flex } from "@chakra-ui/react";

const Profile = () => {
  const [name, setName] = useState("");
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [enableUpdateButton, setEnableUpdateButton] = useState(true);
  const [courses, setCourses] = useState(["BCA", "BBA", "MCA", "BTECH", "MBBS"]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState(["1", "2","3"]);
  const { currentUser } = useAuth();
  useEffect(() => {
    setName(currentUser?.displayName);
  }, [currentUser])

  const handleNameChange = (event) => {
    let name = event.target.value;
    name = name.trim();
    setName(name);
    if(!name) {
      setIsNameInvalid(true);
      setEnableUpdateButton(false)
      return;
    } else {
      setEnableUpdateButton(true);
      setIsNameInvalid(false);
    }
  }

  const handleProfileUpdate = () => {
    if(!enableUpdateButton) {
      return;
    }
    
  }
  return (
    <>
      {/* <Navbar /> */}
      <Container maxW="container.lg">
        <Heading textAlign="center" my={12}>
          Profile
        </Heading>
        <Card maxW="" mx="auto" mt={4}>
        <chakra.form>
          <Stack spacing="6">
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input value={currentUser?.email} name="email" disabled/>
            </FormControl>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input isInvalid={isNameInvalid} errorBorderColor='crimson' value={name} name="text" onChange={handleNameChange}/>
            </FormControl>
            <CheckBoxList label="Course" options={courses} setOptions={setCourses}/>
            <CheckBoxList label="Semester" options={semesters} setOptions={setSemesters}/>
            <CheckBoxList label="Subject" options={subjects} setOptions={setSubjects}/>
            <Button onClick={handleProfileUpdate} disabled={!enableUpdateButton}  colorScheme="primary" size="lg" fontSize="md">
              Update
            </Button>
          </Stack>
        </chakra.form>
      </Card>
      </Container>
    </>
  );
};

export default Profile;
