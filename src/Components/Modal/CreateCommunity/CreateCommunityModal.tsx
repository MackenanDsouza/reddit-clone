import {
	Text,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Divider,
	Input,
	Stack,
	Checkbox,
	Flex,
	Icon,
} from "@chakra-ui/react";

import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import React, { useState } from "react";
import {
	doc,
	getDoc,
	runTransaction,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { auth, firestore } from "@/Firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { CommunitySnippet, CommunityState } from "@/Atoms/communitiesAtom";
import { useRouter } from "next/router";
import useDirectory from "@/Hooks/useDirectory";

type CreateCommunityModalProps = {
	open: boolean;
	handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
	open,
	handleClose,
}) => {
	const [user] = useAuthState(auth);
	const [communityName, setCommunityName] = useState("");
	const [charRemaining, setCharRemaining] = useState(21);
	const [communityType, setCommunityType] = useState("public");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const setCommunityStateValue = useSetRecoilState(CommunityState);
	const router = useRouter();
	const { toggleMenuOpen } = useDirectory();
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length > 21) return;
		setCommunityName(event.target.value);
		//recalculate char remaining
		setCharRemaining(21 - event.target.value.length);
	};

	const onCommunityTypeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setCommunityType(event.target.name);
	};

	const handleCreateCommunity = async () => {
		if (error) setError("");
		// Validate Community
		const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (format.test(communityName) || communityName.length < 3) {
			setError(
				"Community names must be written between 3-21 vharracters, anf only contian letters,numbers, or underscores"
			);
			return;
		}
		setLoading(true);
		//Create the Community Document in the firestore
		//Check that name is not taken
		//if valid name,create community

		try {
			const communityDocRef = doc(firestore, "communities", communityName);

			await runTransaction(firestore, async (transaction) => {
				//Check if exists in the db
				const communityDoc = await transaction.get(communityDocRef);
				if (communityDoc.exists()) {
					throw new Error(
						`Sorry, r/${communityName} is already taken.Try another.`
					);
				}

				//Create community
				transaction.set(communityDocRef, {
					creatorId: user?.uid,
					createdAt: serverTimestamp(),
					numberofMembers: 1,
					privacyType: communityType,
				});

				//create Community snippet on user

				transaction.set(
					doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
					{
						communityId: communityName,
						isModerator: true,
					}
				);
				const newCommunitySnippet: CommunitySnippet = {
					communityId: communityName,
					isModerator: true,
				};

				// setCommunityStateValue((prev) => ({
				// 	...prev,
				// 	mySnippets: [
				// 		...prev.mySnippets,
				// 		newCommunitySnippet,
				// 	] as CommunitySnippet[],
				// }));
			});
			handleClose();
			toggleMenuOpen();
			router.push(`/r/${communityName}`);
		} catch (error: any) {
			console.log("handleCreateCommunity error", error);
			setError(error.message);
		}

		setLoading(false);
	};

	return (
		<>
			<Modal isOpen={open} onClose={handleClose} size={"lg"}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display={"flex"}
						flexDirection="column"
						fontSize={15}
						padding={3}
					>
						Create a community
					</ModalHeader>
					<Box pl={3} pr={3}>
						<Divider />
						<ModalCloseButton />
						<ModalBody
							display="flex"
							flexDirection={"column"}
							padding={"10px 0px"}
						>
							<Text fontWeight={600} fontSize={15}>
								Name
							</Text>
							<Text fontSize={11} color={"gray.500"}>
								Community names including capitalization cannot be changed
							</Text>

							<Text
								position="relative"
								top={"28px"}
								left="10px"
								width={"20px"}
								color="gray.400"
							>
								r/
							</Text>
							<Input
								position={"relative"}
								type="text"
								value={communityName}
								size={"sm"}
								pl={"22px"}
								onChange={handleChange}
							/>
							<Text
								fontSize="9pt"
								color={charRemaining === 0 ? "red" : "gray.500"}
							>
								{charRemaining} Character remaining
							</Text>
							<Text fontSize="9pt" pt={1} color={"red"}>
								{error}
							</Text>
							<Box mt={4} mb={4}>
								<Text fontWeight={600} fontSize={15}>
									Community Type
								</Text>

								<Stack spacing={2}>
									<Checkbox
										name="public"
										isChecked={communityType === "public"}
										onChange={onCommunityTypeChange}
									>
										<Flex align={"center"}>
											<Icon as={BsFillPersonFill} color={"gray.500"} mr={2} />
											<Text fontSize="10pt" mr={1}>
												Public
											</Text>
											<Text fontSize="8pt" color={"gray.500"} pt={1}>
												Anyone can view,post and comment to this community
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										name="restricted"
										isChecked={communityType === "restricted"}
										onChange={onCommunityTypeChange}
									>
										<Flex align={"center"}>
											<Icon as={BsFillEyeFill} color={"gray.500"} mr={2} />
											<Text fontSize="10pt" mr={1}>
												Restricted
											</Text>
											<Text fontSize="8pt" color={"gray.500"} pt={1}>
												Anyone can view this community,but only approved users
												can post
											</Text>
										</Flex>
									</Checkbox>
									<Checkbox
										name="private"
										isChecked={communityType === "private"}
										onChange={onCommunityTypeChange}
									>
										<Flex align={"center"}>
											<Icon as={HiLockClosed} color={"gray.500"} mr={2} />
											<Text fontSize="10pt" mr={1}>
												Private
											</Text>
											<Text fontSize="8pt" color={"gray.500"} pt={1}>
												Only approved users can view and submit to this
												community
											</Text>
										</Flex>
									</Checkbox>
								</Stack>
							</Box>
						</ModalBody>
					</Box>

					<ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
						<Button
							variant={"outline"}
							height={"36px"}
							mr={3}
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button
							height={"36px"}
							isLoading={loading}
							onClick={handleCreateCommunity}
						>
							Create Community
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default CreateCommunityModal;
