import React, { useState } from "react";
import { Checkbox, Input, Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton } from "@chakra-ui/react";
import { Button, FormControl, FormLabel, Stack, chakra } from "@chakra-ui/react";

const CheckBoxList = ({ label, options, setOptions }) => {
  const [isAddOptionOpen, setIsAddOptionOpen] = useState(false);
  const [newOption, setNewOption] = useState("");
  const onAddOptionClose = (list) => {
    setIsAddOptionOpen(false);
  };
  const handleNewOptionAdd = () => {
    if (!newOption?.trim().length > 0) {
      setNewOption("");
      return;
    }
    if (!options.find((option) => option === newOption)) {
      setOptions([...options, newOption]);
    }
    setNewOption("");
    setIsAddOptionOpen(false);
  };

  const handleCheckboxChange = (option) => {
    setOptions(options.filter((item) => item !== option));
  };
  return (
    <FormControl id={label.toLowerCase()}>
      <FormLabel>{label}</FormLabel>
      {options && options.length > 0 ? (
        <Stack pl={6} mt={1} spacing={1} overflow="auto" maxHeight={"120px"} borderWidth="1px" borderColor="light-grey">
          {options.map((option, index) => {
            return (
              <Checkbox colorScheme="primary" key={option} value={option} defaultChecked onChange={() => handleCheckboxChange(option)}>
                {option}
              </Checkbox>
            );
          })}
        </Stack>
      ) : (
        <Input placeholder={`No ${label} added!`} _placeholder={{ opacity: 1, color: "black" }} disabled></Input>
      )}

      <Button colorScheme="primary" size="sm" w="120px" margin="10px" float={"right"} onClick={() => setIsAddOptionOpen(true)}>
        Add {label}
      </Button>

      <Modal motionPreset="slideInBottom" onClose={() => onAddOptionClose(label)} isOpen={isAddOptionOpen}>
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader>Add {label}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <chakra.form>
              <Stack spacing="6">
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={newOption}
                    onChange={(event) => {
                      setNewOption(event.target.value);
                    }}
                  />
                </FormControl>
                <Button onClick={handleNewOptionAdd} colorScheme="primary" float={"right"} fontSize="md">
                  Add
                </Button>
              </Stack>
            </chakra.form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormControl>
  );
};

export default CheckBoxList;
