import { Box, HStack, IconButton, Spacer, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import Navlink from "./Navlink";

export default function Navbar() {
  const { toggleColorMode } = useColorMode();
  const { logout, currentUser } = useAuth();
  return (
    <Box borderBottom="2px" borderBottomColor={useColorModeValue("gray.100", "gray.700")}>
      <HStack py={4} justifyContent="flex-end" maxW="container.lg" mx="auto">
        <Navlink to="/" name="Attend-It" size="lg" />
        <Spacer />
        {!currentUser && <Navlink to="/login" name="Login" />}
        {!currentUser && <Navlink to="/register" name="Register" />}
        {currentUser && <Navlink to="/protected-page" name="Dashboard" />}
        {currentUser && <Navlink to="/profile" name="Profile" />}
        {currentUser && (
          <Navlink
            to="/logout"
            name="Logout"
            onClick={async (e) => {
              e.preventDefault();
              logout();
            }}
          />
        )}
        <IconButton variant="outline" icon={useColorModeValue(<FaSun />, <FaMoon />)} onClick={toggleColorMode} aria-label="toggle-dark-mode" />
      </HStack>
    </Box>
  );
}
