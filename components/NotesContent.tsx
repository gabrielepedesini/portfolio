'use client';

import { useState, useMemo } from 'react';
import Description from "@/components/Description";

interface Course {
	title: string;
	teacher: string;
	resources: { type: string; link: string }[];
	level: string;
	year: string;
	subject: string;
}

interface NotesContentProps {
	dict: {
		notes: {
			intro: {
				title: string;
				desc: string[];
			};
			filters: {
				title: string;
				level: string;
				year: string;
				subject: string;
				results1: string;
				results2: string;
				results3: string;
				noresult: string;
			};
			courses: Course[];
		};
	};
}

export default function NotesContent({ dict }: NotesContentProps) {
	const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
	const [selectedYears, setSelectedYears] = useState<string[]>([]);
	const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const courses: Course[] = dict.notes.courses;

	const filteredCourses = useMemo(() => {
		return courses.filter(course => {
			const levelMatch = selectedLevels.includes(course.level) || selectedLevels.length === 0;
			const yearMatch = selectedYears.includes(course.year) || selectedYears.length === 0;
			const subjectMatch = selectedSubjects.includes(course.subject) || selectedSubjects.length === 0;
			return levelMatch && yearMatch && subjectMatch;
		});
	}, [courses, selectedLevels, selectedYears, selectedSubjects]);

	const levelOptions = useMemo(() => {
		const levels = [...new Set(courses.map(course => course.level))];
		return levels.map(level => ({ value: level, label: level }));
	}, [courses]);

	const yearOptions = useMemo(() => {
		const years = [...new Set(courses.map(course => course.year))];
		return years.map(year => ({ value: year, label: year }));
	}, [courses]);

	const subjectOptions = useMemo(() => {
		const subjects = [...new Set(courses.map(course => course.subject))];
		return subjects.map(subject => ({ value: subject, label: subject }));
	}, [courses]);

	const resultsText = useMemo(() => {
		if (filteredCourses.length === 0) {
			return dict.notes.filters.noresult;
		} else if (filteredCourses.length === 1) {
			return `${dict.notes.filters.results1} ${filteredCourses.length} ${dict.notes.filters.results3}`;
		} else {
			return `${dict.notes.filters.results1} ${filteredCourses.length} ${dict.notes.filters.results2}`;
		}
	}, [filteredCourses.length, dict]);

	return (
		<>
			<section className="intro">
				<div className="container">
					<h1>{dict.notes.intro.title}</h1>
					<Description paragraphs={dict.notes.intro.desc} />
				</div>
			</section>

			<section className="filter">
				<div className="container">
					<div className={`filter-wrapper ${filtersOpen ? 'active' : ''}`}>
                    <div
						className="filter-header filter-title-btn"
						onClick={() => {
							const hasSelectedFilters = selectedLevels.length > 0 || selectedYears.length > 0 || selectedSubjects.length > 0;
							if (!hasSelectedFilters) {
								setShowAlert(true);
							}
                            setFiltersOpen(!filtersOpen);
						}}
					>
							<span className="filter-title-wrapper">
								<h4 className="filter-title-btn">{dict.notes.filters.title}</h4>
								<h4 className="filter-counter filter-title-btn">
									{(selectedLevels.length + selectedYears.length + selectedSubjects.length) > 0 ? `(${selectedLevels.length + selectedYears.length + selectedSubjects.length})` : ''}
								</h4>
							</span>

							<span className="filter-arrow">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="filter-title-btn">
									<path d="M6 9L12 15L18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
								</svg>
							</span>
					</div>

						<div className="filter-category" id="level">
							<h4>{dict.notes.filters.level}</h4>
							{levelOptions.map(option => (
								<label key={option.value}>
									<input
										type="checkbox"
										value={option.value}
										checked={selectedLevels.includes(option.value)}
										onChange={(e) => {
											const checked = e.target.checked;
											setSelectedLevels(prev =>
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
							<h4>{dict.notes.filters.year}</h4>
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

						<div className="filter-category" id="subject">
							<h4>{dict.notes.filters.subject}</h4>
							{subjectOptions.map(option => (
								<label key={option.value}>
									<input
										type="checkbox"
										value={option.value}
										checked={selectedSubjects.includes(option.value)}
										onChange={(e) => {
											const checked = e.target.checked;
											setSelectedSubjects(prev =>
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
							<a className="cancel-notes-btn" onClick={() => {
								setSelectedLevels([]);
								setSelectedYears([]);
								setSelectedSubjects([]);
								setFiltersOpen(false);
							}}>Remove All</a>
						</div>
					</div>
				</div>
			</section>

            <div className="container">
                <section className="results-number">{resultsText}</section>
                <section className="results">
                    <ul className="subjects">
                        {filteredCourses.map((course, index) => (
                            <li key={index}>
                                {course.title} ‒ <span className="opacity">{course.teacher}</span>
                                <ul>
                                    {course.resources.map((resource, resIndex) => (
                                        <li key={resIndex}>
                                            <a target="_blank" href={resource.link}>
                                                {resource.type}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
		</>
	);
}