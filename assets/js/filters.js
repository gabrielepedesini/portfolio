// array of checked values 
function selectedValues(arr) {
    let result = [];

    arr.forEach(elem => {
        result.push(elem.value);
    });

    return result;
}

// filter button clicked
document.addEventListener("click", async function(event) {

    // filters open button
    if (event.target.classList.contains("filter-title-btn")) {
        document.querySelector('.filter-wrapper').classList.toggle('active');
    }
    
    // notes filter button
    if (event.target.classList.contains("filter-notes-btn")) {

        // fetches the json
        let response = await fetch('assets/json/database.json');
        let text = await response.json();
    
        let copy;

        if (lang === "it") {
            copy = text.it.notes;
        } else if (lang === "en") {
            copy = text.en.notes;
        }

        const checkedLevel = document.querySelectorAll('div#level input[type="checkbox"]:checked');
        const checkedYear = document.querySelectorAll('div#year input[type="checkbox"]:checked');
        const checkedSubject = document.querySelectorAll('div#subject input[type="checkbox"]:checked');

        let levels = selectedValues(checkedLevel);
        let years = selectedValues(checkedYear);
        let subject = selectedValues(checkedSubject);

        console.log(levels);
        console.log(years);
        console.log(subject);

        courseSection = '';
        resultsNumber = 0; 

        copy.courses.forEach(course => {

            if (
                (levels.includes(course.level) || levels.length === 0) 
                && 
                (years.includes(course.year) || years.length === 0) 
                && 
                (subject.includes(course.subject) || subject.length === 0)
            ) {

                courseSection += `
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

                resultsNumber++;
            }        
        });

        // display results
        const coursesSection = document.querySelector('.subjects');
        coursesSection.innerHTML = courseSection;

        // display result number
        const resultNumberSection = document.querySelector('.results-number');

        if (resultsNumber > 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results2}`;
        } else if (resultsNumber === 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results3}`;
        } else {
            resultNumberSection.textContent = `${copy.filters.noresult}`;
        }
        
        // display filters number
        const filtersNumber = levels.length + years.length + subject.length;

        if (filtersNumber > 0) {
            // set current filter number
            document.querySelector('.filter-counter').textContent = '(' + filtersNumber + ')';

            // close filter alert
            document.querySelector('.filter-alert').style.display = 'none';

            // close filter section
            document.querySelector('.filter-wrapper').classList.toggle('active');
        } else {
            // reset current filter number
            document.querySelector('.filter-counter').textContent = '';

            // display filter alert
            document.querySelector('.filter-alert').textContent = copy.filters.alert;
            document.querySelector('.filter-alert').style.display = 'block';

            setTimeout(() => {
                document.querySelector('.filter-alert').style.display = 'none';
            }, 5000);
        }
    }

    // remove all filter notes button
    if (event.target.classList.contains("cancel-notes-btn")) {

        // fetches the json
        let response = await fetch('assets/json/database.json');
        let text = await response.json();
    
        let copy;

        if (lang === "it") {
            copy = text.it.notes;
        } else if (lang === "en") {
            copy = text.en.notes;
        }

        // uncheck all the checkbox
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);

        courseSection = '';
        resultsNumber = 0; 

        copy.courses.forEach(course => {
            courseSection += `
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

            resultsNumber++;
        });

        // display results
        const coursesSection = document.querySelector('.subjects');
        coursesSection.innerHTML = courseSection;

        // display result number
        const resultNumberSection = document.querySelector('.results-number');

        if (resultsNumber > 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results2}`;
        } else if (resultsNumber === 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results3}`;
        } else {
            resultNumberSection.textContent = `${copy.filters.noresult}`;
        }

        // remove filters number
        document.querySelector('.filter-counter').textContent = '';

        // close filter section
        document.querySelector('.filter-wrapper').classList.toggle('active');
    }

    // projects filter button
    if (event.target.classList.contains("filter-projects-btn")) {

        // fetches the json
        let response = await fetch('assets/json/database.json');
        let text = await response.json();
    
        let copy;

        if (lang === "it") {
            copy = text.it.projects;
        } else if (lang === "en") {
            copy = text.en.projects;
        }

        const checkedCategory = document.querySelectorAll('div#category input[type="checkbox"]:checked');
        const checkedTechnologies = document.querySelectorAll('div#technologies input[type="checkbox"]:checked');
        const checkedYear = document.querySelectorAll('div#year input[type="checkbox"]:checked');

        let categories = selectedValues(checkedCategory);
        let technologies = selectedValues(checkedTechnologies);
        let years = selectedValues(checkedYear);

        console.log(categories);
        console.log(technologies);
        console.log(years);

        projectSection = '';
        resultsNumber = 0; 

        copy.details.forEach(project => {

            if (
                (categories.every(category => project.category.includes(category)) || categories.length === 0) 
                && 
                (technologies.every(technology => project.technologies.includes(technology)) || technologies.length === 0)
                &&
                (years.includes(project.year) || years.length === 0) 
            ) {

                projectSection += `
                    <li>
                        <a href="projects/${project.id}.html">${project.title}</a> ‒ <span>${project.date}</span>
                        <p class="desc">${project.shortdesc}</p>
                    </li>
                `

                resultsNumber++;
            }        
        });

        // display results
        const projectsSection = document.querySelector('.works');
        projectsSection.innerHTML = projectSection;

        // display result number
        const resultNumberSection = document.querySelector('.results-number');

        if (resultsNumber > 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results2}`;
        } else if (resultsNumber === 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results3}`;
        } else {
            resultNumberSection.textContent = `${copy.filters.noresult}`;
        }
        
        // display filters number
        const filtersNumber = levels.length + years.length + subject.length;

        if (filtersNumber > 0) {
            // set current filter number
            document.querySelector('.filter-counter').textContent = '(' + filtersNumber + ')';

            // close filter alert
            document.querySelector('.filter-alert').style.display = 'none';

            // close filter section
            document.querySelector('.filter-wrapper').classList.toggle('active');
        } else {
            // reset current filter number
            document.querySelector('.filter-counter').textContent = '';

            // display filter alert
            document.querySelector('.filter-alert').textContent = copy.filters.alert;
            document.querySelector('.filter-alert').style.display = 'block';

            setTimeout(() => {
                document.querySelector('.filter-alert').style.display = 'none';
            }, 5000);
        }
    }

    // remove all filter projects button
    if (event.target.classList.contains("cancel-projects-btn")) {

        // fetches the json
        let response = await fetch('assets/json/database.json');
        let text = await response.json();
    
        let copy;

        if (lang === "it") {
            copy = text.it.projects;
        } else if (lang === "en") {
            copy = text.en.projects;
        }

        // uncheck all the checkbox
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);

        projectSection = '';
        resultsNumber = 0; 

        copy.details.forEach(element => {
            projectSection += `
                <li>
                    <a href="projects/${element.id}.html">${element.title}</a> ‒ <span>${element.date}</span>
                    <p class="desc">${element.shortdesc}</p>
                </li>
            `;
        });

        // display results
        const projectsSection = document.querySelector('.works');
        projectsSection.innerHTML = projectSection;

        // display result number
        const resultNumberSection = document.querySelector('.results-number');

        if (resultsNumber > 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results2}`;
        } else if (resultsNumber === 1) {
            resultNumberSection.textContent = `${copy.filters.results1} ${resultsNumber} ${copy.filters.results3}`;
        } else {
            resultNumberSection.textContent = `${copy.filters.noresult}`;
        }

        // remove filters number
        document.querySelector('.filter-counter').textContent = '';

        // close filter section
        document.querySelector('.filter-wrapper').classList.toggle('active');
    }
});

