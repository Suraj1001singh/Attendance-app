import React, { useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { auth } from "../../../config/firebase_config";
import TimePicker from 'react-time-picker';
import { chakra, Button, Grid, Text, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Select, toast } from "@chakra-ui/react";
import LiveAttendace from "./LiveAttendace";
import { useAttendance } from "../../../contexts/AttendanceContext";
const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isQrGenerated, setIsQrGenerated] = React.useState(false);
  const [qrData, setQrData] = React.useState({});
  const [attendanceType, setAttendaceType] = React.useState(-1);
  const { callback, setCallback } = useAttendance();
  useEffect(() => {
    setCallback(!callback);
  }, []);
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
          <LiveAttendace setIsQrGenerated={setIsQrGenerated} qrData={qrData} setQrData={setQrData} attendanceType={attendanceType} />
        )}
      </Grid>
      <ModalOffline isOpen={isOpen} onOpen={onOpen} onClose={onClose} setIsQrGenerated={setIsQrGenerated} setQrData={setQrData} attendanceType={attendanceType} />
    </>
  );
};
const ModalOffline = ({ isOpen, onOpen, onClose, setIsQrGenerated, setQrData, attendanceType }) => {
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const { setCurrPath, availableCourses, availableSems, availableSubjects } = useAttendance();
  const toast = useToast();
  const [date, setDate] = React.useState("");
  const [classTime, setClassTime] = React.useState(new Date());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedSem, setSelectedSem] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [long, setLong] = React.useState("");

  const GetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    } else {
      return toast({ description: "Turn on location ", status: "error", duration: 5000, isClosable: true });
    }
  };
  return (
    <>
      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen}>
        <ModalOverlay />
        <chakra.form
          onSubmit={async (e) => {
            e.preventDefault();
            if ((attendanceType == 2 && lat === "") || (attendanceType == 2 && long === "")) {
              toast({ description: "Please, give access to location", status: "error", duration: 5000, isClosable: true });
            } else {
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
              let classTimeEpoch = new Date(classTime).getTime() * 60;
              setCurrPath(`attendance/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}/${classTimeEpoch}`);
              console.log(`attendance/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}/${classTimeEpoch}`)
              if (attendanceType == 1) setQrData(`${auth.currentUser.uid}/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}/${classTimeEpoch}/${date}`);
              else setQrData(`${auth.currentUser.uid}/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}/${classTimeEpoch}/${date}/${lat}/${long}`);
              setIsQrGenerated(true);
              setIsSubmitting(false);
              onClose();
            }
          }}
        >
          <ModalContent>
            <ModalHeader>Select Details</ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Course Name</FormLabel>
                <Select isRequired placeholder="Select Course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                  {availableCourses?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Semester</FormLabel>
                {/* <Input ref={initialRef} placeholder="First name" /> */}
                <Select isRequired placeholder="Select Semester" value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
                  {availableSems?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Subject Name</FormLabel>
                {/* <Input ref={initialRef} placeholder="First name" /> */}
                <Select isRequired placeholder="Select Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  {availableSubjects?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {attendanceType == 2 && (
                <FormControl mt={9} display="flex" justifyContent="center">
                  <Button w="70%" minW="fit-content" colorScheme={lat ? "green" : "red"} onClick={GetLocation}>
                    Get Location {lat && <TiTick fontSize="2rem" />}
                  </Button>
                </FormControl>
              )}
              <FormControl mt={4}>
              <FormLabel>Select Time of class</FormLabel>
                <TimePicker value={classTime} onChange={setClassTime}></TimePicker>
            </FormControl>
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
