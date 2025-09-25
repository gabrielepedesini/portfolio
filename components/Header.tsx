import Link from "next/link";
import { ToggleTheme } from "@/components/ToggleTheme";
import { getLang } from "@/utils/getLang";

export default async function Header() {
    const { dict } = await getLang(); 

	return (
        <header className="navbar">
            <div className="container">
                <ul>
                    <li>
                        <Link href="/">{dict.navbar.home}</Link>
                    </li>
                
                    <li>
                        <Link href="/notes">{dict.navbar.notes}</Link>
                    </li>
                
                    <li>
                        <Link href="/projects">{dict.navbar.projects}</Link>
                    </li>
                
                    <li>
                        <Link href="/contacts">{dict.navbar.contacts}</Link>
                    </li>
                </ul>
                
                <ToggleTheme />
            </div>
        </header>
    );
}