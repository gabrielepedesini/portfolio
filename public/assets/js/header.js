// preferred language
const langPreferred = navigator.language || navigator.userLanguage;
let lang;

if (langPreferred.startsWith('it')) {
    lang = "it"
    document.documentElement.lang = "it";
} else {
    lang = "en"
    document.documentElement.lang = "en";
}

// modify the links
let navbarLinks;

if (lang === "it") {
    navbarLinks = [
        { href: "index.html", text: "Home" },
        { href: "notes.html", text: "Appunti" },
        { href: "projects.html", text: "Progetti" },
        { href: "contacts.html", text: "Contatti" }
    ];
} else if (lang === "en") {
    navbarLinks = [
        { href: "index.html", text: "Home" },
        { href: "notes.html", text: "Notes" },
        { href: "projects.html", text: "Projects" },
        { href: "contacts.html", text: "Contacts" }
    ];
}

// render the navbar
function renderNavbar() {
    const navbarContainer = document.querySelector('.navbar');

    let navbarHTML = `
        <div class="container">
            <ul>
    `;

    if (window.location.pathname.includes("/projects/")) {
        navbarLinks.forEach(link => {
            navbarHTML += `
                <li>
                    <a href="../${link.href}">${link.text}</a>
                </li>
            `;
        });
    } else {
        navbarLinks.forEach(link => {
            navbarHTML += `
                <li>
                    <a href="${link.href}">${link.text}</a>
                </li>
            `;
        });
    }

    navbarHTML += `
            </ul>
        </div>
    `;

    navbarContainer.innerHTML = navbarHTML;
}

window.addEventListener("load", () => {
    renderNavbar();
})