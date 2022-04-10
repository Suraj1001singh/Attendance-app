import React from "react";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import moment from "moment";
import { TextField } from "@mui/material";
import { chakra, Button, Grid, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Select, toast } from "@chakra-ui/react";
import LiveAttendace from "./LiveAttendace";
const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isQrGenerated, setIsQrGenerated] = React.useState(false);
  const [qrData, setQrData] = React.useState({});
  console.log(qrData);

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
          <LiveAttendace setIsQrGenerated={setIsQrGenerated} qrData={qrData} />
        )}
      </Grid>
      <ModalOffline isOpen={isOpen} onOpen={onOpen} onClose={onClose} setIsQrGenerated={setIsQrGenerated} setQrData={setQrData} />
    </>
  );
};
const ModalOffline = ({ isOpen, onOpen, onClose, setIsQrGenerated, setQrData }) => {
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const [date, setDate] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedSem, setSelectedSem] = React.useState("");
  const [errors, setErrors] = React.useState();

  return (
    <>
      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen}>
        <ModalOverlay />
        <chakra.form
          onSubmit={async (e) => {
            e.preventDefault();
            if (selectedCourse.trim() === "" || selectedSem.trim() === "" || selectedSubject.trim() === "") {
              toast({ description: "Please, Select all fields", status: "error", duration: 5000, isClosable: true });
            }
            setIsSubmitting(true);
            //setting Qr data
            let date = new Date();
            let days = Math.floor(date / 8.64e7);
            let time =
              Date.now ||
              function () {
                return +new Date();
              };
            date = time();
            setQrData(`${selectedCourse}/${selectedSem}/${selectedSubject}/${days}/${date}`);
            setIsQrGenerated(true);
            setIsSubmitting(false);
            onClose();
          }}
        >
          <ModalContent>
            <ModalHeader>Select Details</ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Course Name</FormLabel>
                {/* <Input ref={initialRef} placeholder="First name" /> */}
                <Select isRequired placeholder="Select Course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Semester</FormLabel>
                {/* <Input ref={initialRef} placeholder="First name" /> */}
                <Select placeholder="Select Semester" value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Subject Name</FormLabel>
                {/* <Input ref={initialRef} placeholder="First name" /> */}
                <Select placeholder="Select Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
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
              <Button isLoading={isSubmitting} colorScheme="blue" mr={3} type="submit">
                Generate QR
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </chakra.form>
      </Modal>
    </>
  );
};

export default Home;
