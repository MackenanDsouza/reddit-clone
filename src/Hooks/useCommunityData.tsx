import { AuthModalState } from "@/Atoms/authModalAtom";
import {
	Community,
	CommunitySnippet,
	CommunityState,
} from "@/Atoms/communitiesAtom";
import { auth, firestore } from "@/Firebase/clientApp";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
	const [user, loadingUser] = useAuthState(auth);
	const setAuthModalState = useSetRecoilState(AuthModalState);
	const [error, setError] = useState("");
	const [communityStateValue, setCommunityStateValue] =
		useRecoilState(CommunityState);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const onJoinOrLeaveCommunity = (
		communityData: Community,
		isJoined: boolean
	) => {
		//is the user signed in?
		//if not=> open auth modal

		if (!user) {
			setAuthModalState({
				open: true,
				view: "login",
			});
			return;
		}
		setLoading(true);
		if (isJoined) {
			leaveCommunity(communityData.id);
			return;
		}

		joinCommunity(communityData);
	};

	const getMySnippets = async () => {
		setLoading(true);
		try {
			//get user snippets
			const snippetDocs = await getDocs(
				collection(firestore, `users/${user?.uid}/communitySnippets`)
			);

			const snippets = snippetDocs.docs.map((doc) => ({
				...doc.data(),
			}));

			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: snippets as CommunitySnippet[],
				snippetsFetched: true,
			}));
		} catch (error: any) {
			console.log("getMySnippets error", error);
		}
		setLoading(false);
	};

	const joinCommunity = async (communityData: Community) => {
		//batch write
		//creating new community snippet
		try {
			setLoading(true);
			const batch = writeBatch(firestore);

			const newSnippet: CommunitySnippet = {
				communityId: communityData.id,
				imageURL: communityData.imageURL || "",
				isModerator: user?.uid === communityData.creatorId,
			};

			batch.set(
				doc(
					firestore,
					`users/${user?.uid}/communitySnippets`,
					communityData.id
				),
				newSnippet
			);

			//updating the numbers of member of the community
			batch.update(doc(firestore, "communities", communityData.id), {
				numberofMembers: increment(1),
			});

			await batch.commit();
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: [...prev.mySnippets, newSnippet],
			}));
		} catch (error: any) {
			console.log("joinCommunityError", error);
			setError(error.message);
		}

		setLoading(false);
		//update recoil state-communnity.mySnippets
	};
	const leaveCommunity = async (communityId: string) => {
		try {
			//Batch write
			const batch = writeBatch(firestore);

			//deleting the community snippet from user
			batch.delete(
				doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
			);

			//updating no of member in the community

			batch.update(doc(firestore, "communities", communityId), {
				numberofMembers: increment(-1),
			});
			await batch.commit();

			//update recoil state -communityState.mySnippets
			// setCommunityStateValue((prev) => ({
			// 	...prev,
			// 	mySnippets: prev.mySnippets.filter((item) => {
			// 		item.communityId !== communityId;
			// 	}),
			// }));
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: prev.mySnippets.filter(
					(item) => item.communityId !== communityId
				),
			}));
		} catch (error: any) {
			console.log("LeaveCommunity Error", error);
			setError(error.message);
		}
		setLoading(false);
	};

	const getCommunityData = async (communityId: string) => {
		try {
			const communityDocRef = doc(firestore, "communities", communityId);
			const communityDoc = await getDoc(communityDocRef);
			setCommunityStateValue((prev) => ({
				...prev,
				currentCommunity: {
					id: communityDoc.id,
					...communityDoc.data(),
				} as Community,
			}));
		} catch (error) {
			console.log("getCommunityData Error", error);
		}
	};
	useEffect(() => {
		if (!user) {
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: [],
				snippetsFetched: false,
			}));
			return;
		}
		if (user && !loadingUser) getMySnippets();

		// console.log(communityStateValue);
	}, [user]);

	useEffect(() => {
		const { communityId } = router.query;
		if (communityId && !communityStateValue.currentCommunity) {
			getCommunityData(communityId as string);
		}
	}, [router.query, communityStateValue.currentCommunity]);

	return {
		//data and functions
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	};
};
export default useCommunityData;
