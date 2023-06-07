import { Post } from "@/Atoms/postAtom";
import { firestore, storage } from "@/Firebase/clientApp";
import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
	Timestamp,
	addDoc,
	collection,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import ImageUpload from "./PostForm/ImageUpload";
import TextInputs from "./PostForm/TextInputs";
import Tabitem from "./Tabitem";
import useSelectFile from "@/Hooks/useSelectFile";
type NewPostFormProps = {
	user: User;
	communityImageURL?: string;
};

const formTabs: tabitem[] = [
	{
		title: "Post",
		icon: IoDocumentText,
	},
	{
		title: "Images & Video",
		icon: IoImageOutline,
	},
	{
		title: "Link",
		icon: BsLink45Deg,
	},
	{
		title: "Poll",
		icon: BiPoll,
	},
	{
		title: "Talk",
		icon: BsMic,
	},
];

export type tabitem = {
	title: string;
	icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
	user,
	communityImageURL,
}) => {
	const router = useRouter();

	const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
	const [textInputs, setTextInputs] = useState({
		title: "",
		body: "",
	});

	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const handleCreatePosts = async () => {
		const { communityId } = router.query;
		//Create new post object=>type post
		// const newPost:Post={

		// }

		setLoading(true);
		// store the post in db
		try {
			const postDocRef = await addDoc(collection(firestore, "posts"), {
				communityId: communityId as string,
				communitiesImageURL: communityImageURL || "",
				creatorId: user.uid,
				creatorDisplayName: user.email!.split("@")[0],
				title: textInputs.title,
				body: textInputs.body,
				numberOfComments: 0,
				voteStatus: 0,
				createdAt: serverTimestamp() as Timestamp,
			});

			// CHeck for selectedFile
			if (selectedFile) {
				//Store inStorage=>getDownLoadURl (return imageURL)
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
				await uploadString(imageRef, selectedFile, "data_url");

				const downloadURL = await getDownloadURL(imageRef);

				// update post doc by adding imageURl
				await updateDoc(postDocRef, {
					imageURL: downloadURL,
				});
			}
			//redirect user back to the communityPage using the router
			router.back();
		} catch (error) {
			console.log("HandleCreate Post error", error);
			setError(true);
		}

		setLoading(false);
	};

	const onTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {
			target: { name, value },
		} = event;
		setTextInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Flex direction={"column"} bg="white" borderRadius={4} mt={4}>
			<Flex width="100%">
				{formTabs.map((item) => (
					<Tabitem
						key={item.title}
						item={item}
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === "Post" && (
					<TextInputs
						textInputs={textInputs}
						handleCreatePosts={handleCreatePosts}
						onChange={onTextChange}
						loading={loading}
					/>
				)}
				{selectedTab === "Images & Video" && (
					<ImageUpload
						selectedFile={selectedFile}
						onSelectImage={onSelectFile}
						setSelectedFile={setSelectedFile}
						setSelectedTab={setSelectedTab}
					/>
				)}
			</Flex>
			{error && (
				<Alert status="error">
					<AlertIcon />
					<Text mr={2}>Error Creating Post</Text>
				</Alert>
			)}
		</Flex>
	);
};
export default NewPostForm;
