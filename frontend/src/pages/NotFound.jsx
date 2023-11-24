import { Button, Flex, Image } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <Flex justifyContent={"center"} flexDir={"column"}>
    <Image src="./notFound.jpg" alt="" mx={"auto"} width={"700px"} mt={"14"} rounded={"full"}/>
    <Button as={Link} to={"/"} alignSelf={"center"} my={4} bg={"gray.600"} _hover={{bg:"gray.500"}} color={"white"}>Go to Home page</Button>
    
    
    </Flex>
  )
}

export default NotFound