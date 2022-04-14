import React from "react";
import { Box, Text, Grid, VStack, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BiChevronRight, BiChevronLeft, BiRightArrowAlt, BiCaretDown } from "react-icons/bi";
import DatePicker from 'react-date-picker';

const Dashboard = () => {
  const [attendanceDate, setAttendanceDate] = React.useState(new Date());
  const alterDate = (date, days) => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }
  const handleAttendanceDateChange = (date) => {
    setAttendanceDate(date);
  }

  return (
    <>
      <Box h="3rem" width="100%" maxW="1200px" margin="auto" alignContent="center" py="1rem">
        <div style={{ position: "relative", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <Button variant='outline' size="sm" onClick={() => handleAttendanceDateChange(alterDate(attendanceDate, -1))}><BiChevronLeft cursor="pointer" color="#D53F8C" fontSize="2rem"/></Button>
          <div style={{margin: "10px"}}>
            <DatePicker format="dd-MM-yyyy" onChange={handleAttendanceDateChange} value={attendanceDate} />
          </div>
          <Button variant='outline' size='sm' onClick={() => handleAttendanceDateChange(alterDate(attendanceDate, 1))}><BiChevronRight cursor="pointer" color="#D53F8C" fontSize="2rem"/></Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<BiCaretDown />} position="absolute" right="1" alignSelf="flex-end" colorScheme="primary">
              Sort by
            </MenuButton>
            <MenuList>
              <MenuItem>Name</MenuItem>
              <MenuItem>Roll Number</MenuItem>
              <MenuItem>QR Scanned</MenuItem>
            </MenuList>
          </Menu>
        </div>
        <Grid templateColumns="auto 1fr">
          <VStack px="2rem">
            <CustomCards bgColor={"#FEF8E6"} textColor={"#8C825A"} />
            <CustomCards bgColor={"#DCF7E9"} textColor={"#64947D"} />
            <CustomCards bgColor={"#FFE1E2"} textColor={"#9D686A"} />
          </VStack>
          <VStack position="relative">
            <VStack w="100%" h="90%" background="pink.50" borderRadius="10px" padding="1rem">
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
              <CustomListItem />
              <CustomListItem />
              <CustomListItem />
              <CustomListItem />
            </VStack>
            <Button position="absolute" bottom="3px" right="2px" colorScheme="green">
              Export To
            </Button>
          </VStack>
        </Grid>
      </Box>
    </>
  );
};

const CustomCards = ({ bgColor, textColor }) => {
  return (
    <div style={{ position: "relative", height: "180px", width: "190px", background: `${bgColor}`, borderRadius: "10px", padding: "1rem" }}>
      <Text fontWeight="500">Session at</Text>
      <Text fontSize="24px" fontWeight="700">
        8:00 AM{" "}
      </Text>
      <div style={{ position: "absolute", bottom: "1rem", display: "flex", flexDirection: "row", alignItems: "center", background: "rgba(255, 255, 255, 0.25)", boxShadow: "20px 20px 40px -6px rgba(0, 0, 0, 0.2)", backdropFilter: "blur(4.5px)", WebkitBackdropFilter: "blur(4.5px)", borderRadius: "10px", padding: "6px 3px", cursor: "pointer" }}>
        <Text color={textColor} marginBottom="3px" fontWeight="700" marginRight="6px">
          View Attendace{" "}
        </Text>
        <BiRightArrowAlt color={textColor} fontSize="1.5rem" />
      </div>
    </div>
  );
};
const CustomListItem = () => {
  return (
    <Box w="100%" background="#ffff" py="10px" px="5px" borderRadius="15px">
      <Grid templateColumns="1fr 1fr 1fr">
        <Text fontSize="15px" fontWeight="700">
          52112211
        </Text>
        <Text fontSize="15px">Suraj singh</Text>
        <Text fontSize="15px" fontWeight="700" color="grey.400">
          3
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
