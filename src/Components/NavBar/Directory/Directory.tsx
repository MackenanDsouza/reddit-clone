import { ChevronDownIcon } from "@chakra-ui/icons";
import { TiHome } from "react-icons/ti";
import { AuthModalState } from "@/Atoms/authModalAtom";
import {
	Text,
	Flex,
	Icon,
	Menu,
	MenuButton,
	MenuList,
	Image,
} from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import Communities from "./Communities";
import useDirectory from "@/Hooks/useDirectory";

const UserMenu: React.FC = () => {
	const setAuthModalState = useSetRecoilState(AuthModalState);
	const { directoryState, toggleMenuOpen } = useDirectory();
	console.log(directoryState);
	return (
		<Menu isOpen={directoryState.isOpen}>
			<MenuButton
				mr={2}
				ml={{ base: 0, md: 2 }}
				cursor={"pointer"}
				padding={"0px 6px"}
				borderRadius={4}
				_hover={{ outline: "1px solid", outlineColor: "gray.200" }}
				onClick={toggleMenuOpen}
			>
				<Flex
					align={"center"}
					justify={"space-between"}
					width={{ base: "auto", lg: "200px" }}
				>
					<Flex align={"center"}>
						{directoryState.selectedMenuItem.imageURl ? (
							<>
								<Image
									borderRadius={"full"}
									boxSize={"24px"}
									mr={2}
									src={directoryState.selectedMenuItem.imageURl}
									alt=""
								/>
							</>
						) : (
							<Icon
								as={directoryState.selectedMenuItem.icon}
								color={directoryState.selectedMenuItem.iconColor}
								fontSize={24}
								mr={{ base: 1, md: 2 }}
							/>
						)}
						<Flex display={{ base: "none", lg: "flex" }}>
							<Text fontWeight={600} fontSize={"10pt"}>
								{directoryState.selectedMenuItem.displayText}
							</Text>
						</Flex>
					</Flex>
					<ChevronDownIcon />
				</Flex>
			</MenuButton>
			<MenuList>
				<Communities />
			</MenuList>
		</Menu>
	);
};
export default UserMenu;
