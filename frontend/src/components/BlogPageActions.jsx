/* eslint-disable react/prop-types */
import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { FileEdit, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useShowToast from '../../hooks/useShowToast';
import {  useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from "../../atoms/userAtom"
import { blogAtom } from '../../atoms/blogAtom';
import { useNavigate } from 'react-router-dom';

const BlogPageActions = ({ blog }) => {
    const user = useRecoilValue(userAtom)
    const [liked, setLiked] = useState(blog.likes.includes(user?._id))
    const [isLiking, setIsLiking] = useState(false)
    const [comment, setComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const showToast = useShowToast();
    const setBlogs = useSetRecoilState(blogAtom)

    const navigate = useNavigate();

    const handleLike = async () => {
        if (!user) {
			showToast('Error', 'Please login to like a blog post', 'error');
			return
		}
        if (isLiking) return
        setIsLiking(true)
        try {
            const res = await fetch(`/api/blogs/like/${blog._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()
            if (data.error) {
                showToast("Error", `${data.error}`, "error")
                return
            }

            setLiked(!liked)

        } catch (err) {
            showToast("Error", `${err}`, "error")

        } finally {
            setIsLiking(false)
        }
    }

    const handleComment = async () => {
        if (!user) {
			showToast('Error', 'Please login to comment on a blog post', 'error');
			return
		}

        if (isCommenting) return
        setIsCommenting(true)
        try {
            const res = await fetch(`/api/blogs/comment/${blog._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentText: comment })
            })

            const data = await res.json();

            if (data.error) {
                showToast("Error", `${data.error}`, "error")
                return
            }


            const updatedBlog = { ...blog,comments:[...blog.comments,data] };
            setBlogs([updatedBlog]);
            setComment("")
            onClose();

        } catch (err) {
            showToast("Error", `${err}`, "error")

        } finally {
            setIsCommenting(false)
        }
    }

    const handleDeleteBlog = async() => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`/api/blogs/${blog._id}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                }
            })

            const data = await res.json();
            if (data.error) {
                showToast("Error", `${data.error}`, "error")
                return
            }
          
            showToast("Success","Blog deleted successfully","success")
            navigate("/")

        } catch (err) {
            showToast("Error", `${err}`, "error")
            
        }
    }

    return (

        <>

            <Button p={2} onClick={handleLike} _light={{ bg: "gray.800" }} bg={"blackAlpha.600"} _hover={{ bg: "blackAlpha.900" }} ><Heart fill={liked ? "#BE3144" : "transparent"} color={liked ? "#BE3144" : "white"} size={22} /></Button>

            <Button p={2} bg={"blue.400"} _hover={{ bg: "blue.500" }} onClick={onOpen} color={"white"}><MessageCircle size={22} /></Button>

         {user?._id === blog.postedBy &&   <Button onClick={()=>navigate(`/updateblog/${blog._id}`)} p={2} bg={"green.400"} _hover={{ bg: "green.500" }} color={"white"}><FileEdit size={22} /></Button>}

         {user?._id === blog.postedBy &&  <Button onClick={handleDeleteBlog} p={2} bg={"red.400"} _hover={{ bg: "red.500" }} color={"white"}><Trash2 size={22} /></Button>}



            {/* modal */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add your comment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input onChange={(e) => setComment(e.target.value)} value={comment} focusBorderColor="gray.300" placeholder='Your comment goes here' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button isLoading={isCommenting} loadingText="Posting" onClick={handleComment} bg={"green.500"} _hover={{ bg: "green.600" }} color={"white"} mr={3}>
                            Post
                        </Button>
                        <Button bg={"gray.600"} _hover={{ bg: "gray.500" }} color={"white"} onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>



            {/* modal */}

        </>
    )
}

export default BlogPageActions