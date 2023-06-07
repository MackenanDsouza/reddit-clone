import { Post } from "@/Atoms/postAtom";
import {
	Flex,
	Icon,
	Stack,
	Text,
	Image,
	Skeleton,
	Spinner,
	AlertIcon,
	Alert,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { BsChat, BsDot } from "react-icons/bs";
import {
	IoArrowDownCircleOutline,
	IoArrowDownCircleSharp,
	IoArrowRedoOutline,
	IoArrowUpCircleOutline,
	IoArrowUpCircleSharp,
	IoBookmarkOutline,
} from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/router";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";
type PostItemProps = {
	post: Post;
	UserIsCreator: boolean;
	userVoteValue?: number;
	onVotePost: (
		event: React.MouseEvent<SVGElement, MouseEvent>,
		post: Post,
		vote: number,
		communityId: string
	) => void;
	onDeletePost: (post: Post) => Promise<boolean>;
	onSelectPost?: (post: Post) => void;
	HomePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
	post,
	UserIsCreator,
	userVoteValue,
	onDeletePost,
	onSelectPost,
	onVotePost,
	HomePage,
}) => {
	const [loadingImage, setLoadingImage] = useState(true);
	const [error, setError] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const singlePostPage = !onSelectPost;
	const router = useRouter();
	const handleDelete = async (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.stopPropagation();
		setLoadingDelete(true);
		try {
			const success = await onDeletePost(post);
			if (!success) {
				throw new Error("Failed to delete post");
			}
			//   console.log("Post was deleted");
			if (singlePostPage) router.push(`/r/${post.communityId}`);
		} catch (error: any) {
			console.log("Handle delete  Error", error);
			setError(error.message);
		}
		setLoadingDelete(false);
	};
	//   console.log(userVoteValue);
	return (
		<Flex
			border="1px solid"
			borderColor={singlePostPage ? "white" : "gray.300"}
			borderRadius={singlePostPage ? "4px 4px 0px 0px" : 4}
			bg="white"
			_hover={{
				borderColor: singlePostPage ? "none" : "gray.500",
			}}
			cursor={singlePostPage ? "unset" : "cursor"}
			onClick={() => onSelectPost && onSelectPost(post)}
		>
			<Flex
				direction={"column"}
				align={"center"}
				bg={singlePostPage ? "none" : "gray.100"}
				p={2}
				width={"40px"}
				borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
			>
				<Icon
					as={
						userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
					}
					color={userVoteValue == 1 ? "brand.100" : "gray.400"}
					fontSize={22}
					onClick={(event) => onVotePost(event, post, 1, post.communityId)}
				/>
				<Text fontSize={"9pt"}>{post.voteStatus}</Text>

				<Icon
					as={
						userVoteValue === -1
							? IoArrowDownCircleSharp
							: IoArrowDownCircleOutline
					}
					color={userVoteValue == -1 ? "#4379ff" : "gray.400"}
					fontSize={22}
					onClick={(event) => onVotePost(event, post, -1, post.communityId)}
				/>
			</Flex>
			<Flex direction={"column"} width={"100%"}>
				{error && (
					<Alert status="error">
						<AlertIcon />

						<Text mr={2}>{error}</Text>
					</Alert>
				)}
				<Stack spacing={1} p={"10px"}>
					<Stack
						direction={"row"}
						spacing={0.6}
						align={"center"}
						fontSize={"9pt"}
					>
						{/* home page check */}
						{HomePage && (
							<>
								{post.communitiesImageURL ? (
									<Image
										alt=""
										src={post.communitiesImageURL}
										borderRadius={"full"}
										boxSize={"18px"}
										mr={1}
									/>
								) : (
									<Icon
										as={FaReddit}
										fontSize={"18pt"}
										mr={1}
										color={"blue.500"}
									/>
								)}
								<Link href={`r/${post.communityId}`}>
									<Text
										fontWeight={700}
										_hover={{ textDecoration: "underline" }}
										onClick={(event) => event.stopPropagation()}
									>{`r/${post.communityId}`}</Text>
								</Link>
								<Icon as={BsDot} color={"gray"} fontSize={8} />
							</>
						)}
						<Text>
							Posted by u/{post.creatorDisplayName}{" "}
							{moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
						</Text>
					</Stack>
					<Text fontSize={"12pt"} fontWeight={600}>
						{post.title}
					</Text>
					<Text fontSize={"10pt"}>{post.body}</Text>
					{post.imageURL && (
						<Flex justify={"center"} align={"center"} p={2}>
							{loadingImage && (
								<Skeleton height={"200px"} width={"100%"} borderRadius={4} />
							)}
							<Image
								src={post.imageURL}
								alt=""
								maxHeight="460px"
								display={loadingImage ? "none" : "unset"}
								onLoad={() => setLoadingImage(false)}
							/>
						</Flex>
					)}
				</Stack>
				<Flex ml={1} mb={0.5} color={"gray.500"}>
					<Flex
						align={"center"}
						padding={"8px 10px"}
						borderRadius={4}
						_hover={{
							bg: "gray.200",
						}}
						cursor={"pointer"}
					>
						<Icon as={BsChat} mr={2} />
						<Text fontSize={"9pt"}>{post.numberOfComments}</Text>
					</Flex>

					<Flex
						align={"center"}
						padding={"8px 10px"}
						borderRadius={4}
						_hover={{
							bg: "gray.200",
						}}
						cursor={"pointer"}
					>
						<Icon as={IoArrowRedoOutline} mr={2} />
						<Text fontSize={"9pt"}>Share</Text>
					</Flex>

					<Flex
						align={"center"}
						padding={"8px 10px"}
						borderRadius={4}
						_hover={{
							bg: "gray.200",
						}}
						cursor={"pointer"}
					>
						<Icon as={IoBookmarkOutline} mr={2} />
						<Text fontSize={"9pt"}>Save</Text>
					</Flex>
					{UserIsCreator && (
						<Flex
							align={"center"}
							padding={"8px 10px"}
							borderRadius={4}
							_hover={{
								bg: "gray.200",
							}}
							cursor={"pointer"}
							onClick={(event) => {
								handleDelete(event);
							}}
						>
							{loadingDelete ? (
								<>
									<Spinner size="sm" />
								</>
							) : (
								<>
									<Icon as={AiOutlineDelete} mr={2} />
									<Text fontSize={"9pt"}>Delete</Text>
								</>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
export default PostItem;
