import { Button, Center, chakra, FormControl, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Card } from "../../../Card/Card";
import DividerWithText from "../DividerWithText";
import { Layout } from "../Layout";
import { useAuth } from "../../../../contexts/AuthContext";
import useMounted from "../../../../hooks/useMounted";


export default function Registerpage() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { register, signInWithGoogle } = useAuth();
  const mounted = useMounted();
  return (
    <Layout>
      <Heading textAlign="center" my={12}>
        Register
      </Heading>
      <Card maxW="md" mx="auto" mt={4}>
        <chakra.form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email || !password) {
              toast({ description: "Credential not valid", status: "error", duration: 5000, isClosable: true });
            }
            setIsSubmitting(true);
            register(email, password)
              .then((res) => console.log(res))
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
            <Button isLoading={isSubmitting} type="submit" colorScheme="primary" size="lg" fontSize="md">
              Sign up
            </Button>
          </Stack>
        </chakra.form>
        <Center my={4}>
          <Button variant="link" onClick={() => history.push("/login")}>
            Login
          </Button>
        </Center>
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
