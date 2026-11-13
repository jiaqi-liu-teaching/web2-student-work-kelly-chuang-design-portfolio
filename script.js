//Hamburger Menu Javascript used throughout the entire site
let hamburgerBtn = document.querySelector(".hamburger-menu");
let closeBtn = document.querySelector(".close-btn");
let mobileOverlay = document.querySelector(".mobile-overlay");

hamburgerBtn.addEventListener("click", () =>{ //when clicked, the overlay opens
    mobileOverlay.classList.add("overlay-open");
});

closeBtn.addEventListener("click", ()=>{ //when clicked, the overlay closes
    mobileOverlay.classList.remove("overlay-open");
});

//text animation for hero-content in index.html using gsapp motion library - SplitText and ScrollTrigger

//code copy/pasted from gsaplibrary and edited to work with this project
gsap.registerPlugin(SplitText, ScrollTrigger);


document.fonts.ready.then(() => {

    gsap.set(".split", { opacity: 1 });
    SplitText.create(".split", {
        type: "words,lines,chars",
        linesClass: "chars",
        autoSplit: true,
        mask: "chars",
        onSplit: (self) => gsap.from(self.chars, {
            duration: 0.75,
            yPercent: 100,
            opacity: 0,
            stagger: 0.05,
            ease: "expo.out",
        }),
    });

    // Animate each h1 inside personal-info-section when scrolled into view
    document.querySelectorAll(".personal-info-section h1").forEach(heading => {
        SplitText.create(heading, {
            type: "words,lines",
            linesClass: "words",
            autoSplit: true,
            mask: "lines",
            onSplit: (self) => gsap.from(self.lines, {
                duration: 2,
                yPercent: 100,
                opacity: 0,
                stagger: 0.2,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: heading,
                    scroller: ".personal-info-section",
                    start: "top 80%",
                    toggleActions: "restart none restart reverse",
                },
            }),
        });
    });
});

//the scroll-indicator will switch direction depending on where the location of the scroll is in the div, located in index.html

let indicator = document.querySelector(".scroll-indicator");
let lastSection = document.querySelector(".contact-section");
let scroller = document.querySelector(".personal-info-section");

if (indicator && lastSection && scroller) {
    let arrow = document.querySelector(".scroll-indicator .arrow");

    let bounce = gsap.to(arrow, {
        y: 6,
        duration: 0.5,
        repeat: -1,
        yoyo: true,  
        ease: "sine.inOut",
    });

    let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                indicator.classList.toggle("at-skills", entry.isIntersecting);
                bounce.kill();
                gsap.set(arrow, { rotate: entry.isIntersecting ? 180 : 0, y: 0 });
                bounce = gsap.to(arrow, {
                    y: entry.isIntersecting ? -6 : 6,
                    duration: 0.75,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            });
        },
        { root: scroller, threshold: 0.5 }
    );

    observer.observe(lastSection); 
}



//sorting/search projects when category-tag is clicked
let tabs = document.querySelectorAll(".category-tag");
let projectCard = document.querySelectorAll(".project-card");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Find the tab's category class (any class that isn't "category-tag" or "active")
        let selected = [...tab.classList].find(
            c => c !== "category-tag" && c !== "active"
        );

        // Loops every card to see if class matches selected and decides whether card should be visible
        projectCard.forEach(card => {
            let show = selected === "all" || card.classList.contains(selected);
            if (show) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});


//sorting/search project javascript for dropdown menu when in mobile state. 
let trigger = document.querySelector(".dropdown-trigger");
let options = document.querySelector(".dropdown-options");
let label = document.querySelector(".dropdown-label");

if (trigger && options) { 
    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        options.classList.toggle("open");
        trigger.classList.toggle("open");
    });

    options.querySelectorAll("li").forEach(option => {
        option.addEventListener("click", () => {
            let selected = option.dataset.value;

            //for every li inside .dropdown-options, attacha click handler to each one
            label.textContent = option.textContent;
            options.querySelectorAll("li").forEach(o => o.classList.remove("active"));
            option.classList.add("active");

            options.classList.remove("open");
            trigger.classList.remove("open");

            projectCard.forEach(card => {
                let show = selected === "all" || card.classList.contains(selected);
                card.style.display = show ? "" : "none";
            });
        });
    });

    //if user clicks anywhere on the page, close the dropdown options
    document.addEventListener("click", (e) => {
        if (!trigger.contains(e.target) && !options.contains(e.target)) {
            options.classList.remove("open");
            trigger.classList.remove("open");
        }
    });
}


// Fade in project images as they scroll into view (project pages only)
// Fade in media as they scroll into view (project pages only)
let projectMedia = document.querySelectorAll(".project-content img, .project-content video");
let gridImages = document.querySelectorAll(".presentation-grid img");

// Hide everything immediately so there's no flicker before animations run
gsap.set([...projectMedia, ...gridImages], { opacity: 0, y: 60 });

window.addEventListener("load", () => {
    // Stacked single images
    projectMedia.forEach(media => {
        gsap.to(media, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: media,
                scroller: ".content-container",
                start: "top 85%",
                toggleActions: "restart none restart reverse",
            },
        });
    });

    // Grid images — each one animates individually as it scrolls in
    gridImages.forEach(img => {
        gsap.fromTo(img,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: img,
                    scroller: ".content-container",
                    start: "top 85%",
                    once: true,
                },
            }
        );
    });

    ScrollTrigger.refresh();
});