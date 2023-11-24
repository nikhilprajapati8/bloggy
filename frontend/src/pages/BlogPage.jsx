import { Avatar, Container, Divider, Flex, Heading, Image, Spinner, Tag, Text } from "@chakra-ui/react"
import Comments from "../components/Comments"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { blogAtom } from "../../atoms/blogAtom";
import useShowToast from "../../hooks/useShowToast";
import BlogPageActions from "../components/BlogPageActions";
import useGetUser from "../../hooks/useGetUser";
import { formatDistanceToNow } from "date-fns";

const BlogPage = () => {
  const navigate = useNavigate();
  const { id, username } = useParams();

  const [blogs, setBlogs] = useRecoilState(blogAtom);
  const { user, loading } = useGetUser(username);

  const showToast = useShowToast();

  useEffect(() => {
    const getBlog = async () => {
      setBlogs([])
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", `${data.error}`, "error")
          return
        }

        setBlogs([data])

      } catch (err) {
        showToast("Error", `${err}`, "error")
      }
    }
    getBlog();

  }, [showToast, setBlogs, id])

  const currentBlog = blogs[0];


  if (!user && loading) {
    return (<Flex my={6} justifyContent={"center"}>
      <Spinner size={"lg"} />
    </Flex>)
  }

  if (!currentBlog) return null;

  return (
    <Container maxW={"800px"}>


      <Flex gap={3} mt={"10"}>
        <Tag colorScheme="blue" size={"sm"}>{currentBlog.category}</Tag>
        {/* <Tag colorScheme="blue" size={"sm"}>Fintech</Tag> */}
      </Flex>

      <Heading size={{ base: "lg", sm: "xl" }}>{currentBlog.title}</Heading>

      <Flex gap={10} my={5} alignItems={"center"} justifyContent={{ base: "space-between", sm: "normal" }}>
        <Flex gap={2} alignItems={"center"}>
          <Avatar cursor={"pointer"} name={user.username} src={user.profilePicture} size={"xs"} onClick={() => navigate(`/profile/${user.username}`)} />
          <Text cursor={"pointer"} fontSize={{ base: "10px", sm: "12px" }} onClick={() => navigate(`/profile/${user.username}`)}>{user.username}</Text>
        </Flex>
        <Text fontSize={{ base: "10px", sm: "12px" }}> {formatDistanceToNow(new Date(currentBlog.createdAt))} ago</Text>
      </Flex>

      <Image rounded={"lg"} mx={"auto"} w={"lg"} src={currentBlog.blogImg} />

      <Text my={5}>{currentBlog.description}</Text>

      <Flex gap={3}>
        <BlogPageActions blog={currentBlog} />
      </Flex>

      <Divider mt={12} mb={5} borderColor="gray.900" _dark={{ borderColor: "gray.100" }} />
      {currentBlog.comments.length === 0 ? <Text textAlign={"center"} my={7} fontSize={"lg"} fontWeight={"semibold"}>No comments on this blog post</Text>
        : currentBlog.comments.map((comment) => {
          return <Comments key={comment._id} comment={comment} lastComment={comment._id === currentBlog.comments[currentBlog.comments.length - 1]._id} />
        })}
      <Comments />

    </Container>



  )
}

export default BlogPage