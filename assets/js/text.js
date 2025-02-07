import {renderCalendar} from './contributions.js'

// finds out in which page the user is
window.addEventListener("load", () => {

    const url = window.location.pathname;

    // preferred language
    const langPreferred = navigator.language || navigator.userLanguage;
    let lang;

    if (langPreferred.startsWith('it')) {
        lang = "it"
    } else {
        lang = "en"
    }

    // renderize a project page
    if (url.includes("/projects/")) {
        const regex = /projects\/([^\/]+)(?:\.html)?/;
        const match = url.match(regex);
        let result = match[1];
        return renderProject(lang, result);
    }

    // renderize the projects page
    if (url.includes("/projects")) {
        return renderProjects(lang);
    }

    // renderize the notes page
    if (url.includes("/notes")) {
        return renderNotes(lang);
    }

    // renderize the contacts page
    if (url.includes("/contacts")) {
        return renderContacts(lang);
    }

    // renderize the index page
    return renderIndex(lang);
})

// footer element
const footerContainer = document.querySelector(".footer");

// render a project page
function renderProject(lang, url) {

    let copy;
    let projectElement = document.querySelector(".render-project");

    projectElement.innerHTML = "";

    fetch('../assets/json/database.json')
        .then(response => response.json())
        .then(text => {
            
            if (lang === "it") {
                copy = text.it.projects.details;
            } else if (lang === "en") {
                copy = text.en.projects.details;
            }

            copy.forEach(element => {
                if (url === element.id) {

                    document.title = `${element.title} | Gabriele Pedesini`;

                    // render the title section
                    let titleSection = `
                        <section class="project-title">
                            <div class="container">

                                <div class="breadcrumb">
                                    <a href="../projects.html">${lang === 'it' ? 'progetti' : 'projects'}</a> 
                                    <span class="opacity">/ ${(element.title).toLowerCase()}</span>
                                </div>

                                <h1>${element.title}</h1>
                    `;

                    if (element.img === true) {
                        titleSection += `
                            <img src="../assets/img/${element.id}/img.png" alt="${element.title}">
                        `;
                    }

                    titleSection += `
                            </div>
                        </section>
                    `;

                    projectElement.innerHTML += titleSection;

                    // render description section
                    if (element.desc !== null) {
                        let descriptionSection = `
                            <section class="project-section">
                                <div class="container">

                                    <h3>${lang === 'it' ? 'Descrizione' : 'Description'}</h3>
                        `;

                        element.desc.forEach(el => {
                            descriptionSection += `
                                <p>${el}</p>
                            `;
                        });

                        descriptionSection += `
                                </div>
                            </section>
                        `;

                        projectElement.innerHTML += descriptionSection;
                    }

                    // render goals section
                    if (element.goals !== null) {
                        let goalsSection = `
                            <section class="project-section">
                                <div class="container">

                                    <h3>${lang === 'it' ? 'Obiettivi' : 'Goals'}</h3>
                        `;

                        element.goals.forEach(el => {
                            goalsSection += `
                                <p>${el}</p>
                            `;
                        });

                        goalsSection += `
                                </div>
                            </section>
                        `;

                        projectElement.innerHTML += goalsSection;
                    }

                    // render functions section
                    if (element.functions !== null) {
                        let functionsSection = `
                            <section class="project-section">
                                <div class="container">

                                    <h3>${lang === 'it' ? 'Funzioni' : 'Functions'}</h3>
                                    <ul>
                        `;

                        element.functions.forEach(el => {
                            functionsSection += `
                                <li>${el}</li>
                            `;
                        });

                        functionsSection += `
                                    </ul>
                                </div>
                            </section>
                        `;

                        projectElement.innerHTML += functionsSection;
                    }

                    // render technologies section
                    if (element.technologies !== null) {
                        let technologiesSection = `
                            <section class="project-section">
                                <div class="container">

                                    <h3>${lang === 'it' ? 'Tecnologie' : 'Technologies'}</h3>
                                    <ul>
                        `;

                        element.technologies.forEach(el => {
                            technologiesSection += `
                                <li>${el}</li>
                            `;
                        });

                        technologiesSection += `
                                    </ul>
                                </div>
                            </section>
                        `;

                        projectElement.innerHTML += technologiesSection;
                    }

                    // render link section
                    if (element.link !== null || element.github !== null) {
                        let linkSection = `
                            <section class="project-link">
                                <div class="container">

                                    <h3>Link</h3>
                        `;

                        if (element.link !== null) {
                            function removeProtocol(url) {
                                return url.replace(/^https?:\/\//, '');
                            }
                            
                            const url = element.link;
                            const cleanUrl = removeProtocol(url);
                            
                            linkSection += `
                                <p>
                                    <span>Live preview:</span> 
                                    <a target="_blank" href="${element.link}">${cleanUrl}</a>
                                </p>
                            `;
                        }

                        if (element.github !== null) {
                            linkSection += `
                                <p>
                                    <span>GitHub:</span> <a href="${element.github}">repo</a>
                                </p>
                            `;
                        }

                        linkSection += `
                                </div>
                            </section>
                        `;

                        projectElement.innerHTML += linkSection;
                    }
                }
            });

            projectElement.style.display = "block";
            footerContainer.style.display = "block";
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// render projects page
function renderProjects(lang) {

    let copy;
    let projectsElement = document.querySelector(".render-projects");

    projectsElement.innerHTML = "";

    // fethces the json
    fetch('assets/json/database.json')
    .then(response => response.json())
    .then(text => {

        if (lang === "it") {
            copy = text.it.projects;
            document.title = `Progetti | Gabriele Pedesini`;
        } else if (lang === "en") {
            copy = text.en.projects;
            document.title = `Projects | Gabriele Pedesini`;
        }

        // render intro section
        let introSection = `
        <section class="intro">
            <div class="container">
                <h1>${copy.intro.title}</h1>
        `;
        
        copy.intro.desc.forEach(element => {
            introSection += `
                <p>${element}</p>
            `;
        });

        introSection += `
                </div>
            </section>
        `;     

        projectsElement.innerHTML += introSection;

        // render project list
        let projectsSection = `
            <section class="page-projects">
                <div class="container">
                    <ul>
        `;
        
        copy.details.forEach(element => {
            projectsSection += `
                <li>
                    <a href="projects/${element.id}.html">${element.title}</a> ‒ <span>${element.date}</span>
                    <p class="desc">${element.shortdesc}</p>
                </li>
            `
        });

        projectsSection += `
                    </ul>
                </div>
            </section>
        `;

        projectsElement.innerHTML += projectsSection;

        projectsElement.style.display = "block";
        footerContainer.style.display = "block";
    })
    .catch(error => console.error('Error loading JSON:', error));
}

// render notes page
function renderNotes(lang) {
    let copy;

    let notesElement = document.querySelector(".render-notes");

    notesElement.innerHTML = "";

    // fetches the json
    fetch('assets/json/database.json')
    .then(response => response.json())
    .then(text => {
        
        if (lang === "it") {
            copy = text.it.notes;
            document.title = `Appunti | Gabriele Pedesini`;
        } else if (lang === "en") {
            copy = text.en.notes;
            document.title = `Notes | Gabriele Pedesini`;
        }

        // render intro section
        let introSection = `
            <section class="intro">
                <div class="container">
                    <h1>${copy.intro.title}</h1>
        `;
        
        copy.intro.desc.forEach(element => {
            introSection += `
                <p>${element}</p>
            `;
        });

        introSection += `
                </div>
            </section>
        `;     

        notesElement.innerHTML += introSection;

        // render filters section
        let filterSection = `
            <section class="filter">
                <div class="container">
                    <div class="filter-wrapper">
                        <div class="filter-header filter-title-btn">
                            <h4 class="filter-title-btn">${copy.filters.title}</h4>
                            <span class="filter-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="filter-title-btn">
                                <path d="M6 9L12 15L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </div>
        `;

        function getAllElem(arr, param) {
            return arr.map(elem => elem[param]); 
        }

        function saveUniqueElem(arr) {
            let result = []; 
            let seen = new Set();  
        
            for (let item of arr) {
                if (!seen.has(item)) {
                    result.push(item);
                    seen.add(item);
                }
            }
        
            return result;
        }

        function renderCheckList(arr, param) {
            let checkList = "";

            arr.forEach(elem => {
                checkList += `<label><input type="checkbox" value="${elem}" /> ${elem}</label>`
            });

            let result = `
                <div class="filter-category" id="${param}">
                    <h4>${copy.filters[param]}</h4>
            `;

            result += checkList;

            result += `
                </div>
            `

            return result;
        }

        const levels = getAllElem(copy.courses, "level");
        const levelsUnique = saveUniqueElem(levels);
        const levelsChecklist = renderCheckList(levelsUnique, "level");
        filterSection += levelsChecklist;

        const years = getAllElem(copy.courses, "year");
        const yearsUnique = saveUniqueElem(years);
        const yearsChecklist = renderCheckList(yearsUnique, "year");
        filterSection += yearsChecklist;

        const subjects = getAllElem(copy.courses, "subject");
        const subjectsUnique = saveUniqueElem(subjects);
        const subjectsChecklist = renderCheckList(subjectsUnique, "subject");
        filterSection += subjectsChecklist;

        filterSection += `
                        <div class="filter-btn">
                            <a class="filter-notes-btn">${copy.filters.button}</a>
                            <a class="cancel-notes-btn">${copy.filters.cancel}</a>
                        </div>
                    </div>
                </div>
            </section>
        `;

        notesElement.innerHTML += filterSection;

        // render results' number
        let resultNumber = `
            <section class="result-header">
                <div class="container">
                    <div class="results-number">
                        ${copy.filters.results1} ${copy.courses.length} ${copy.filters.results2} 
                    </div>
                </div>
            </section>
        `;

        notesElement.innerHTML += resultNumber;

        // render the courses and their resources
        let coursesSection = `
            <section class="notes">
                <div class="container">
        `;

        coursesSection += `<ul class="subjects">`;

        copy.courses.forEach(course => {
            let courseSection = `
                <li>
                    ${course.title} ‒ <span class="opacity">${course.teacher}</span>
                    <ul>
            `;

            course.resources.forEach(resource => {
                courseSection += `
                    <li><a target='_blank' href="${resource.link}">${resource.type}</a></li>
                `;
            });

            courseSection += `
                    </ul>
                </li>
            `;

            coursesSection += courseSection;
        });

        coursesSection += `</ul>`;
        
        coursesSection += `
                </div>
            </section>
        `;

        notesElement.innerHTML += coursesSection;

        notesElement.style.display = "block";
        footerContainer.style.display = "block";
    })
    .catch(error => console.error('Error loading JSON:', error));
}

// renders contacts page
function renderContacts(lang) {
    let copy;

    let contactsElement = document.querySelector(".render-contacts");

    contactsElement.innerHTML = "";

    // fetches the json
    fetch('assets/json/database.json')
    .then(response => response.json())
    .then(text => {
        
        if (lang === "it") {
            copy = text.it.contacts;
            document.title = `Contatti | Gabriele Pedesini`;
        } else if (lang === "en") {
            copy = text.en.contacts;
            document.title = `Contacts | Gabriele Pedesini`;
        }

        // render intro section
        let introSection = `
            <section class="intro">
                <div class="container">
                    <h1>${copy.title}</h1>
                    <p>${copy.desc}</p>
                    <ul>
        `;
        
        copy.ref.forEach(element => {
            introSection += `
                <li><a target="_blank" href="${element.link}">${element.name}</a></li>
            `;
        });

        introSection += `
                    </ul>
                </div>
            </section>
        `;     

        contactsElement.innerHTML += introSection;

        contactsElement.style.display = "block";
        footerContainer.style.display = "block";
    })
    .catch(error => console.error('Error loading JSON:', error));
}

// renders index page
function renderIndex(lang) {
    let copy;
    let projects;

    let indexElement = document.querySelector(".render-index");

    indexElement.innerHTML = "";

    // fetches the json
    fetch('assets/json/database.json')
    .then(response => response.json())
    .then(text => {
        
        if (lang === "it") {
            copy = text.it.index;
            projects = text.it.projects.details;
        } else if (lang === "en") {
            copy = text.en.index;
            projects = text.en.projects.details;
        }

        // render intro section
        let introSection = `
            <section class="intro">
                <div class="container">
                    <h1>${copy.intro.title}</h1>
        `;
        
        copy.intro.desc.forEach(element => {
            introSection += `
                <p>${element}</p>
            `;
        });

        introSection += `
                </div>
            </section>
        `;     

        indexElement.innerHTML += introSection;

        // render resume section
        let resumeSection = `
        <section class="resume">
            <div class="container">
                <p>${copy.intro.resume}</p>
            </div>
        </section>
        `;

        indexElement.innerHTML += resumeSection;

        // render education section
        let formationSection = `
        <section class="formazione">
            <div class="container">
                <h2>${copy.formation.title}</h2>
        `;
        
        copy.formation.desc.forEach(element => {
            formationSection += `
                <p>${element}</p>
            `;
        });

        formationSection += `
                </div>
            </section>
        `;     

        indexElement.innerHTML += formationSection;

        // render projects section
        let projectsSection = `
        <section class="projects">
            <div class="container">
                <h2>${copy.projects.title}</h2>
                <p>${copy.projects.desc}</p>
                <ul>`;

        for (let i = 0; i < projects.length && i < 3; i++) {
            let project = projects[i];
            projectsSection += `
                <li><a href="projects/${project.id}.html">${project.title}</a> ‒ ${project.shortdesc}</li>`;
        }

        projectsSection += `
                </ul>
                <p style="margin-top: 15px;">${copy.projects.all}</p>
            </div>
        </section>`;

        indexElement.innerHTML += projectsSection;

        // render contribution section
        let contributionSection = `
            <section class="contribution">
                <div class="container">`;

        copy.contributions.desc.forEach (elem => {
            contributionSection += `
                <p>
                    ${elem}
                </p>`;
        });

        contributionSection += `</div>
            </section>`;

        indexElement.innerHTML += contributionSection;

        let contributionsSection = `
            <section class="contributions">
                <div class="graph-wrapper">
                    <div id="contribution-calendar"></div>
                    <div class="github-tag">
                        <a href="https://github.com/gabrielepedesini" target="_blank">${copy.contributions.graph}</a>
                    </div>
                </div>

                <div class="left-gradient"></div>
                <div class="right-gradient"></div>
            </section>
        `;

        indexElement.innerHTML += contributionsSection;

        renderCalendar().then((result) => {
            indexElement.style.display = "block";
            footerContainer.style.display = "block";
        });
    })
    .catch(error => console.error('Error loading JSON:', error));
}
