import type { Metadata } from "next";
import { getLang } from "@/utils/getLang";
import ProjectsContent from "@/components/ProjectsContent";

export const metadata: Metadata = {
	title: "Projects | Gabriele Pedesini",
	description: "Explore the projects I have worked on",
};

export default async function Projects() {
	const { lang, dict } = await getLang();

	return <ProjectsContent dict={dict} />;
}