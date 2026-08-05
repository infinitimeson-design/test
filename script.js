/* ==========================================================
   YP PRODUCT
   script.js
   PART 1 / 4
   Core
========================================================== */

"use strict";

/* ==========================================================
   SELECTORS
========================================================== */

const body = document.body;

const navbar = document.querySelector(".navbar");

const navLinks = document.querySelectorAll(".navbar__menu a");

const revealElements = document.querySelectorAll(".reveal");


/* ==========================================================
   SCROLL NAVBAR
========================================================== */

const updateNavbar = () => {

    if (window.scrollY > 40) {

        navbar?.classList.add("scrolled");

    } else {

        navbar?.classList.remove("scrolled");

    }

};

window.addEventListener("scroll", updateNavbar);

updateNavbar();


/* ==========================================================
   ACTIVE NAV LINK
========================================================== */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.forEach(item => item.classList.remove("active"));

        link.classList.add("active");

    });

});


/* ==========================================================
   REVEAL ON SCROLL
========================================================== */

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

            revealObserver.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.15

});

revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    updateNavbar();

});

/* ==========================================================
   PART 2 / 4
   Hero Logo (Fixed - Dark Theme Only)
========================================================== */

const heroLogo = document.getElementById("hero-logo");

if (heroLogo) {
    heroLogo.src = "assets/images/logo/logo-white.png";
}


/* ==========================================================
   Navigation + Portfolio
   SMOOTH SCROLL
========================================================== */

navLinks.forEach(link => {

    link.addEventListener("click", (event) => {

        const targetID = link.getAttribute("href");

        if (!targetID || !targetID.startsWith("#")) return;

        const target = document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        window.scrollTo({

            top: target.offsetTop - 90,

            behavior: "smooth"

        });

    });

});


/* ==========================================================
   ACTIVE SECTION
========================================================== */

const sections = document.querySelectorAll("section[id]");

const sectionObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${id}`) {

                link.classList.add("active");

            }

        });

    });

}, {

    threshold: 0.45

});

sections.forEach(section => {

    sectionObserver.observe(section);

});


/* ==========================================================
   PORTFOLIO CARDS
========================================================== */

const portfolioCards = document.querySelectorAll(".portfolio-card");

portfolioCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        portfolioCards.forEach(item => {

            if (item !== card) {

                item.style.opacity = ".65";

                item.style.transform = "scale(.98)";

            }

        });

    });

    card.addEventListener("mouseleave", () => {

        portfolioCards.forEach(item => {

            item.style.opacity = "1";

            item.style.transform = "";

        });

    });

});


/* ==========================================================
   TOUCH DEVICES
========================================================== */

portfolioCards.forEach(card => {

    card.addEventListener("touchstart", () => {

        portfolioCards.forEach(item => {

            item.classList.remove("active");

        });

        card.classList.add("active");

    }, { passive: true });

});


/* ==========================================================
   HERO SCROLL
========================================================== */

const heroScroll = document.querySelector(".hero__scroll");

heroScroll?.addEventListener("click", () => {

    const nextSection = document.querySelector("section");

    if (!nextSection) return;

    window.scrollTo({

        top: nextSection.offsetTop - 80,

        behavior: "smooth"

    });

});

/* ==========================================================
   PART 4 / 4
   Final
========================================================== */


/* ==========================================================
   IMAGE PRELOAD
========================================================== */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});


/* ==========================================================
   REMOVE ACTIVE FROM TOUCH
========================================================== */

document.addEventListener("touchstart", (event) => {

    if (event.target.closest(".portfolio-card")) return;

    portfolioCards.forEach(card => {

        card.classList.remove("active");

    });

}, { passive: true });


/* ==========================================================
   ESC CLOSE STATES
========================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") return;

    portfolioCards.forEach(card => {

        card.classList.remove("active");

    });

});


/* ==========================================================
   RESIZE HANDLER
========================================================== */

let resizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

        updateNavbar();

    }, 150);

});


/* ==========================================================
   PERFORMANCE
========================================================== */

window.addEventListener("pageshow", () => {

    updateNavbar();

});


/* ==========================================================
   PREVENT DRAG
========================================================== */

document.querySelectorAll("img").forEach(image => {

    image.setAttribute("draggable", "false");

});


/* ==========================================================
   CONSOLE
========================================================== */

console.log("%cYP Product",
"font-size:18px;font-weight:bold;color:#ffffff;background:#111;padding:8px 14px;border-radius:8px;");

console.log("%cDesigned & Developed by Sicily Design",
"color:#888;font-size:12px;");

console.log("%cDesigned & Developed by Sicily Design",
"color:#888;font-size:12px;");


/* ==========================================================
   PART 5
   Dynamic Portfolio
========================================================== */

/* ==========================================================
   PORTFOLIO DYNAMIC GALLERY
========================================================== */

const portfolioButtons = document.querySelectorAll(".portfolio-category");
const portfolioView = document.getElementById("portfolio-view");

let gallery = {};

/* -------------------- */

async function loadGallery() {

    try {

        const response = await fetch("assets/images/gallery/gallery.json");

        gallery = await response.json();

    } catch (error) {

        console.error("Gallery JSON Error", error);

    }

}

/* -------------------- */

function renderCategory(category) {

    const data = gallery[category];

    if (!data) return;

    if (!data.images.length) {

        portfolioView.innerHTML = `
        <div class="portfolio-empty">

            <div class="portfolio-empty__icon">

                <svg viewBox="0 0 24 24"
                     fill="none">

                    <rect x="3" y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          stroke-width="1.5"/>

                    <circle cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            stroke-width="1.5"/>

                </svg>

            </div>

            <h3>به زودی...</h3>

            <p>

                نمونه‌کارهای این بخش
                به زودی اضافه می‌شوند.

            </p>

        </div>
        `;

        return;

    }

    let html = `<div class="portfolio-gallery">`;

    data.images.forEach(image => {

        html += `

        <figure class="portfolio-image">

            <img
                src="assets/images/gallery/${data.folder}/${image}"
                alt="${data.title}"
                loading="lazy">

        </figure>

        `;

    });

    html += `</div>`;

    portfolioView.innerHTML = html;

}

/* -------------------- */

portfolioButtons.forEach(button => {

    button.addEventListener("click", () => {

        portfolioButtons.forEach(item => {

            item.classList.remove("active");

        });

        button.classList.add("active");

        renderCategory(button.dataset.category);

    });

});

/* -------------------- */

document.addEventListener("DOMContentLoaded", async () => {

    await loadGallery();

});


/* ==========================================================
   END
========================================================== */
