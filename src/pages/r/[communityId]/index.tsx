import { Community, CommunityState } from "@/Atoms/communitiesAtom";
import { firestore } from "@/Firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import safeJsonStringify from "safe-json-stringify";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import CommunityNotFound from "@/Components/Community/NotFound";
import Header from "@/Components/Community/Header";
import PageContent from "@/Components/Layout/PageContent";
import CreatePostLink from "@/Components/Community/CreatePostLink";
import Posts from "@/Components/Posts/Posts";
import { useSetRecoilState } from "recoil";
import About from "@/Components/Community/About";

type CommunityPageProps = {
	communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	const setCommunityStateValue = useSetRecoilState(CommunityState);

	useEffect(() => {
		setCommunityStateValue((prev) => ({
			...prev,
			currentCommunity: communityData,
		}));
	}, [communityData]);

	if (!communityData) {
		return <CommunityNotFound />;
	}

	return (
		<>
			<Header communityData={communityData} />
			<PageContent>
				<>
					<CreatePostLink />
					<Posts communityData={communityData} />
				</>
				<>
					<About communityData={communityData} />
				</>
			</PageContent>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	//get community data and pass to client

	try {
		const communityDocRef = doc(
			firestore,
			"communities",
			context.query.communityId as string
		);
		const communityDoc = await getDoc(communityDocRef);

		return {
			props: {
				communityData: communityDoc.exists()
					? JSON.parse(
							safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
					  )
					: "",
			},
		};
	} catch (error) {
		//Could add error page
		console.log("getServerSideProps error", error);
	}
}
export default CommunityPage;
