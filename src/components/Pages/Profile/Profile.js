import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfile } from "../../../contexts/ProfileContext";
import { Container } from "@chakra-ui/react";
import { Card } from "../../Card/Card";
import CheckBoxList from "./checkBoxList";
import { MdModeEdit } from "react-icons/md";
import { Button, chakra, FormControl, FormLabel, Heading, Input, Stack, useToast, Text, Divider } from "@chakra-ui/react";

const Profile = () => {
  const [name, setName] = useState("");
  const [isEditName, setIsEditName] = useState(false);
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableUpdateButton, setEnableUpdateButton] = useState(true);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const { currentUser, updateProfileName } = useAuth();
  const { getProfile, updateProfile, profile } = useProfile();
  const toast = useToast();

  useEffect(() => {
    getProfile();
  }, []);

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
    if (name?.trim()?.length <= 0) {
      setIsNameInvalid(true);
      setEnableUpdateButton(false);
    } else {
      setEnableUpdateButton(true);
      setIsNameInvalid(false);
    }
  };

  const handleProfileUpdate = () => {
    if (!enableUpdateButton) {
      return;
    }
    setIsEditName(false);
    setIsSubmitting(true);
    updateProfileName(name);
    updateProfile({ subjects, semesters, courses });
    toast({ description: "Profile details updated", status: "success", duration: 5000, isClosable: true });
    setIsSubmitting(false);
  };

  return (
    <>
      {/* <Navbar /> */}
      <Container maxW="container.lg">
        <Card maxW="" mx="auto" mt={4}>
          <chakra.form>
            <Stack spacing="4">
              <FormControl id="name">
                {!isEditName ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text marginRight="1rem" fontSize="1.5rem" fontWeight="600">
                      {name}
                    </Text>
                    <MdModeEdit fontSize="1.5rem" cursor="pointer" onClick={() => setIsEditName(true)} />
                  </div>
                ) : (
                  <Input isInvalid={isNameInvalid} errorBorderColor="crimson" value={name} name="text" onChange={handleNameChange} />
                )}
                <Text marginTop="6px" fontWeight="600" fontSize="14px" fontFamily="sans-serif" color="GrayText">
                  {currentUser?.email}{" "}
                </Text>
              </FormControl>
              <Divider orientation="horizontal" />
              <CheckBoxList label="Course" options={courses} setOptions={setCourses} />
              <CheckBoxList label="Semester" options={semesters} setOptions={setSemesters} />
              <CheckBoxList label="Subject" options={subjects} setOptions={setSubjects} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button isLoading={isSubmitting} onClick={handleProfileUpdate} disabled={!enableUpdateButton} colorScheme="primary" w="30%" fontSize="md" minW="fit-content">
                  Update
                </Button>
              </div>
            </Stack>
          </chakra.form>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
