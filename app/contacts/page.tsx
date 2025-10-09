import type { Metadata } from "next";
import { getLang } from "@/utils/getLang";
import { LuGithub, LuLinkedin, LuMail  } from "react-icons/lu";
import { PiTelegramLogoBold } from "react-icons/pi";

export const metadata: Metadata = {
    title: "Contacts | Gabriele Pedesini",
    description: "Get in touch with me through various platforms",
};

export default async function Home() {
    const { lang, dict } = await getLang();

    return (
        <section className="intro">
            <div className="container">
                <h1>{dict.contacts.title}</h1>
                <p>{dict.contacts.desc}</p>
                
                <div className="contact-socials">
                    <a href={dict.socials.linkedin.link} target="_blank" rel="noopener noreferrer">
                        <LuLinkedin />
                        {dict.socials.linkedin.name}
                    </a>
                    <a href={dict.socials.github.link} target="_blank" rel="noopener noreferrer">
                        <LuGithub />
                        {dict.socials.github.name}
                    </a>
                    <a href={dict.socials.telegram.link} target="_blank" rel="noopener noreferrer">
                        <PiTelegramLogoBold />
                        {dict.socials.telegram.name}
                    </a>
                    <a href={dict.socials.email.link} target="_blank" rel="noopener noreferrer">
                        <LuMail />
                        {dict.socials.email.name}
                    </a>
                </div>
            </div>
        </section>
    );
}