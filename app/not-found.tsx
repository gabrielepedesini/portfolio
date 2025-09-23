import { getLang } from "@/utils/getLang";
import Link from "next/link";

export default async function NotFound() {
    const { lang, dict } = await getLang();

    const data = dict.errors.notfound;

    return (
        <section className="error-page">
            <div className="container">
                <h1>404</h1>
                <p>{data.desc}</p>
                <Link href="/">{data.home}</Link>
            </div>
        </section>
    );
}