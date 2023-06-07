import React from "react";
import Navbar from "../NavBar/Navbar";

export default function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<main style={{ minHeight: "100vh" }}>{children}</main>
		</>
	);
}
