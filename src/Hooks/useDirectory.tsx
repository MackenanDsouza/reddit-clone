import { CommunityState } from "@/Atoms/communitiesAtom";
import {
	DirectoryMenuItem,
	directoryMenuState,
} from "@/Atoms/directoryMenuAtom";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";

const useDirectory = () => {
	const [directoryState, setDirectoryState] =
		useRecoilState(directoryMenuState);
	const communityStateValue = useRecoilValue(CommunityState);
	const router = useRouter();
	const toggleMenuOpen = () => {
		setDirectoryState((prev) => ({
			...prev,
			isOpen: !prev.isOpen,
		}));
	};
	const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
		setDirectoryState((prev) => ({
			...prev,
			selectedMenuItem: menuItem,
		}));
		router.push(menuItem.link);
		if (directoryState.isOpen) {
			toggleMenuOpen();
		}
	};
	useEffect(() => {
		const { currentCommunity } = communityStateValue;
		if (currentCommunity) {
			setDirectoryState((prev) => ({
				...prev,
				selectedMenuItem: {
					displayText: `r/${currentCommunity.id}`,
					link: `/r/${currentCommunity.id}`,
					imageURl: currentCommunity.imageURL,
					icon: FaReddit,
					iconColor: "blue.500",
				},
			}));
		}
	}, [communityStateValue.currentCommunity]);

	return { directoryState, toggleMenuOpen, onSelectMenuItem };
};
export default useDirectory;
