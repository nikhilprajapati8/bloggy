import { Box, Button, CloseButton, Flex, Heading, Image, Input, Text, Textarea } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import usePreviewImg from '../../hooks/usePreviewImg';
import useShowToast from '../../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '../../atoms/userAtom';
import { blogAtom } from '../../atoms/blogAtom';
import { useNavigate } from "react-router-dom"

const MAX_TITLE_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 15;
const MAX_DESCRIPTION_LENGTH = 1000;

const CreateBlog = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
  })
  const [maxCharacters, setMaxCharacters] = useState({
    title: 0,
    description: 0,
    category: 0,
  })
  const showToast = useShowToast();
  const [isCreatingBlog, setIsCreatingBlog] = useState(false)

  const imgRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  const user = useRecoilValue(userAtom);
  const [blogs, setBlogs] = useRecoilState(blogAtom);

  const navigate = useNavigate();

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setInputs((input) => ({ ...input, [name]: value }));
    setMaxCharacters((prev) => ({ ...prev, [name]: value.length }))
  }

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (isCreatingBlog) return
    setIsCreatingBlog(true)
    try {
      const res = await fetch("/api/blogs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postedBy: user._id, ...inputs, blogImg: imgUrl })
      })

      const data = await res.json();


      if (data.error) {
        showToast("Error", `${data.error}`, "error")
        return
      }

      setBlogs([data, ...blogs])
      navigate("/")
      setInputs({ title: "", description: "", category: "" });
      setMaxCharacters({ title: 0, description: 0, category: 0 });
      setImgUrl(null)
      showToast("Success", "Blog created successfully", "success")

    } catch (err) {
      showToast("Error", `${err}`, "error")

    } finally {
      setIsCreatingBlog(false)
    }

  }


  return (
    <Flex as={"form"} onSubmit={handleCreateBlog} my={"3rem"} justifyContent={"space-around"} alignItems={"center"} flexDir={{ base: "column", md: "row" }} gap={10}>

      <Flex flexDir={"column"} alignItems={"center"} gap={6}>
        <Box position={"relative"}>
          <Image src={imgUrl || "/choose-image.png"} alt={"Blog-img"} boxShadow={" rgba(0, 0, 0, 0.35) 0px 5px 15px;"} objectFit={"cover"} rounded={"lg"} w={"500px"} h={"300px"} mx={{ base: "auto", sm: "none" }} />
          {imgUrl && <CloseButton onClick={() => setImgUrl(null)} bg={"gray.600"} color={"white"} position={'absolute'} top={5} right={5}></CloseButton>}
        </Box>
        <Button onClick={() => imgRef.current.click()} colorScheme='white' variant={'outline'} size={"md"} >Choose Image</Button>
        <Input ref={imgRef} onChange={handleImageChange} type='file' hidden />
      </Flex>


      <Flex flexDirection={"column"} mx={{ base: "auto", sm: "none" }} maxW={"full"} w={"xl"}>
        <Box >
          <Heading size={{ base: "lg", sm: "xl" }} mb={3}>Title</Heading>
          <Textarea required onChange={handleInputs} name="title" value={inputs.title} maxLength={100} mb={1} type='text' focusBorderColor='gray.300' _dark={{ border: "1px solid gray" }} placeholder='Title goes here...' rows={3} p={5} />
          <Text color={"gray.400"} fontWeight={"semibold"} fontSize={"xs"}>{maxCharacters.title}/{MAX_TITLE_LENGTH}</Text>
        </Box>

        <Box>
          <Heading size={{ base: "lg", sm: "xl" }} mt={5} mb={3}>Category</Heading>
          <Input required onChange={handleInputs} name="category" value={inputs.category} maxLength={15} mb={1} type='text' focusBorderColor='gray.300' _dark={{ border: "1px solid gray" }} placeholder='Category' p={5} />
          <Text color={"gray.400"} fontWeight={"semibold"} fontSize={"xs"}>{maxCharacters.category}/{MAX_CATEGORY_LENGTH}</Text>
        </Box>

        <Box>
          <Heading size={{ base: "lg", sm: "xl" }} mt={5} mb={3}>Description</Heading>
          <Textarea required onChange={handleInputs} name="description" value={inputs.description} maxLength={1000} mb={1} type='text' focusBorderColor='gray.300' _dark={{ border: "1px solid gray" }} placeholder='Description for the blog goes here...' rows={6} p={5} />
          <Text color={"gray.400"} fontWeight={"semibold"} fontSize={"xs"}>{maxCharacters.description}/{MAX_DESCRIPTION_LENGTH}</Text>
        </Box>

        <Button isLoading={isCreatingBlog} loadingText="Creating Blog" type='submit' isDisabled={!imgUrl} bg={"gray.600"} color={"white"} _hover={{ bg: "gray.500" }} mt={2}>Post</Button>
      </Flex>
    </Flex>
  )
}

export default CreateBlog
