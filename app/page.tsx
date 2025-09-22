import { getLang } from "@/utils/getLang";
import Description from "@/components/Description";
import ContributionCalendar from "@/components/ContributionCalendar";

export default async function Home() {
	const { lang, dict } = await getLang();

	return (
		<>
			<section className="intro">
				<div className="container">
					<h1>{dict.index.intro.title}</h1>
					<Description paragraphs={dict.index.intro.desc} />
				</div>
			</section>

			<section className="resume">
				<div className="container">
					<p dangerouslySetInnerHTML={{ __html: dict.index.intro.resume }}></p>					
				</div>
			</section>

			<section className="formation">
				<div className="container">
					<h2>{dict.index.formation.title}</h2>
					<Description paragraphs={dict.index.formation.desc} />
				</div>
			</section>

			<section className="projects">
				<div className="container">
					<h2>{dict.index.projects.title}</h2>
					<Description paragraphs={dict.index.projects.desc} />
					<ul>
						{
							dict.projects.details
								.slice(0, 4)
								.map((project: any) => 
									(<li key={project.id}><a href={"/projects/" + project.id}>{project.title}</a> ‒ {project.shortdesc}</li>)
								)
						}
					</ul>
					<p style={{ marginTop: "15px" }} dangerouslySetInnerHTML={{ __html: dict.index.projects.all }}></p>
				</div>
			</section>

			<section className="contribution">
				<div className="container">
					<Description paragraphs={dict.index.contributions.desc} />
				</div>
			</section>

			<ContributionCalendar contributionNum={dict.index.contributions.number} viewAll={dict.index.contributions.graph} />
		</>
	);
}