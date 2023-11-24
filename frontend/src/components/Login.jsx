
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { authAtom } from '../../atoms/authAtom.js'
import { userAtom } from '../../atoms/userAtom.js'
import useShowToast from '../../hooks/useShowToast.js'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const handleClick = () => setShowPassword(!showPassword)

  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  })
  const [login, setLogin] = useState(false)

  const setAuthScreen = useSetRecoilState(authAtom);
  const setUser = useSetRecoilState(userAtom)

  const showToast = useShowToast();



  const handleLogin = async (e) => {
    e.preventDefault()
    if (login) return;
    setLogin(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
      })

      const data = await res.json();
      if (data.error) {
        showToast("Error", `${data.error}`, "error")
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

    } catch (err) {
      showToast("Error", `${err}`, "error")
      return;
    } finally {
      setLogin(false)
    }

  }


  return (
    <Flex >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        <Box
          as={"form"}
          onSubmit={handleLogin}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input focusBorderColor='gray.300' type="text" placeholder='Username' value={inputs.username} onChange={(e) => setInputs((input) => ({ ...input, username: e.target.value }))} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input focusBorderColor='gray.300'
                  pr="4.5rem"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={inputs.password}
                  onChange={(e) => setInputs((input) => ({ ...input, password: e.target.value }))}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                isLoading={login}
                loadingText="Logging In"
                type='submit'
                size="lg"
                bg={'gray.600'}
                color={'white'}
                _hover={{
                  bg: 'gray.500',
                }}>
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account? <Link onClick={() => setAuthScreen("signup")} color={'blue.400'}>Signup</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}