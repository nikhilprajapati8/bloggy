import { Avatar, Box, Flex, Grid, GridItem, Spinner, Text } from '@chakra-ui/react'
import { BiLogoFacebook } from "react-icons/bi"
import { FaXTwitter } from "react-icons/fa6"
import { AiOutlineInstagram } from "react-icons/ai"
import { AiFillYoutube } from "react-icons/ai"
import BlogCard from '../components/BlogCard'
import { useNavigate, useParams } from 'react-router-dom'
import useGetUser from '../../hooks/useGetUser'
import { useEffect, useState } from 'react'
import useShowToast from '../../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { blogAtom } from '../../atoms/blogAtom'
import { userAtom } from "../../atoms/userAtom"


const UserProfile = () => {
  const navigate = useNavigate()
  const { query } = useParams();
  const { user, loading } = useGetUser(query);
  const showToast = useShowToast();
  const [blogs, setBlogs] = useRecoilState(blogAtom);
  const loggedInUser = useRecoilValue(userAtom)
  const [fetchingBlogs, setFetchingBlogs] = useState(true)


  useEffect(() => {
    const getUserBlogs = async () => {
      if (!user) return
      try {
        const res = await fetch(`/api/blogs/userBlogs/${user._id}`);
        const data = await res.json()

        if (data.error) {
          showToast("Error", `${data.error}`, "error")
          return
        }
        setFetchingBlogs(false)
        setBlogs(data);
      } catch (err) {
        showToast("Error", `${err}`, "error")

      }
    }
    getUserBlogs()
  }, [showToast, user?._id, user, setBlogs])



  if (fetchingBlogs) return (
    <Flex my={10} justifyContent={"center"} alignItems={"center"}><Spinner size={"lg"} /></Flex>
  )

  if (!user && !loading) return (
    <Text my={10} fontSize={"3xl"} fontWeight={"semibold"} textAlign={"center"}>
      User not found
    </Text>
  )

  return (
    <>

      <Flex flexDir={"column"} maxW={"600px"} mx="auto" rounded={"lg"} bg="white" _dark={{ bg: "gray.700" }} p={"2rem"} my={7} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"} >
        <Flex justifyContent={{ base: "space-between", sm: "space-evenly" }} alignItems={"center"} gap={4}>

          <Flex alignItems={"center"} gap={2}  >

            <Avatar size={{ base: "md", sm: "lg" }} src={user.profilePicture} name={user.username} border={"2px solid white"} />
            <Flex flexDir={"column"}>
              <Text fontSize={{ base: "sm", sm: "md" }} fontWeight={"bold"}>{user.username}</Text>
              <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight={"thin"}>Collaborator and Editor</Text>
            </Flex>

          </Flex>

          {user?._id === loggedInUser?._id && <Box onClick={() => navigate(`/profileUpdate/${user?._id}`)} bg={"gray.600"} p={{ base: "1.5", sm: "2.5" }} color={'white'} rounded={'lg'} cursor={"pointer"} >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} className="lucide lucide-file-edit">
              <title>Edit profile</title>
              <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" /><polyline points="14 2 14 8 20 8" /><path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" /></svg>
          </Box>}
        </Flex>

        <Text my="6" lineHeight={1.5} textAlign={"center"} fontSize={{ base: "sm", sm: "md" }}>{user.bio}</Text>

        <Flex gap={3} alignSelf={"center"}>
          {user.facebook && <Box bg={"blue.500"} p={2} color={'white'} rounded={'full'} cursor={"pointer"} >
            <a href={`https://${user.facebook}`} target="_blank" rel="noreferrer"><BiLogoFacebook size={15} /></a>
          </Box >}
          {user.twitter && <Box bg={"gray.500"} p={2} color={'white'} rounded={'full'} cursor={"pointer"} >
            <a href={`https://${user.twitter}`} target="_blank" rel="noreferrer"><FaXTwitter size={15} /></a>
          </Box >}
          {user.instagram && <Box bg={"pink.500"} p={2} color={'white'} rounded={'full'} cursor={"pointer"} >
            <a href={`https://${user.instagram}`} target="_blank" rel="noreferrer"><AiOutlineInstagram size={15} /></a>
          </Box >}
          {user.youtube && <Box bg={"red.500"} p={2} color={'white'} rounded={'full'} cursor={"pointer"} >
            <a href={`https://${user.youtube}`} target="_blank" rel="noreferrer"><AiFillYoutube size={15} /></a>
          </Box >}
        </Flex>
      </Flex>


      {blogs.length === 0 && <Text textAlign={"center"} my={10} fontSize={"2xl"}>User has no blog post</Text>}
      <Grid w={"full"} placeItems={"center"} templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }} gap={{ base: "1.5rem", md: "2rem" }} my={"2.5rem"}>

        {blogs.map((blog) => {
          return <GridItem key={blog._id}>
            <BlogCard blog={blog} postedBy={blog.postedBy} />
          </GridItem>
        })}
      </Grid>
    </>
  )
}

export default UserProfile