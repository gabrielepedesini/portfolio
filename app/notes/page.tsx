import type { Metadata } from "next";
import { getLang } from "@/utils/getLang";
import NotesContent from "@/components/NotesContent";

export const metadata: Metadata = {
	title: "Notes | Gabriele Pedesini",
	description: "Explore the notes and resources I have compiled",
};

export default async function Notes() {
    const { lang, dict } = await getLang();

    return <NotesContent dict={dict} />;
}