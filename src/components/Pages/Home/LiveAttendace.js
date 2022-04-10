import { Grid, Text, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import QRCode from "qrcode";

const LiveAttendace = ({ setIsQrGenerated, qrData }) => {
  const [src, setSrc] = React.useState("");
  useEffect(() => {
    const GenerateQrCode = async () => {
      try {
        const data = await QRCode.toDataURL(qrData);
        if (data) {
          setSrc(data);
        }
      } catch (err) {
        console.log("this is", err.message);
      }
    };
    GenerateQrCode();
  }, [qrData]);
  return (
    <Grid position="relative" templateColumns="repeat(2, 1fr)" gap={6} h="100%" w="1200px" justifyItems={"center"} alignItems={"center"}>
      <Text fontSize="24px" fontWeight="700" position="absolute" top="0" left="0">
        Live Atendance
      </Text>
      <Grid h="100%" w="100%" paddingTop="60px">
        <div>
          <CustomStudent rollno="12121212" name="suraj" />
          <CustomStudent rollno="12121212" name="suraj" />
          <CustomStudent rollno="12121212" name="suraj" />
          <CustomStudent rollno="12121212" name="suraj" />
        </div>
      </Grid>
      <Grid>
        <img style={{ height: "350px", width: "auto" }} src={src}></img>
      </Grid>
      <Button position="absolute" bottom="40px" right="10px" colorScheme="primary" onClick={() => setIsQrGenerated(false)}>
        Done
      </Button>
    </Grid>
  );
};
const CustomStudent = ({ rollno, name }) => {
  return (
    <Grid padding="6px" templateColumns="repeat(2, 1fr)" borderBottom="2px solid #DFDFDE">
      <Text>{rollno}</Text>
      <Text>{name}</Text>
    </Grid>
  );
};
export default LiveAttendace;
