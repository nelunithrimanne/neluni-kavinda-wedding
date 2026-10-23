/* =========================================================
   WEDDING COUNTDOWN
   ========================================================= */

const weddingDate = new Date("January 16, 2027 11:00:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) {

        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    document.getElementById("days").innerText =
        String(days).padStart(2, "0");

    document.getElementById("hours").innerText =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").innerText =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").innerText =
        String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================================
   SCROLL ANIMATIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll(
        "section:not(.hero)"
    );

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    sections.forEach(function (section) {

        observer.observe(section);

    });


    /* =====================================================
       WEDDING MUSIC
       ===================================================== */

    const musicButton =
        document.getElementById("musicButton");

    const weddingMusic =
        document.getElementById("weddingMusic");


    /* -----------------------------------------------------
       Helper function for music button appearance
       ----------------------------------------------------- */

    function setMusicPlaying() {

        if (musicButton) {

            musicButton.innerHTML = "Ⅱ";
            musicButton.classList.add("playing");

        }

    }


    function setMusicPaused() {

        if (musicButton) {

            musicButton.innerHTML = "♪";
            musicButton.classList.remove("playing");

        }

    }


    /* =====================================================
       ENTER OUR STORY
       Music starts ONLY from the user's click
       ===================================================== */

    const enterStoryButton =
        document.getElementById("enterStory");

    const entryPage =
        document.getElementById("entryPage");


    /* Lock the website while Entry Page is showing */

    document.body.classList.add("entry-locked");


    if (enterStoryButton) {

        enterStoryButton.addEventListener("click", function () {

            /* ---------------------------------------------
               START MUSIC
               --------------------------------------------- */

            if (weddingMusic) {

                weddingMusic.volume = 0.35;

                /*
                 * IMPORTANT:
                 * play() is called directly inside the
                 * button click, so the browser recognizes
                 * it as user interaction.
                 */

                const playPromise = weddingMusic.play();

                if (playPromise !== undefined) {

                    playPromise
                        .then(function () {

                            setMusicPlaying();

                        })
                        .catch(function (error) {

                            console.log(
                                "Music could not start:",
                                error
                            );

                            setMusicPaused();

                        });

                }

            }
           
/* OPEN THE WEDDING WEBSITE */

document.body.classList.remove("entry-locked");
document.body.classList.add("entry-open");

// Completely hide the entry page
if (entryPage) {
    entryPage.classList.add("entry-hidden");
    entryPage.style.display = "none";
}

// Reset the page to the very top
window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});


            /* ---------------------------------------------
               SCROLL TO PAGE 01
               --------------------------------------------- */

            setTimeout(function () {

                const home =
                    document.getElementById("home");

                if (home) {

                    home.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }, 300);

        });

    }


    /* =====================================================
       MUSIC BUTTON
       ===================================================== */

    musicButton.addEventListener("click", () => {

    if (weddingMusic.paused) {

        weddingMusic.play();

        musicButton.classList.add("playing");

        musicButton.innerHTML = "♪";

    } else {

        weddingMusic.pause();

        musicButton.classList.remove("playing");

        musicButton.innerHTML = "♩";
    }

});

    /* =====================================================
       RSVP GUEST CONTROL
       ===================================================== */

    const attendanceSelect =
        document.getElementById("attendance");

    const guestsInput =
        document.getElementById("guests");


    if (attendanceSelect && guestsInput) {

        attendanceSelect.addEventListener(
            "change",
            function () {

                /*
                 * If guest declines, disable number
                 * of guests.
                 */

                if (
                    this.value ===
                    "Declines with regret"
                ) {

                    guestsInput.value = "1";
                    guestsInput.disabled = true;

                }

                else {

                    guestsInput.disabled = false;

                }

            }
        );

    }


    /* =====================================================
       END OF SCRIPT
       ===================================================== */

});
