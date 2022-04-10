import { Button, chakra, FormControl, FormLabel, Heading, HStack, Input, Stack, useToast, Text, Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Card } from "../Card";
import DividerWithText from "../DividerWithText";
import { Layout } from "../Layout";
import { useAuth } from "../../../../contexts/AuthContext";
import useMounted from "../../../../hooks/useMounted";

export default function Login() {
  const history = useHistory();
  const mounted = useMounted();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { login, signInWithGoogle } = useAuth();
  return (
    <Layout>
      <Heading textAlign="center" my={12}>
        Login
      </Heading>
      <Card maxW="md" mx="auto" mt={4}>
        <chakra.form
          onSubmit={async (e) => {
            e.preventDefault();
            e.preventDefault();
            if (!email || !password) {
              toast({ description: "Credential not valid", status: "error", duration: 5000, isClosable: true });
            }
            setIsSubmitting(true);
            login(email, password)
              .then((res) => history.push(location.state?.from ?? "/profile"))
              .catch((err) => {
                toast({ description: err.message, status: "error", duration: 5000, isClosable: true });
              })
              .finally(() => mounted.current && setIsSubmitting(false));
          }}
        >
          <Stack spacing="6">
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" autoComplete="email" required />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" autoComplete="password" required />
            </FormControl>
            {/* <PasswordField /> */}
            <Button isLoading={isSubmitting} type="submit" colorScheme="primary" size="lg" fontSize="md">
              Sign in
            </Button>
          </Stack>
        </chakra.form>
        <HStack justifyContent="space-between" my={4}>
          <Button variant="link">
            <Link to="/forgot-password">Forgot password?</Link>
          </Button>
          <Button variant="link" onClick={() => history.push("/register")}>
            Register
          </Button>
        </HStack>
        <DividerWithText my={6}>OR</DividerWithText>
        <Button
          onClick={() =>
            signInWithGoogle()
              .then((user) => console.log(user))
              .catch((err) => console.log(err.message))
          }
          variant="outline"
          isFullWidth
          colorScheme="red"
          leftIcon={<FaGoogle />}
        >
          Sign in with Google
        </Button>
      </Card>
    </Layout>
  );
}
