/* eslint-disable react/prop-types */
import { Box, Button, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { FileEdit, Heart, Trash2 } from "lucide-react"
import { useParams } from 'react-router-dom'
import useShowToast from '../../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { blogAtom } from '../../atoms/blogAtom'
import { userAtom } from '../../atoms/userAtom'



const CommentActions = ({ comment }) => {
    const showToast = useShowToast();
    const { id } = useParams();
    const [blogs, setBlogs] = useRecoilState(blogAtom);
    const user = useRecoilValue(userAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [updateComment, setUpdateComment] = useState(comment?.commentText);
    const [isUpdatingComment, setIsUpdatingComment] = useState(false)
    const [liked, setLiked] = useState(comment?.commentLikes.includes(user?._id))
    const [isLiking, setIsLiking] = useState(false)
    const currentBlog = blogs[0];

    const handleDeleteComment = async () => {
        if (!window.confirm("Are you sure you want to delete this comment")) return
        try {
            const res = await fetch(`/api/blogs/deleteComment/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentId: comment._id })
            })

            const data = await res.json();
            if (data.error) {
                showToast("Error", `${data.error}`, "error")
                return
            }

            const updatedBlog = { ...currentBlog, comments: data }
            setBlogs([updatedBlog])



        } catch (err) {
            showToast("Error", `${err}`, "error")

        }
    }

    const handleEditComment = async () => {
        if (isUpdatingComment) return
        setIsUpdatingComment(true);
        try {
            const res = await fetch(`/api/blogs/updateComment/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentId: comment._id, updatedCommentText: updateComment })
            })

            const data = await res.json();
            if (data.error) {
                showToast("Error", `${data.error}`, "error")
                return
            }

            setBlogs([data])
            onClose()


        } catch (err) {
            showToast("Error", `${err}`, "error")

        } finally {
            setIsUpdatingComment(false)
        }
    }

    const handleLikeComment = async () => {
        if (isLiking) return
        setIsLiking(true)
        try {
            const res = await fetch(`/api/blogs/LikeComment/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentId: comment._id })
            })

            const data = await res.json();
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

    if (!comment) return null


    return (
        <Flex gap={3} alignItems={"center"}>
            {/* delete */}
            {comment.commentedBy === user?._id && <Box onClick={handleDeleteComment} bg={"red.400"} p={2} color={'white'} rounded={'full'} cursor={"pointer"} >
                <Trash2 size={16} />
            </Box>}

            {/* update */}
            {comment.commentedBy === user?._id && <Box onClick={onOpen} bg={"blue.400"} p={2} color={'white'} rounded={'full'} cursor={"pointer"} >
                <FileEdit size={16} />
            </Box>}

            {/* like */}
            <Box onClick={handleLikeComment} outline={"2px solid gray"} p={2} color={'white'} rounded={'full'} cursor={"pointer"} >
                <Heart size={16} fill={liked ? "#BE3144" : "transparent"} color={liked ? "#BE3144" : "gray"} strokeWidth={3} />
            </Box>


            {/* modal */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit comment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl >
                            <Input onChange={(e) => setUpdateComment(e.target.value)} value={updateComment} focusBorderColor="gray.300" placeholder='Your comment goes here' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button isLoading={isUpdatingComment} loadingText="Posting" onClick={handleEditComment} bg={"green.500"} _hover={{ bg: "green.600" }} color={"white"} mr={3}>
                            Edit
                        </Button>
                        <Button bg={"gray.600"} _hover={{ bg: "gray.500" }} color={"white"} onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>



            {/* modal */}
        </Flex>




    )
}

export default CommentActions;