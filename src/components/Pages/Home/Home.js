import React from "react";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import moment from "moment";
import { auth } from "../../../config/firebase_config";
import { TextField } from "@mui/material";
import { chakra, Button, Grid, Text, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Select, toast } from "@chakra-ui/react";
import LiveAttendace from "./LiveAttendace";
import { useAttendance } from "../../../contexts/AttendanceContext";
const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [availableSubjects, setavailableSubjects] = React.useState(["mp", "ds", "os"]);
  const [availableSems, setavailableSems] = React.useState(["sem1", "sem2", "sem3"]);
  const [availableCourses, setavailableCourses] = React.useState(["mca", "mba", "btech"]);
  const [isQrGenerated, setIsQrGenerated] = React.useState(false);
  const [qrData, setQrData] = React.useState({});
  const [attendanceType, setAttendaceType] = React.useState(-1);

  return (
    <>
      <Grid maxW="1200px" autoRows gap={5} alignItems={"center"} justifyItems={"center"} h="89vh" m="auto">
        {!isQrGenerated ? (
          <Grid gap={8} autoRows justifyItems={"center"} alignItems={"center"}>
            <Text fontSize="2xl" color="gray.500" align="center">
              Select the Mode of Attendance
            </Text>
            <Button
              w="fit-content"
              colorScheme="primary"
              size="lg"
              fontSize="md"
              onClick={() => {
                setAttendaceType(1);
                onOpen();
              }}
            >
              Take Online Attendance
            </Button>
            <Button
              w="fit-content"
              colorScheme="primary"
              size="lg"
              fontSize="md"
              onClick={() => {
                setAttendaceType(2);
                onOpen();
              }}
            >
              Take Offline Attendance
            </Button>
          </Grid>
        ) : (
          <LiveAttendace setIsQrGenerated={setIsQrGenerated} qrData={qrData} />
        )}
      </Grid>
      <ModalOffline isOpen={isOpen} onOpen={onOpen} onClose={onClose} setIsQrGenerated={setIsQrGenerated} setQrData={setQrData} attendanceType={attendanceType} availableSubjects={availableSubjects} availableSems={availableSems} availableCourses={availableCourses} />
    </>
  );
};
const ModalOffline = ({ isOpen, onOpen, onClose, setIsQrGenerated, setQrData, attendanceType, availableSubjects, availableSems, availableCourses }) => {
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const { liveAttendance, setCurrPath } = useAttendance();
  const toast = useToast();
  const [date, setDate] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedSem, setSelectedSem] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [long, setLong] = React.useState("");
  const [errors, setErrors] = React.useState();
  const GetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    } else {
      return toast({ description: "Credential not valid", status: "error", duration: 5000, isClosable: true });
    }
  };
  return (
    <>
      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen}>
        <ModalOverlay />
        <chakra.form
          onSubmit={async (e) => {
            e.preventDefault();
            if (selectedCourse.trim() === "" || selectedSem.trim() === "" || selectedSubject.trim() === "" || (attendanceType == 2 && lat === "") || (attendanceType == 2 && long === "")) {
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
            setCurrPath(`attendance/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}`);
            if (attendanceType == 1) setQrData(`${auth.currentUser.uid}/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}/${date}`);
            else setQrData(`${auth.currentUser.uid}/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}/${date}/${lat}/${long}`);
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
                  {availableCourses.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Semester</FormLabel>
                {/* <Input ref={initialRef} placeholder="First name" /> */}
                <Select placeholder="Select Semester" value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
                  {availableSems.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Subject Name</FormLabel>
                {/* <Input ref={initialRef} placeholder="First name" /> */}
                <Select placeholder="Select Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  {availableSubjects.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {attendanceType == 2 && (
                <FormControl mt={4}>
                  <Button colorScheme="red" onClick={GetLocation}>
                    Get Location
                  </Button>
                </FormControl>
              )}
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
              <Button isLoading={isSubmitting} colorScheme="primary" mr={3} type="submit">
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
