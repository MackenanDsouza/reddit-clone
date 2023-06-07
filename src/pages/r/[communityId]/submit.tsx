import { CommunityState } from "@/Atoms/communitiesAtom";
import About from "@/Components/Community/About";
import PageContent from "@/Components/Layout/PageContent";
import NewPostForm from "@/Components/Posts/NewPostForm";
import { auth } from "@/Firebase/clientApp";
import useCommunityData from "@/Hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import { Console } from "console";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const SubmitPostPage: React.FC = () => {
	const [user] = useAuthState(auth);
	const { communityStateValue } = useCommunityData();
	// console.log("Community", communityStateValue);
	return (
		<PageContent>
			<>
				<Box p="14px 8px" borderBottom={"1px solid"} borderColor={"white"}>
					<Text>Create a post</Text>
				</Box>
				{user && (
					<NewPostForm
						user={user}
						communityImageURL={communityStateValue.currentCommunity?.imageURL}
					/>
				)}
			</>

			<>
				{communityStateValue.currentCommunity && (
					<About communityData={communityStateValue.currentCommunity} />
				)}
			</>
		</PageContent>
	);
};
export default SubmitPostPage;
