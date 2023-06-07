import { AuthModalState } from "@/Atoms/authModalAtom";
import { Community, CommunityState } from "@/Atoms/communitiesAtom";
import { Post, PostVote, postState } from "@/Atoms/postAtom";
import { auth, firestore, storage } from "@/Firebase/clientApp";
import { Console } from "console";
import {
	QuerySnapshot,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
	writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Router, useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const usePosts = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);
	const setAuthModalState = useSetRecoilState(AuthModalState);
	const [user] = useAuthState(auth);
	const currentCommunity = useRecoilValue(CommunityState).currentCommunity;
	const router = useRouter();

	const onVotePost = async (
		event: React.MouseEvent<SVGElement, MouseEvent>,
		post: Post,
		vote: number,
		communityId: string
	) => {
		event.stopPropagation();
		if (!user) {
			setAuthModalState((prev) => ({
				...prev,
				open: true,
				view: "login",
			}));
			return;
		}

		try {
			const { voteStatus } = post;

			const existingVote = postStateValue.postVotes.find((voter) => {
				return voter.postId === post.id;
			});
			const batch = writeBatch(firestore);
			const updatedPost = { ...post };
			const updatedPosts = [...postStateValue.posts];
			let updatedPostVotes = [...postStateValue.postVotes];
			let voteChange = vote;
			//   console.log("Existing Vote ", existingVote);

			if (!existingVote) {
				//create anew postVote document

				const postVoteRef = doc(
					collection(firestore, "users", `${user?.uid}/postVotes`)
				);

				const newVote: PostVote = {
					id: postVoteRef.id,
					postId: post.id!,
					communityId: communityId,
					voteValue: vote,
				};
				// console.log("NEW VOTE!!!", newVote);
				batch.set(postVoteRef, newVote);
				// add/substract 1 from post.voteStatus

				updatedPost.voteStatus = voteStatus + vote;
				updatedPostVotes = [...updatedPostVotes, newVote];
			}

			// Existing Vote -they have voted on the post before
			else {
				const postVoteRef = doc(
					firestore,
					"users",
					`${user?.uid}/postVotes/${existingVote.id}`
				);
				//Removing their vote(ip=>neutral Or down =>neutral)
				if (existingVote.voteValue === vote) {
					//add/substract 1 to/from post.voteStatus
					updatedPost.voteStatus = voteStatus - vote;
					updatedPostVotes = updatedPostVotes.filter(
						(vote) => vote.id !== existingVote.id
					);
					//delete the postVote document
					batch.delete(postVoteRef);
					voteChange *= -1;
				}

				//FLipping their vote (up=>down and vice versa)
				else {
					//add/substract 2 to flip post.voteStatus
					voteChange = 2 * vote;
					updatedPost.voteStatus = voteStatus + 2 * vote;
					const voteIdx = postStateValue.postVotes.findIndex(
						(vote) => vote.id === existingVote.id
					);

					if (voteIdx !== -1) {
						updatedPostVotes[voteIdx] = {
							...existingVote,
							voteValue: vote,
						};
					}
					//updating  the existing document in postVote document
					batch.update(postVoteRef, {
						voteValue: vote,
					});
				}
			}

			//update our post documment
			const postRef = doc(firestore, "posts", post.id!);
			batch.update(postRef, { voteStatus: voteStatus + voteChange });
			await batch.commit();

			if (postStateValue.selectedPost) {
				setPostStateValue((prev) => ({
					...prev,
					selectedPost: updatedPost,
				}));
			}

			//   update state with updated values
			const postIdx = postStateValue.posts.findIndex(
				(item) => item.id === post.id
			);

			updatedPosts[postIdx] = updatedPost;
			setPostStateValue((prev) => ({
				...prev,
				posts: updatedPosts,
				postVotes: updatedPostVotes,
			}));
		} catch (error) {
			console.log("onnVote error", error);
		}
	};
	const onSelectPost = (post: Post) => {
		setPostStateValue((prev) => ({
			...prev,
			selectedPost: post,
		}));
		router.push(`/r/${post.communityId}/comments/${post.id}`);
	};

	const onDeletePost = async (post: Post): Promise<boolean> => {
		try {
			// CHeck if there is an image
			// if exists delete from Storage
			if (post.imageURL) {
				const imageRef = ref(storage, `posts/${post.id}/image`);
				await deleteObject(imageRef);
			}

			// Delete the post document from 'posts' collection
			const postDocRef = doc(firestore, "posts", post.id!);
			await deleteDoc(postDocRef);

			// Update Recoil
			setPostStateValue((prev) => ({
				...prev,
				posts: prev.posts.filter((item) => item.id !== post.id),
			}));

			return true;
		} catch (error) {
			return false;
		}
	};

	const getCommunityPostVotes = async (communityId: string) => {
		try {
			const postVotesQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where("communityId", "==", communityId)
			);
			const postVotesDocs = await getDocs(postVotesQuery);
			const postVotes = postVotesDocs.docs.map((postVote) => ({
				id: postVote.id,
				...postVote.data(),
			}));

			setPostStateValue((prev) => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}));
			//   console.log("postVotes on first render", postStateValue.postVotes);
		} catch (error) {}
	};

	useEffect(() => {
		if (!user || !currentCommunity?.id) return;
		getCommunityPostVotes(currentCommunity?.id);
	}, [user, currentCommunity]);

	useEffect(() => {
		if (!user) {
			//clear user post votes if there is no user
			setPostStateValue((prev) => ({
				...prev,
				postVotes: [],
			}));
		}
	}, [user]);

	return {
		postStateValue,
		setPostStateValue,
		onDeletePost,
		onSelectPost,
		onVotePost,
	};
};
export default usePosts;
