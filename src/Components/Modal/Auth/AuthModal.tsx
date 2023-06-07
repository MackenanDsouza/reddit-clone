import { AuthModalState } from "@/Atoms/authModalAtom";
import { useRecoilState } from "recoil";
import {
	useDisclosure,
	Button,
	Modal,
	Text,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Flex,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import AuthInputs from "./AuthInputs";
import OAuthButton from "./OAuthButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/clientApp";
import ResetPassword from "./ResetPassword";

const AuthModal: React.FC = () => {
	const [modalState, setModalState] = useRecoilState(AuthModalState);

	const [user, loading, error] = useAuthState(auth);
	const handleClose = () => {
		setModalState((prev) => ({
			...prev,
			open: false,
		}));
	};

	useEffect(() => {
		if (user) {
			handleClose();
		}
	}, [user]);

	return (
		<>
			<Modal isOpen={modalState.open} onClose={handleClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign={"center"}>
						{modalState.view === "login" && "Login"}
						{modalState.view === "signup" && "Sign Up"}
						{modalState.view === "resetPassword" && "Reset Password"}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDirection="column"
						pb={6}
						alignItems="center"
						justifyContent="center"
					>
						<Flex
							direction="column"
							align="center"
							justify="center"
							width="70%"
						>
							{modalState.view === "login" || modalState.view === "signup" ? (
								<>
									<OAuthButton />
									<Text color={"gray.400"} fontWeight={700}>
										OR
									</Text>
									<AuthInputs />
								</>
							) : (
								<ResetPassword />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
export default AuthModal;
