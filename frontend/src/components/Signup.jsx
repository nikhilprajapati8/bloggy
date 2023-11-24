
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
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import { authAtom } from '../../atoms/authAtom'
import useShowToast from '../../hooks/useShowToast'
import { userAtom } from '../../atoms/userAtom'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    bio: ""
  })
  const [singup, setSignup] = useState(false);

  const setAuthScreen = useSetRecoilState(authAtom)
  const setUser = useSetRecoilState(userAtom)

  const showToast = useShowToast();

  const handleSingup = async (e) => {
    e.preventDefault()
    if (singup) return
    setSignup(true)

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
      })

      const data = await res.json();

      if (data.error) {
        showToast("Error", `${data.error}`, "error")
        return
      }

      localStorage.setItem("user", JSON.stringify(data))
      setUser(data);

    } catch (err) {
      showToast("Error", `${err}`, "error")

    } finally {
      setSignup(false)
    }

  }


  return (
    <Flex>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} pb={12} pt={8}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          as='form'
          onSubmit={handleSingup}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={[6, 8]}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input value={inputs.name} type="text" focusBorderColor='gray.300' onChange={(e) => setInputs((input) => ({ ...input, name: e.target.value }))} />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input value={inputs.username} focusBorderColor='gray.300' type="text" onChange={(e) => setInputs((input) => ({ ...input, username: e.target.value }))} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input value={inputs.email} focusBorderColor='gray.300' type="email" onChange={(e) => setInputs((input) => ({ ...input, email: e.target.value }))} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input value={inputs.password} focusBorderColor='gray.300' type={showPassword ? 'text' : 'password'} onChange={(e) => setInputs((input) => ({ ...input, password: e.target.value }))} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>About</FormLabel>
              <Textarea value={inputs.bio} rows={3} focusBorderColor='gray.300' onChange={(e) => setInputs((input) => ({ ...input, bio: e.target.value }))} />
              <Text fontSize={"xs"} fontWeight={"medium"} mt={1}>Brief description for your profile.</Text>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                type='submit'
                isLoading={singup}
                loadingText="Signing in"
                size="lg"
                bg={'gray.600'}
                color={'white'}
                _hover={{
                  bg: 'gray.500',
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={2}>
              <Text align={'center'}>
                Already a user? <Link onClick={() => setAuthScreen("login")} color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Signup;