import Link from "next/link";
import { ToggleTheme } from "@/components/ToggleTheme";

export default function Header() {
	return (
        <header className="navbar">
            <div className="container">
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                
                    <li>
                        <Link href="/notes">Notes</Link>
                    </li>
                
                    <li>
                        <Link href="/projects">Projects</Link>
                    </li>
                
                    <li>
                        <Link href="/contacts">Contacts</Link>
                    </li>
                </ul>
                
                <ToggleTheme />
            </div>
        </header>
    );
}