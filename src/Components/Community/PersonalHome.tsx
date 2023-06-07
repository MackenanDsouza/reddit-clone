import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";

type PersonalHomeProps = {};

const PersonalHome: React.FC<PersonalHomeProps> = () => {
	return (
		<Flex
			direction="column"
			cursor={"pointer"}
			border={"1px solid"}
			borderColor={"gray.300"}
			borderRadius={4}
			bg={"white"}
			position={"sticky"}
		>
			<Flex
				align={"flex-end"}
				color={"white"}
				height={"34px"}
				p="6px 10px"
				bg={"blue.500"}
				borderRadius={"4px 4px 0px 0px"}
				bgImage={"url(/images/redditPersonalHome.png)"}
				backgroundSize={"cover"}
			></Flex>
			<Flex direction={"column"} p={"12px"}>
				<Flex align={"center"} mb={2}>
					<Icon as={FaReddit} fontSize={30} mr={2} color={"brand.100"}></Icon>
					<Text fontWeight={600}>Home</Text>
				</Flex>
				<Stack spacing={3}>
					<Text fontSize={"9pt"}>
						Your personal Reddit frontpage, built for you.
					</Text>
					<Button height={"30px"}>Create Post</Button>
					<Button variant={"outline"} height={"30px"}>
						Create Comunitiy
					</Button>
				</Stack>
			</Flex>
		</Flex>
	);
};
export default PersonalHome;
