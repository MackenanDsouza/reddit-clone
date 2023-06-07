import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { BsDot, BsReddit } from "react-icons/bs";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { AuthModalState } from "@/Atoms/authModalAtom";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/clientApp";

const ResetPassword: React.FC = () => {
	const [email, setEmail] = useState("");
	const setAuthModalState = useSetRecoilState(AuthModalState);
	const [success, setSuccess] = useState(false);
	const [sendPasswordResetEmail, sending, error] =
		useSendPasswordResetEmail(auth);
	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		await sendPasswordResetEmail(email);
		setSuccess(true);
	};

	return (
		<Flex direction="column" alignItems={"center"} width="100%">
			<Icon as={BsReddit} color="brand.100" fontSize={40} mb={2}></Icon>
			<Text fontWeight={700} mb={2}>
				Reset your password{" "}
			</Text>
			{success ? (
				<Text mb={4}>Check your email :{")"}</Text>
			) : (
				<>
					<Text mb={2} fontSize="sm" textAlign={"center"}>
						Enter the email associated with your account and we`ll send you a
						reset link
					</Text>

					<form onSubmit={onSubmit} style={{ width: "100%" }}>
						<Input
							name="email"
							placeholder="Email"
							type="email"
							mb={2}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							fontSize="10pt"
							_placeholder={{ color: "gray.500" }}
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
							required
						/>
						<Text textAlign={"center"} color={"red"} fontSize={"10pt"}>
							{error?.message}
						</Text>
						<Button
							width="100%"
							height="36px"
							mb={2}
							mt={2}
							type="submit"
							isLoading={sending}
						>
							Reset Password
						</Button>
					</form>
				</>
			)}

			<Flex
				alignItems="center"
				fontSize="9pt"
				color="blue.500"
				fontWeight={700}
				cursor="pointer"
			>
				<Text
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							view: "login",
						}))
					}
				>
					LOGIN
				</Text>
				<Icon as={BsDot} />
				<Text
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							view: "signup",
						}))
					}
				>
					SIGN UP
				</Text>
			</Flex>
		</Flex>
	);
};
export default ResetPassword;
