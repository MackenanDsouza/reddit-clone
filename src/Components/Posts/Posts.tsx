import { Community } from "@/Atoms/communitiesAtom";
import { Post, PostVote } from "@/Atoms/postAtom";
import { auth, firestore } from "@/Firebase/clientApp";
import usePosts from "@/Hooks/usePosts";
import { User } from "firebase/auth";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";
import { log } from "console";

type PostsProps = {
	communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
	const [user] = useAuthState(auth);
	const {
		postStateValue,
		setPostStateValue,
		onDeletePost,
		onSelectPost,
		onVotePost,
	} = usePosts();
	const [loading, setLoading] = useState(false);
	const getPosts = async () => {
		setLoading(true);
		try {
			// get Posts for this community
			const postQuery = query(
				collection(firestore, "posts"),
				where("communityId", "==", communityData.id),
				orderBy("createdAt", "desc")
			);

			const postDocs = await getDocs(postQuery);
			const posts = postDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// console.log("Posts",posts)

			setPostStateValue((prev) => ({
				...prev,
				posts: posts as Post[],
			}));
		} catch (error: any) {
			console.log("getPosts Errorr:", error);
		}
		setLoading(false);
	};

	useEffect(() => {
		getPosts();
	}, [communityData.id]);

	return (
		<>
			{loading ? (
				<PostLoader />
			) : (
				<Stack>
					{postStateValue.posts.map((item) => (
						<PostItem
							key={item.id}
							post={item}
							UserIsCreator={user?.uid === item.creatorId}
							userVoteValue={
								postStateValue.postVotes.find((vote) => {
									return vote.postId === item.id;
								})?.voteValue
							}
							onDeletePost={onDeletePost}
							onSelectPost={onSelectPost}
							onVotePost={onVotePost}
						/>
					))}
				</Stack>
			)}
		</>
	);
};
export default Posts;
