import { Post, postState } from "@/Atoms/postAtom";
import {
  Box,
  Flex,
  Text,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Commentinput from "./Commentinput";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/Firebase/clientApp";
import { useSetRecoilState } from "recoil";
import Commentitem, { Comment } from "./Commentitem";
import { useRouter } from "next/router";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setPostState = useSetRecoilState(postState);
  const router = useRouter();

  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      //   console.log("This is the selected post", selectedPost);
      //create Comment document
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId: communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;
      //Update no of comments in post document (postid)

      const postDocRef = doc(firestore, "posts", selectedPost!.id);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();

      //update client recoil state
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost!.numberOfComments + 1,
        } as Post,
      }));

      //   console.log("comment:", comments);
    } catch (error) {
      console.log(error);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);

    try {
      const batch = writeBatch(firestore);
      //delete comment
      const commentDocRef = doc(firestore, `comments`, comment.id);
      batch.delete(commentDocRef);

      //update no of comments in post document (postid)(decrease the number of comments by 1)
      const postDocRef = doc(firestore, `posts`, selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));

      //update client recoil state
    } catch (error) {
      console.log(error);
    }
    setLoadingDeleteId("");
  };

  const getPostComments = async () => {
    const { pid } = router.query;

    //get comments from the firebase db that match the postid in the query
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      ); //Could use pid to get the comments
      //But he tutorrial said to use selected POst.id to get the comments

      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //update the comments array with the comments
      setComments(comments as Comment[]);
    } catch (error) {
      console.log(error);
    }
    setFetchLoading(false);

    //
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);
  return (
    <Box bg="white" borderRadius={"0px 0px 4px 4px"} p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize={"10pt"}
        width={"100%"}
      >
        {!fetchLoading && (
          <Commentinput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} padding={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding={6} bg="white">
                <SkeletonCircle size={"10"} />
                <SkeletonText mt={4} noOfLines={2} spacing={4} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                // direction={"column"}
                justify={"center"}
                align={"center"}
                borderTop={"1px solid "}
                borderColor={"gray.100"}
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <Commentitem
                    key={comment.id}
                    comment={comment}
                    loadingDelete={loadingDeleteId === comment.id}
                    onDelete={onDeleteComment}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
