import useDirectory from "@/Hooks/useDirectory";
import { Flex, MenuItem, Image, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

type MenuListItemProps = {
	displayText: string;
	link: string;
	icon: IconType;
	iconColor: string;
	imageURl?: string;
};

const MenuListItem: React.FC<MenuListItemProps> = ({
	displayText,
	link,
	icon,
	iconColor,
	imageURl,
}) => {
	const { onSelectMenuItem } = useDirectory();
	return (
		<MenuItem
			width={"100%"}
			fontSize={"10pt"}
			_hover={{ bg: "gray.100" }}
			onClick={() =>
				onSelectMenuItem({ displayText, link, icon, iconColor, imageURl })
			}
		>
			<Flex align={"center"}>
				{imageURl ? (
					<Image
						src={imageURl}
						alt=""
						borderRadius={"full"}
						boxSize={"18px"}
						mr={2}
					/>
				) : (
					<Icon as={icon} fontSize={20} mr={2} color={iconColor} />
				)}
				{displayText}
			</Flex>
		</MenuItem>
	);
};
export default MenuListItem;
