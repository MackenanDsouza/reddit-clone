import { Center, Flex, Image } from "@chakra-ui/react";
import React from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/clientApp";
import Directory from "./Directory/Directory";
import useDirectory from "@/Hooks/useDirectory";
import { defaultMenuItem } from "@/Atoms/directoryMenuAtom";

const Navbar: React.FC = () => {
	const [user, loading, error] = useAuthState(auth);
	const { onSelectMenuItem } = useDirectory();
	return (
		<>
			<Flex
				bg="white"
				height="44px"
				padding="6px 12px"
				align={"center"}
				justify={{ md: "space-between" }}
			>
				<Flex
					align={"center"}
					width={{ base: "40px", md: "auto" }}
					mr={{ base: 0, md: 2 }}
					cursor={"pointer"}
					onClick={() => onSelectMenuItem(defaultMenuItem)}
				>
					<Image src="/images/redditFace.svg" height="30px" alt="magic" />
					<Image
						src="/images/redditText.svg"
						height="44px"
						alt="magic"
						display={{ base: "none", md: "unset" }}
					/>
				</Flex>
				{user && <Directory />}

				<SearchInput user={user} />
				<RightContent user={user} />
			</Flex>
		</>
	);
};
export default Navbar;
