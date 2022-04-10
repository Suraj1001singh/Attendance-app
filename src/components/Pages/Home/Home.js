import React from "react";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import moment from "moment";
import { TextField } from "@mui/material";
import { Button, Grid, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import LiveAttendace from "./LiveAttendace";
const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isQrGenerated, setIsQrGenerated] = React.useState(false);

  return (
    <>
      <Grid maxW="1200px" autoRows gap={5} alignItems={"center"} justifyItems={"center"} h="89vh" m="auto">
        {!isQrGenerated ? (
          <Grid gap={8} autoRows justifyItems={"center"} alignItems={"center"}>
            <Text fontSize="2xl" color="gray.500" align="center">
              Select the Mode of Attendance
            </Text>
            <Button w="fit-content" colorScheme="primary" size="lg" fontSize="md" onClick={onOpen}>
              Take Online Attendance
            </Button>
            <Button w="fit-content" colorScheme="primary" size="lg" fontSize="md">
              Take Offline Attendance
            </Button>
          </Grid>
        ) : (
          <LiveAttendace setIsQrGenerated={setIsQrGenerated} />
        )}
      </Grid>
      <ModalOffline isOpen={isOpen} onOpen={onOpen} onClose={onClose} setIsQrGenerated={setIsQrGenerated} />
    </>
  );
};
const ModalOffline = ({ isOpen, onOpen, onClose, setIsQrGenerated }) => {
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const [date, setDate] = React.useState("");
  return (
    <>
      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Details</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Course Name</FormLabel>
              {/* <Input ref={initialRef} placeholder="First name" /> */}
              <Select placeholder="Select Course">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Semester</FormLabel>
              {/* <Input ref={initialRef} placeholder="First name" /> */}
              <Select placeholder="Select Semester">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Subject Name</FormLabel>
              {/* <Input ref={initialRef} placeholder="First name" /> */}
              <Select placeholder="Select Subject">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </FormControl>
            {/* <FormControl mt={4}>
              <FormLabel>Select Date and Time of class</FormLabel>
            
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Select Date and Time"
                  value={date}
                  minDate={moment(new Date())}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </FormControl> */}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setIsQrGenerated(true);
                onClose();
              }}
            >
              Generate QR
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
