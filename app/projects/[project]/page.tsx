import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLang } from "@/utils/getLang";
import Link from "next/link";
import Image from "next/image";


export async function generateMetadata({ params }: { params: { project: string } }): Promise<Metadata> {
    const { dict } = await getLang();

    const data = dict.projects.details.find((p: any) => p.id === params.project);

    return {
        title: data.title + " | Gabriele Pedesini",
    };
}

export default async function Project({ params }: { params: { project: string } }) {
    const { lang, dict } = await getLang();

    const data = dict.projects.details.find((p: any) => p.id === params.project);

    if (!data) {
        notFound();
    }

    return (
        <div className="render-project">
            <section className="project-title">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/projects">projects</Link>
                        <span className="opacity"> / {data.id}</span>
                    </div>
                    <h1>{data.title}</h1>
                    <div className="project-image">
                        {data.img && <Image src={`/img/projects/${data.id}.png`} alt={data.title} fill priority />}
                    </div>
                </div>
            </section>

            {data.desc && data.desc.length > 0 && (
            <section className="project-section">
                <div className="container">
                    <h3>Description</h3>
                    {data.desc.map((p: string, index: number) => (
                        <p key={index}>{p}</p>
                    ))}
                </div>
            </section>
            )}

            {data.goals && data.goals.length > 0 && (
            <section className="project-section">
                <div className="container">
                    <h3>Goals</h3>
                    {data.goals.map((p: string, index: number) => (
                        <p key={index}>{p}</p>
                    ))}
                </div>
            </section>
            )}

            {data.functions && data.functions.length > 0 && (
            <section className="project-section">
                <div className="container">
                    <h3>Functions</h3>
                    <ul>
                        {data.functions.map((li: string, index: number) => (
                            <li key={index}>{li}</li>
                        ))}
                    </ul>
                </div>
            </section>
            )}

            {data.technologies && data.technologies.length > 0 && (
            <section className="project-section">
                <div className="container">
                    <h3>Technologies</h3>
                    <ul>
                        {data.technologies.map((li: string, index: number) => (
                            <li key={index}>{li}</li>
                        ))}
                    </ul>
                </div>
            </section>
            )}

            {(data.link || data.github) && (
            <section className="project-link">
                <div className="container">
                    <h3>Link</h3>
                    {data.link && (
                        <p>
                            <span>Live preview:</span> <a target="_blank" href={data.link}>{data.link.replace(/^https?:\/\//, '')}</a>
                        </p>
                    )}
                    {data.github && (
                        <p>
                            <span>GitHub:</span> <a href={data.github}>repo</a>
                        </p>
                    )}
                </div>
            </section>
            )}
        </div>
    );
}
