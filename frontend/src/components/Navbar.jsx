import { Box, Flex, Image, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useColorMode, useDisclosure } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { HiMenu } from "react-icons/hi"
import { useRecoilState } from 'recoil'
import  {userAtom}  from '../../atoms/userAtom.js'
import  {authAtom}  from '../../atoms/authAtom.js'
import useShowToast from '../../hooks/useShowToast'


const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [user, setUser] = useRecoilState(userAtom)
  const [authScreen, setAuthScreen] = useRecoilState(authAtom)
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if(!window.confirm("Are you sure you want to logout")) return
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()

      if (data.error) {
        showToast("Error",`${data.error}`, "error")
        return
      }

      localStorage.removeItem("user")
      setUser(null)
      navigate("/auth")

      if(isOpen){
        onClose();
      }
      showToast("Success","User Logged out successfully","success")

    } catch (err) {
      showToast("Error",`${err}`,"error")
    }
  }



  return (

    <Flex as={"nav"} justifyContent={'space-between'} mt={"2rem"} alignItems={'center'}>
      <RouterLink to={"/"}> <Image cursor={"pointer"} width={{ base: "130px", sm: "150px" }} src={colorMode === "dark" ? '/logo-white.svg' : '/logo-black.svg'} alt="logo" /></RouterLink>

      <Flex gap={5} alignItems={'center'} >

        {user && <Flex gap={6} display={{ base: "none", sm: "flex" }}>
          <Link as={RouterLink} fontWeight={600} _hover={{ opacity: 0.8 }} to={"/"}>Home</Link>
          <Link as={RouterLink} fontWeight={600} _hover={{ opacity: 0.8 }} to={`/profile/${user.username}`}>Profile</Link>
          <Link as={RouterLink} fontWeight={600} _hover={{ opacity: 0.8 }} onClick={handleLogout}>Logout</Link>
        </Flex>}

        {!user && <Link fontSize={["sm", "md"]} as={RouterLink} fontWeight={600} _hover={{ opacity: 0.8 }} to={"/auth"} onClick={() => authScreen === "login" ? setAuthScreen("singup") : setAuthScreen("login")}> {authScreen === "login" ? "Signup" : "Login"} </Link>}

        {user && <Box bg={"gray.700"} p={2.5} color={'white'} rounded={'full'} cursor={"pointer"} onClick={onOpen} display={{ base: "block", sm: "none" }}>
          <HiMenu size={20} />
        </Box>}

        {/* modal */}
        {user && <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxW={"250px"} bg={"gray.700"} color={"white"}>
            <ModalCloseButton mt={2} bg={"gray.900"} _focusVisible={{ border: "none" }} />
            <ModalBody>

              <Flex gap={6} flexDir={'column'} justifyContent={"center"} alignItems={"center"} my={10}>
                <Link onClick={onClose} as={RouterLink} fontWeight={600} _hover={{ opacity: 0.8 }} to={"/"}>Home</Link>
                <Link onClick={onClose} as={RouterLink} fontWeight={600} _hover={{ opacity: 0.8 }} to={`/profile/${user.username}`}>Profile</Link>
                <Link as={RouterLink} fontWeight={600} _hover={{ opacity: 0.8 }} onClick={handleLogout}>Logout</Link>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>}
        {/* modal */}


        <Box bg={"gray.700"} p={2.5} color={'white'} rounded={'full'} cursor={"pointer"} onClick={toggleColorMode}>
          <Image w={"20px"} h={"20px"} src={colorMode === "dark" ? "/moon.svg" : "/sun.svg"} alt="dark-light-mode" />
        </Box>
      </Flex>

    </Flex>



  )
}

export default Navbar