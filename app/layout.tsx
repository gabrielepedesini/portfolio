import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLang } from "@/utils/getLang";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Gabriele Pedesini | Software Engineer",
	description: "Gabriele Pedesini, an aspiring software engineer passionate about web and mobile development. Combining technical skills with a particular focus on design and user experience, I create effective digital solutions.",
	icons: {
		icon: "/favicon.png",
	},
};

export default async function RootLayout( {children}: Readonly<{children: React.ReactNode;}>) {
	const { lang, dict } = await getLang();

	return (
		<html lang={lang} suppressHydrationWarning>      
			<body className={`${geistSans.variable} ${geistMono.variable}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
				<ThemeProvider attribute="class" disableTransitionOnChange> 
					<Header />
					<main style={{ flex: "1" }}>{children}</main>
					<Footer />
            	</ThemeProvider>
			</body>
		</html>
	);
}