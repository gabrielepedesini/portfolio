'use client';

import { useState, useMemo } from 'react';
import Description from "@/components/Description";

interface Project {
	id: string;
	title: string;
	shortdesc: string;
	date: string;
	year: string;
	category: string[];
	technologies: string[];
}

interface ProjectsContentProps {
	dict: {
		projects: {
			intro: {
				title: string;
				desc: string[];
			};
			filters: {
				title: string;
				category: string;
				technologies: string;
				year: string;
				results1: string;
				results2: string;
				results3: string;
				noresult: string;
			};
			details: Project[];
		};
	};
}

export default function ProjectsContent({ dict }: ProjectsContentProps) {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
	const [selectedYears, setSelectedYears] = useState<string[]>([]);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const projects: Project[] = dict.projects.details;

	const filteredProjects = useMemo(() => {
		return projects.filter(project => {
			const categoryMatch = selectedCategories.every(category => project.category.includes(category)) || selectedCategories.length === 0;
			const technologyMatch = selectedTechnologies.every(technology => project.technologies.includes(technology)) || selectedTechnologies.length === 0;
			const yearMatch = selectedYears.includes(project.year) || selectedYears.length === 0;
			return categoryMatch && technologyMatch && yearMatch;
		});
	}, [projects, selectedCategories, selectedTechnologies, selectedYears]);

	const categoryOptions = useMemo(() => {
		const categories = [...new Set(projects.flatMap(project => project.category))];
		return categories.map(category => ({ value: category, label: category }));
	}, [projects]);

	const technologyOptions = useMemo(() => {
		const technologies = [...new Set(projects.flatMap(project => project.technologies))];
		return technologies.map(technology => ({ value: technology, label: technology }));
	}, [projects]);

	const yearOptions = useMemo(() => {
		const years = [...new Set(projects.map(project => project.year))];
		return years.map(year => ({ value: year, label: year }));
	}, [projects]);

	const resultsText = useMemo(() => {
		if (filteredProjects.length === 0) {
			return dict.projects.filters.noresult;
		} else if (filteredProjects.length === 1) {
			return `${dict.projects.filters.results1} ${filteredProjects.length} ${dict.projects.filters.results3}`;
		} else {
			return `${dict.projects.filters.results1} ${filteredProjects.length} ${dict.projects.filters.results2}`;
		}
	}, [filteredProjects.length, dict]);

	return (
		<>
			<section className="intro">
				<div className="container">
					<h1>{dict.projects.intro.title}</h1>
					<Description paragraphs={dict.projects.intro.desc} />
				</div>
			</section>

			<section className="filter">
				<div className="container">
					<div className={`filter-wrapper ${filtersOpen ? 'active' : ''}`}>
					<div
						className="filter-header filter-title-btn"
						onClick={() => {
							const hasSelectedFilters = selectedCategories.length > 0 || selectedTechnologies.length > 0 || selectedYears.length > 0;
							if (!hasSelectedFilters) {
								setShowAlert(true);
							}
                            setFiltersOpen(!filtersOpen);
						}}
					>
							<span className="filter-title-wrapper">
								<h4 className="filter-title-btn">{dict.projects.filters.title}</h4>
								<h4 className="filter-counter filter-title-btn">
									{(selectedCategories.length + selectedTechnologies.length + selectedYears.length) > 0 ? `(${selectedCategories.length + selectedTechnologies.length + selectedYears.length})` : ''}
								</h4>
							</span>

							<span className="filter-arrow">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="filter-title-btn">
									<path d="M6 9L12 15L18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
								</svg>
							</span>
					</div>

						<div className="filter-category" id="category">
							<h4>{dict.projects.filters.category}</h4>
							{categoryOptions.map(option => (
								<label key={option.value}>
									<input
										type="checkbox"
										value={option.value}
										checked={selectedCategories.includes(option.value)}
										onChange={(e) => {
											const checked = e.target.checked;
											setSelectedCategories(prev =>
												checked
													? [...prev, option.value]
													: prev.filter(item => item !== option.value)
											);
										}}
									/>
									{option.label}
								</label>
							))}
						</div>

						<div className="filter-category" id="technologies">
							<h4>{dict.projects.filters.technologies}</h4>
							{technologyOptions.map(option => (
								<label key={option.value}>
									<input
										type="checkbox"
										value={option.value}
										checked={selectedTechnologies.includes(option.value)}
										onChange={(e) => {
											const checked = e.target.checked;
											setSelectedTechnologies(prev =>
												checked
													? [...prev, option.value]
													: prev.filter(item => item !== option.value)
											);
										}}
									/>
									{option.label}
								</label>
							))}
						</div>

						<div className="filter-category" id="year">
							<h4>{dict.projects.filters.year}</h4>
							{yearOptions.map(option => (
								<label key={option.value}>
									<input
										type="checkbox"
										value={option.value}
										checked={selectedYears.includes(option.value)}
										onChange={(e) => {
											const checked = e.target.checked;
											setSelectedYears(prev =>
												checked
													? [...prev, option.value]
													: prev.filter(item => item !== option.value)
											);
										}}
									/>
									{option.label}
								</label>
							))}
						</div>

						<div className="filter-btn">
							<a className="cancel-projects-btn" onClick={() => {
								setSelectedCategories([]);
								setSelectedTechnologies([]);
								setSelectedYears([]);
								setFiltersOpen(false);
							}}>Remove All</a>
						</div>
					</div>
				</div>
			</section>

			<div className="container">
				<section className="results-number">{resultsText}</section>
				<section className="results">
					<ul className="works">
						{filteredProjects.map((project, index) => (
							<li key={index}>
								<a href={`/projects/${project.id}`}>{project.title}</a> ‒ <span>{project.date}</span>
								<p className="opacity">{project.shortdesc}</p>
							</li>
						))}
					</ul>
				</section>
			</div>
		</>
	);
}