import { getLang } from "@/utils/getLang";
import { LuGithub, LuLinkedin, LuMail  } from "react-icons/lu";
import { PiTelegramLogoBold } from "react-icons/pi";

export default async function Footer() {
	const currentYear = new Date().getFullYear();

	const { dict } = await getLang(); 

	return (
		<footer className="footer" style={{ display: "block" }}>
			<div className="container">
				<div className="copyright">
					© <span className="year">{currentYear}</span> Gabriele Pedesini
				</div>

				<div className="socials">
					<a href={dict.socials.linkedin.link} target="_blank" rel="noopener noreferrer">
						<LuLinkedin />
					</a>
					<a href={dict.socials.github.link} target="_blank" rel="noopener noreferrer">
						<LuGithub />
					</a>
					<a href={dict.socials.telegram.link} target="_blank" rel="noopener noreferrer">
						<PiTelegramLogoBold />
					</a>
					<a href={dict.socials.email.link} target="_blank" rel="noopener noreferrer">
						<LuMail />
					</a>
				</div>
			</div>
		</footer>
	);
}