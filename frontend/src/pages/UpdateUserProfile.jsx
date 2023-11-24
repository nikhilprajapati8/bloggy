import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Avatar,
  Center,
  FormHelperText,
  Textarea,
  InputLeftAddon,
  InputGroup,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import usePreviewImg from '../../hooks/usePreviewImg';
import {useSetRecoilState } from 'recoil';
import { userAtom } from '../../atoms/userAtom';

const UpdateUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true)
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: ""
  })

  const setUser = useSetRecoilState(userAtom)

  const imgRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [updateUser, setUpdateUser] = useState(false)


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/getuser/${id}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", `${data.error}`, "error")
          return
        }
        setInputs({
          username: data.username,
          email: data.email,
          password: "",
          bio: data.bio,
          facebook: data.facebook,
          twitter: data.twitter,
          instagram: data.instagram,
          youtube: data.youtube
        })
        setImgUrl(data.profilePicture)
      } catch (err) {
        showToast("Error", `${err}`, "error")

      } finally {
        setLoading(false)
      }

    }
    getUser();

  }, [id, showToast, setImgUrl])

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if(updateUser) return
    setUpdateUser(true)
    try {
      const res = await fetch(`/api/users/update/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...inputs, profilePicture: imgUrl })
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", `${data.error}`, "error")
        return
      }
      setUser(data);
      localStorage.setItem("user",JSON.stringify(data))
      navigate(`/profile/${data.username}`)
      showToast("Success","Profile updated successfully","success")
    } catch (err) {
      showToast("Error", `${err}`, "error")
      console.log(err)

    }finally{
      setUpdateUser(false)
    }

  }

  if (loading) return (
    <Flex my={10} justifyContent={"center"} alignItems={"center"}><Spinner
      size={"lg"} /></Flex>
  )

  return (
    <>
      <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }} my={8} textAlign={"center"}>
        Edit User Profile
      </Heading>
      <Flex
        align={'center'}
        justify={'center'}
        mb={10}
        as={"form"}
        onSubmit={handleUpdateUser}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={"600px"}
          bg={'white'}
          _dark={{ bg: "gray.700" }}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
        >

          <FormControl id="userName" mt={2}>
            <Stack direction={"column"} spacing={3}>
              <Center>
                <Avatar size="xl" src={imgUrl}>
                </Avatar>
              </Center>
              <Center >
                <Button onClick={() => imgRef.current.click()} bg={"gray.600"} _hover={{ bg: "gray.500" }} color={'white'}>Change Avatar</Button>
                <Input ref={imgRef} onChange={handleImageChange} type='file' hidden />
              </Center>
            </Stack>
          </FormControl>
          <FormControl >
            <FormLabel>Username</FormLabel>
            <Input
              onChange={(e) => setInputs((input) => ({ ...input, username: e.target.value }))}
              value={inputs.username}
              focusBorderColor="gray.300"
              placeholder="Username"
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl >
            <FormLabel>Email address</FormLabel>
            <Input
              onChange={(e) => setInputs((input) => ({ ...input, email: e.target.value }))}
              value={inputs.email}
              focusBorderColor="gray.300"
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </FormControl>
          <FormControl >
            <FormLabel>Password</FormLabel>
            <Input
              onChange={(e) => setInputs((input) => ({ ...input, password: e.target.value }))}
              value={inputs.password}
              focusBorderColor="gray.300"
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl>
          <SimpleGrid columns={1} spacing={6}>
            <FormControl colSpan={[3, 2]}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>
                Facebook
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftAddon
                  bg="gray.50"
                  _dark={{
                    bg: 'gray.800',
                  }}

                  color="gray.500"
                  rounded="md">
                  https://
                </InputLeftAddon>
                <Input
                  onChange={(e) => setInputs((input) => ({ ...input, facebook: e.target.value }))}
                  value={inputs.facebook}
                  type="text"
                  placeholder="www.example.com"
                  focusBorderColor="gray.300"
                  rounded="md"
                />
              </InputGroup>
            </FormControl>

            <FormControl colSpan={[3, 2]}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>
                Twitter
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftAddon
                  bg="gray.50"
                  _dark={{
                    bg: 'gray.800',
                  }}
                  color="gray.500"
                  rounded="md">
                  https://
                </InputLeftAddon>
                <Input
                onChange={(e) => setInputs((input) => ({ ...input, twitter: e.target.value }))}
                value={inputs.twitter}
                  type="text"
                  placeholder="www.example.com"
                  focusBorderColor="gray.300"
                  rounded="md"
                />
              </InputGroup>
            </FormControl>

            <FormControl colSpan={[3, 2]}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>
                Instagram
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftAddon
                  bg="gray.50"
                  _dark={{
                    bg: 'gray.800',
                  }}
                  color="gray.500"
                  rounded="md">
                  https://
                </InputLeftAddon>
                <Input
                  onChange={(e) => setInputs((input) => ({ ...input, instagram: e.target.value }))}
                  value={inputs.instagram}
                  type="text"
                  placeholder="www.example.com"
                  focusBorderColor="gray.300"
                  rounded="md"
                />
              </InputGroup>
            </FormControl>

            <FormControl colSpan={[3, 2]}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>
                Youtube
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftAddon
                  bg="gray.50"
                  _dark={{
                    bg: 'gray.800',
                  }}
                  color="gray.500"
                  rounded="md">
                  https://
                </InputLeftAddon>
                <Input
                  onChange={(e) => setInputs((input) => ({ ...input, youtube: e.target.value }))}
                  value={inputs.youtube}
                  type="text"
                  placeholder="www.example.com"
                  focusBorderColor="gray.300"
                  rounded="md"
                />
              </InputGroup>
            </FormControl>

            <FormControl id="email" mt={1} >
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}>
                About
              </FormLabel>
              <Textarea
                onChange={(e) => setInputs((input) => ({ ...input, bio: e.target.value }))}
                value={inputs.bio}
                placeholder="you@example.com"
                rows={3}
                shadow="sm"
                focusBorderColor="gray.300"
                fontSize={{

                  sm: 'sm',
                }}
              />
              <FormHelperText>
                Brief description for your profile.
              </FormHelperText>
            </FormControl>
          </SimpleGrid>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={"gray.600"}
              _hover={{ bg: "gray.500" }}
              color={'white'}
              w="full">
              Cancel
            </Button>
            <Button
            type='submit'
            isLoading={updateUser}
            loadingText="Updating profile"
              bg={'green.500'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'green.400',
              }}>
              Update
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  )
}

export default UpdateUserProfile;