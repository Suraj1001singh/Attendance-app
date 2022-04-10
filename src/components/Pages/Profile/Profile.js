import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfile } from "../../../contexts/ProfileContext";
import { Container  } from "@chakra-ui/react";
import { Card } from "../../Card/Card";
import CheckBoxList from "./checkBoxList";
import { Button, chakra, FormControl, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";

const Profile = () => {
  const [name, setName] = useState("");
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableUpdateButton, setEnableUpdateButton] = useState(true);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const { currentUser, updateProfileName } = useAuth();
  const { getProfile, updateProfile, profile } = useProfile();
  const toast = useToast();

  useEffect (() => {
    getProfile();
  } , [])

  useEffect(() => {
    setName(currentUser?.displayName);
    if (profile) {
      setSubjects(profile.subjects || []);
      setSemesters(profile.semesters || []);
      setCourses(profile.courses || []);
    }
  }, [currentUser, profile]);
  const handleNameChange = (event) => {
    let name = event.target.value;
    setName(name);
    if(name?.trim()?.length <= 0) {
      setIsNameInvalid(true);
      setEnableUpdateButton(false)
    } else {
      setEnableUpdateButton(true);
      setIsNameInvalid(false);
    }
  }

  const handleProfileUpdate = () => {
    if(!enableUpdateButton) {
      return;
    }
    setIsSubmitting(true);
    updateProfileName(name);
    updateProfile({ subjects, semesters, courses });
    toast({ description: "Profile details updated", status: "success", duration: 5000, isClosable: true });
    setIsSubmitting(false);
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
            <Button isLoading={isSubmitting} onClick={handleProfileUpdate} disabled={!enableUpdateButton}  colorScheme="primary" size="lg" fontSize="md">
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
