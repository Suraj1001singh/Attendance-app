import React, { useEffect } from "react";
import { Box, Text, Grid, VStack, Button, Menu, MenuButton, MenuItem, MenuList, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { BiChevronRight, BiChevronLeft, BiRightArrowAlt, BiCaretDown, BiDownload } from "react-icons/bi";
import DatePicker from "react-date-picker";
import { useAttendance } from "../../../contexts/AttendanceContext";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [attendanceDate, setAttendanceDate] = React.useState(new Date());
  const { setAttendanceFetchPath, fetchedSessions, fetchAttendance, attendance, setAttendance, availableCourses, availableSems, availableSubjects, fetchCourseDetails, fetchSessions, attendanceFetchPath, selectedSession } = useAttendance();
  const [selectedCourse, setSelectedCourse] = React.useState();
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedSem, setSelectedSem] = React.useState("");
  const [cardColor, setCardColors] = React.useState([
    {
      bgColor: "#FEF8E6",
      textColor: "#8C825A",
    },
    {
      bgColor: "#DCF7E9",
      textColor: "#64947D",
    },
    {
      bgColor: "#FFE1E2",
      textColor: "#9D686A",
    },
  ]);

  const downloadCSV = () => {
    if(!attendance || attendance.length === 0) return;
    const workSheet = XLSX.utils.json_to_sheet(attendance);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "Attendance Record");

    //buffer
    let buffer = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    //binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    //download
    XLSX.writeFileXLSX(workBook, `${selectedCourse}-${selectedSem}-${selectedSubject}-${attendanceDate.toLocaleDateString()}-${selectedSession}-attendance.xlsx`);
  };

  const alterDate = (date, days) => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };
  const handleAttendanceDateChange = (date) => {
    setAttendanceDate(date);
  };
  //-----------sorting
  const sortBy = (value) => {
    let temp = attendance;
    if (value == 0)
      temp.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    //sort by name
    else if (value == 1) temp.sort((a, b) => a?.rollno - b?.rollno); //sort by rollno
    else if (value == 2) temp.sort((a, b) => b?.counter - a?.counter); //sort by counter
    setAttendance([...temp]);
  };
  //----------------

  useEffect(() => {
    let days;
    if (attendanceDate) days = Math.floor(attendanceDate / 8.64e7);
    else days = new Date();

    setAttendanceFetchPath(`attendance/${selectedCourse}/${selectedSem}/${selectedSubject}/${days}`);
  }, [attendanceDate, selectedCourse, selectedSem, selectedSubject]);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [attendanceFetchPath]);


  return (
    <>
      <Box h="3rem" width="100%" maxW="1200px" margin="auto" alignContent="center" py="1rem">
        <div style={{ position: "relative", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <Button variant="outline" size="sm" onClick={() => handleAttendanceDateChange(alterDate(attendanceDate, -1))}>
            <BiChevronLeft cursor="pointer" color="#D53F8C" fontSize="2rem" />
          </Button>
          <div style={{ margin: "10px" }}>
            <DatePicker format="dd-MM-yyyy" onChange={handleAttendanceDateChange} value={attendanceDate} />
          </div>
          <Button variant="outline" size="sm" onClick={() => handleAttendanceDateChange(alterDate(attendanceDate, 1))}>
            <BiChevronRight cursor="pointer" color="#D53F8C" fontSize="2rem" />
          </Button>

          <Menu>
            <MenuButton as={Button} rightIcon={<BiCaretDown />} position="absolute" right="1" alignSelf="flex-end" colorScheme="primary">
              Sort
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => sortBy(0)}>Name</MenuItem>
              <MenuItem onClick={() => sortBy(1)}>Roll Number</MenuItem>
              <MenuItem onClick={() => sortBy(2)}>QR Scanned</MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <FormControl style={{ margin: '10px'}}>
            <FormLabel>Course Name</FormLabel>
            <Select isRequired value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {availableCourses?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ margin: '10px'}}>
            <FormLabel>Semester</FormLabel>
            <Select isRequired value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
            <option value="">Select Semester</option>
              {availableSems?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ margin: '10px'}}>
            <FormLabel>Subject Name</FormLabel>
            <Select isRequired value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
              {availableSubjects?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
           <FormLabel>Export</FormLabel>

            <Button rightIcon={<BiDownload />} style={{ margin: '10px'}} colorScheme="green" onClick={() => downloadCSV()}>
              Export 
            </Button>
          </FormControl>
        </div>
        <Grid templateColumns="auto 1fr">
          <VStack px="2rem">
            {fetchedSessions?.map((session, index) => (
              <CustomCards key={index} bgColor={cardColor[index % cardColor.length].bgColor} textColor={cardColor[index % cardColor.length].textColor} session={session} fetchAttendance={fetchAttendance} />
            ))}
          </VStack>
          <VStack position="relative" style={{ overflow: "auto", maxHeight: "400px"}}>
            <VStack w="100%" h="90%" background="pink.50" borderRadius="10px" padding="1rem">
              {attendance?.length != 0 ? (
                <>
                  <Box w="100%">
                    <Grid templateColumns="1fr 1fr 1fr">
                      <Text fontSize="18px" fontWeight="700">
                        Roll No.
                      </Text>
                      <Text fontSize="18px" fontWeight="700">
                        Name
                      </Text>
                      <Text fontSize="18px" fontWeight="700">
                        No. of QR scanned
                      </Text>
                    </Grid>
                  </Box>
                  {attendance?.map((item, index) => (
                    <CustomListItem key={index} student={item} />
                  ))}
                </>
              ) : (
                <div>No record found!</div>
              )}
            </VStack>
          </VStack>
        </Grid>
      </Box>
    </>
  );
};

const CustomCards = ({ bgColor, textColor, session, fetchAttendance }) => {
  return (
    <div style={{ position: "relative", height: "180px", width: "190px", background: `${bgColor}`, borderRadius: "10px", padding: "1rem" }}>
      <Text fontWeight="500">Session at</Text>
      <Text fontSize="24px" fontWeight="700">
        {new Date(session / 60).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
      </Text>
      <div onClick={() => fetchAttendance(session)} style={{ position: "absolute", bottom: "1rem", display: "flex", flexDirection: "row", alignItems: "center", background: "rgba(255, 255, 255, 0.25)", boxShadow: "20px 20px 40px -6px rgba(0, 0, 0, 0.2)", backdropFilter: "blur(4.5px)", WebkitBackdropFilter: "blur(4.5px)", borderRadius: "10px", padding: "6px 3px", cursor: "pointer" }}>
        <Text color={textColor} marginBottom="3px" fontWeight="700" marginRight="6px">
          View Attendace{" "}
        </Text>
        <BiRightArrowAlt color={textColor} fontSize="1.5rem" />
      </div>
    </div>
  );
};
const CustomListItem = ({ student }) => {
  return (
    <Box w="100%" background="#ffff" py="10px" px="5px" borderRadius="15px">
      <Grid templateColumns="1fr 1fr 1fr">
        <Text fontSize="15px" fontWeight="700">
          {student?.rollno}
        </Text>
        <Text fontSize="15px">{student?.name}</Text>
        <Text fontSize="15px" fontWeight="700" color="grey.400">
          {student?.counter}
        </Text>
      </Grid>
    </Box>
  );
};

export default Dashboard;

// FEF8E6 yellow
// DCF7E9 green
// FFE1E2 pink

// 64947D dark green
// 9D686A dark red
