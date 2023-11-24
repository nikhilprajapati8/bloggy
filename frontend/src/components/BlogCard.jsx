/* eslint-disable react/prop-types */
import { Avatar, Card, CardBody, Flex, Heading, Image, Stack, Tag, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from "date-fns"
import useGetUser from '../../hooks/useGetUser'

const BlogCard = ({blog: {blogImg, category, likes, title, createdAt, _id}, postedBy}) => {
  const { user } = useGetUser(postedBy);

  if (!user) return null


  return (
    <Link to={`/blogpage/${user.username}/${_id}`}>
      <Card maxW='xs' height={"320px"}  >
        <CardBody >
          <Image
            src={blogImg}
            alt='Blog-Image'
            borderRadius='lg'
            h={140}
            w={"300px"}
            objectFit={"cover"}
          />
          <Flex justifyContent={"space-between"} alignItems={"flex-end"}>

            <Tag mt={3} colorScheme="messenger" size={'sm'}>{category}</Tag>
            <Text fontWeight={"bold"} fontSize={"xs"}>{likes.length !== 0 && likes.length} {likes.length === 0 ? "No likes" : "Likes"}</Text>
          </Flex>


          <Stack mt='3' spacing='3'>
            <Heading minHeight={"48px"} noOfLines={2} wordBreak={'break-all'} size={{ base: "sm", sm: "md" }}>{title}</Heading>
            {/* <Text fontSize={{base:"sm",sm:"md"}} noOfLines={2}>
              This sofa is perfect for modern tropical spaces, baroque inspired
              spaces, earthy toned spaces and for people who love a chic design with a
              sprinkle of vintage design.
            </Text> */}
          </Stack>

          <Flex gap={3} mt={4} justifyContent={"space-between"} alignItems={["center", "flex-start"]} color={"gray.700"} _dark={{ color: "white" }} >
            <Flex width={"40%"} alignItems={"center"} gap={2}>
              <Avatar size={"xs"} src={user.profilePicture} name={user.username} alt="blog-title" />
              <Text fontSize={{ base: "9px", sm: "xs" }}>{user.username}</Text>
            </Flex>
            <Text width={"40%"} textAlign={"right"} fontSize={{ base: "8px", sm: "xs" }}>{formatDistanceToNow(new Date(createdAt))} ago</Text>
          </Flex>

        </CardBody>
      </Card>
    </Link>
  )
}

export default BlogCard