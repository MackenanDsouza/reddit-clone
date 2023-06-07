import { CommunityState } from "@/Atoms/communitiesAtom";
import { Post, PostVote } from "@/Atoms/postAtom";
import CreatePostLink from "@/Components/Community/CreatePostLink";
import PersonalHome from "@/Components/Community/PersonalHome";
import Premium from "@/Components/Community/Premium";
import Recommendations from "@/Components/Community/Recommendations";
import Layout from "@/Components/Layout/Layout";
import PageContent from "@/Components/Layout/PageContent";
import SearchInput from "@/Components/NavBar/SearchInput";
import PostItem from "@/Components/Posts/PostItem";
import PostLoader from "@/Components/Posts/PostLoader";
import { auth, firestore } from "@/Firebase/clientApp";
import useCommunityData from "@/Hooks/useCommunityData";
import usePosts from "@/Hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import {
	Query,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

export default function Home() {
	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const {
		postStateValue,
		setPostStateValue,
		onDeletePost,
		onSelectPost,
		onVotePost,
	} = usePosts();
	const { communityStateValue } = useCommunityData();
	const buildUserHomeFeed = async () => {
		setLoading(true);
		try {
			if (communityStateValue.mySnippets.length) {
				//get posts from users communities
				
				const myCommunityIds = communityStateValue.mySnippets.map(
					(snippet) => snippet.communityId
				);
				const postQuery = query(
					collection(firestore, "posts"),
					where("communityId", "in", myCommunityIds),
					limit(10)
				);
				const postDocs = await getDocs(postQuery);
				const posts = postDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPostStateValue((prev) => ({
					...prev,
					posts: posts as Post[],
				}));
				
			} else {
				buildNoUserHomeFeed();
			}
		} catch (error) {
			console.log("buildUserGomeFeed Error:", error);
		}
		setLoading(false);
	};

	const buildNoUserHomeFeed = async () => {
		setLoading(true);
		try {
			console.log(postStateValue);
			const postQuery = query(
				collection(firestore, "posts"),
				orderBy("voteStatus", "desc"),
				limit(10)
			);
			const postDocs = await getDocs(postQuery);

			const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

			setPostStateValue((prev) => ({
				...prev,
				posts: posts as Post[],
			}));

			//Set Post States
		} catch (error) {
			console.log("Error in BUildnouserfeed", error);
		}
		setLoading(false);
	};

	const getUserPostVotes = async () => {
		try {
			const postIds = postStateValue.posts.map((post) => post.id);
			const postVotesQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where("postId", "in", postIds)
			);
			const postVotesDoc = await getDocs(postVotesQuery);
			const postVotes = postVotesDoc.docs.map((postVote) => ({
				id: postVote.id,
				...postVote.data(),
			}));
			setPostStateValue((prev) => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}));
		} catch (error) {
			console.log("Error in getUserPostVotes", error);
		}
	};

	useEffect(() => {
		if (communityStateValue.snippetsFetched) buildUserHomeFeed();
	}, [communityStateValue.snippetsFetched]);

	//UseEffects
	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();
	}, [user, loadingUser]);

	useEffect(() => {
		if (user && postStateValue.posts.length) getUserPostVotes();
		return () => {
			setPostStateValue((prev) => ({
				...prev,
				postVotes: [],
			}));
		};
	}, [user, postStateValue.posts]);
	return (
		<PageContent>
			<>
				<CreatePostLink />
				{loading ? (
					<PostLoader />
				) : (
					<Stack>
						{postStateValue.posts.map((post) => (
							<PostItem
								key={post.id}
								onDeletePost={onDeletePost}
								onVotePost={onVotePost}
								onSelectPost={onSelectPost}
								post={post}
								userVoteValue={
									postStateValue.postVotes.find(
										(vote) => vote.postId === post.id
									)?.voteValue
								}
								UserIsCreator={post.creatorId === user?.uid}
								HomePage
							/>
						))}
					</Stack>
				)}
			</>
			<>
				<Stack spacing={5}>
					<Recommendations />
					<Premium />
					<PersonalHome />
				</Stack>
			</>
		</PageContent>
	);
}
