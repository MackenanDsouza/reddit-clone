import { AuthModalState } from "@/Atoms/authModalAtom";
import { auth } from "@/Firebase/clientApp";
import useDirectory from "@/Hooks/useDirectory";
import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";

const CreatePostLink: React.FC = () => {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const setAuthModalState = useSetRecoilState(AuthModalState);
	const { toggleMenuOpen } = useDirectory();

	const onClick = () => {
		if (!user) {
			setAuthModalState({
				open: true,
				view: "login",
			});
			return;
		}
		const { communityId } = router.query;
		if (communityId) {
			router.push(`/r/${communityId}/submit`);
			return;
		}
		// else open our directory
		toggleMenuOpen();
	};

	return (
		<>
			<Flex
				justify={"space-evenly"}
				align={"center"}
				bg={"white"}
				border={"1px solid"}
				borderColor={"gray.300"}
				borderRadius={4}
				height={"56px"}
				p={2}
				mb={4}
			>
				<Icon as={FaReddit} fontSize={36} color={"gray.300"} mr={4}></Icon>
				<Input
					placeholder="Create Post"
					fontSize={"10pt"}
					_placeholder={{
						color: "gray.500",
					}}
					_hover={{
						bg: "white",
						border: "1px solid",
						borderColor: "blue.500",
					}}
					_focus={{
						outline: "none",
						bg: "white",
						border: "1px solid",
						borderColor: "blue.500",
					}}
					bg="gray.50"
					borderColor={"gray.200"}
					borderRadius={4}
					mr={4}
					onClick={onClick}
				></Input>
				<Icon
					as={IoImageOutline}
					fontSize={24}
					color={"gray.400"}
					mr={4}
				></Icon>
				<Icon
					as={BsLink45Deg}
					fontSize={24}
					color={"gray.400"}
					cursor={"pointer"}
				></Icon>
			</Flex>
		</>
	);
};
export default CreatePostLink;
