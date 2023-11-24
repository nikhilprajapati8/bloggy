/* eslint-disable react/prop-types */
import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import CommentActions from "./CommentActions";


const Comments = ({ comment, lastComment }) => {
  const navigate = useNavigate();


  if (!comment) return null
  return (
    <Box my={5}>
      <Flex justifyContent={"space-between"} my={3} gap={3}>
        <Flex alignItems={"center"} gap={2}>
          <Avatar cursor={"pointer"} onClick={() => navigate(`/profile/${comment.username}`)} src={comment.userProfilePicture} name={comment.username} size={"sm"} />
          <Text cursor={"pointer"} onClick={() => navigate(`/profile/${comment.username}`)} fontWeight={"bold"} fontSize={"sm"}>{comment.username}</Text>
        </Flex>

        {/* for devices above 500px */}
        <Box display={{ base: "block", sm: "block" }}>
          <CommentActions comment={comment} />
        </Box>
      </Flex>

      <Text fontSize={"14px"}>{comment.commentText}</Text>
      {!lastComment && <Divider my={5} opacity={0.4} borderColor={"blackAlpha.600"} _dark={{ borderColor: "gray.500" }} />}

    </Box>
  )
}

export default Comments