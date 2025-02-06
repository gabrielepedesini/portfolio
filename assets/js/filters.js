// array of checked values 
function selectedValues(arr) {
    let result = [];

    arr.forEach(elem => {
        result.push(elem.value);
    });

    return result;
}

// filter button clicked
document.addEventListener("click", function(event) {
    
    // notes filter button
    if (event.target.classList.contains("filter-notes-btn")) {
        const checkedLevel = document.querySelectorAll('div#level input[type="checkbox"]:checked');
        const checkedYear = document.querySelectorAll('div#year input[type="checkbox"]:checked');
        const checkedSubject = document.querySelectorAll('div#subject input[type="checkbox"]:checked');

        let levels = selectedValues(checkedLevel);
        let years = selectedValues(checkedYear);
        let subject = selectedValues(checkedSubject);

        console.log(levels);
        console.log(years);
        console.log(subject);
    }
});

