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
    }
});

