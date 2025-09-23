import type { Metadata } from "next";
import { getLang } from "@/utils/getLang";

export const metadata: Metadata = {
    title: "Contacts | Gabriele Pedesini",
    description: "Get in touch with me through various platforms",
};

export default async function Home() {
    const { lang, dict } = await getLang();

    function generateContactLinks(refs: { link: string; name: string }[]) {
        return refs.map((ref, i) => (
            <li key={i}>
                <a href={ref.link} target="_blank" rel="noopener noreferrer">
                    {ref.name}
                </a>
            </li>
        ));
    }

    return (
        <section className="intro">
            <div className="container">
                <h1>{dict.contacts.title}</h1>
                <p>{dict.contacts.desc}</p>
                <ul>
                    {generateContactLinks(dict.contacts.ref)}
                </ul>
            </div>
        </section>
    );
}