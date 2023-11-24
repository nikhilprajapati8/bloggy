import { Box, Container, Flex, Grid, GridItem, Heading, Image, Link, Spinner, Tag, Text } from "@chakra-ui/react"
import BlogCard from "../components/BlogCard";
import { Plus } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import { useEffect, useState } from "react";
import { blogAtom } from "../../atoms/blogAtom";
import useShowToast from "../../hooks/useShowToast";

const Home = () => {
  const user = useRecoilValue(userAtom);
  const [blogs, setBlogs] = useRecoilState(blogAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (data.error) {
          showToast("Error", `${data.error}`, "error")
          return
        }
        setBlogs(data);
      } catch (err) {
        showToast("Error", `${err}`, "error")
      } finally {
        setLoading(false)
      }
    }
    getBlogs();

  }, [setBlogs, showToast])



  return (
    <>
      {user && <Link as={RouterLink} rounded={"full"} p={2} color={"white"} bg={"gray.800"} _light={{ bg: "gray.700" }} _hover={{ bg: "gray.600" }} cursor={"pointer"} border={"2px solid white"} zIndex={221} position={"fixed"} bottom={5} right={6} to={"/createblog"}><Plus /></Link>}
      <Container mt={"2rem"} maxWidth={"800px"} position={"relative"} >

        <Image w={"full"} h={"22rem"} objectFit={"cover"} rounded={"lg"} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"} src={"/homeImg.jpg"} alt="Blog-img" />

        <Box position={"absolute"} _dark={{ bg: "gray.700", color: "white" }} bg={"white"} color="gray.700" bottom={"-6rem"} left={10} maxW={{ base: "240px", sm: "400px" }} p={{ base: "1rem", sm: "1.5rem" }} rounded={"lg"} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"}>

          <Tag colorScheme="blue" size={{ base: "sm", sm: "md" }}>Welcome</Tag>
          <Heading my={{ base: 2.5, sm: 4 }} size={{ base: "sm", sm: "md" }}>Express yourself effortlessly on Bloggy. Welcome to simple and creative blogging! </Heading>

        </Box>
      </Container>

      <Heading margin={{ base: "8rem 0.7rem 0", sm: "8rem 0 0" }} size={"lg"} >Latest blogs </Heading>
      {loading && <Flex mt={10} justifyContent={"center"} alignItems={"center"}><Spinner size={"md"} /></Flex>}
      {!loading && blogs.length === 0 && <Text my={8} textAlign={"center"} fontSize={"xl"} >No blogs to show</Text>}

      <Grid w={"full"} placeItems={"center"} templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }} gap={{ base: "1.5rem", md: "2rem" }} my={"2.5rem"}>

        {blogs.map((blog) => {
          return <GridItem key={blog._id}>
            <BlogCard postedBy={blog.postedBy} blog={blog} />
          </GridItem>
        })}

      </Grid>


    </>
  )
}

export default Home;