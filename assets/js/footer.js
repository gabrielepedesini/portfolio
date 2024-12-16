// render the footer 
function renderFooter() {

    const footerHTML = `
        <div class="container">
            <div class="copyright">
                © <span class="year"></span> gabrielepedesini
            </div>
        </div>
    `;

    const footerContainer = document.querySelector(".footer");
    footerContainer.innerHTML = footerHTML;

    updateYear();
}

function updateYear() {
    const yearSpan = document.querySelector('.year');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}

renderFooter();
