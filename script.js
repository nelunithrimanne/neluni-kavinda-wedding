
/* =========================================================
   NELUNI & KAVINDA — WEDDING WEBSITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. WEDDING COUNTDOWN
       16 January 2027 — 11:00 AM Sri Lanka time
       ===================================================== */

    const weddingDate = new Date(
        "2027-01-16T11:00:00+05:30"
    ).getTime();

    function updateCountdown() {

        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");

        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }

        const difference = weddingDate - Date.now();

        if (difference <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
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

        daysElement.textContent = String(days).padStart(2, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* =====================================================
       2. WEDDING WEBSITE ENTRY BUTTON
       ===================================================== */

    const entryPage = document.getElementById("entryPage");
    const enterStoryButton = document.getElementById("enterStory");
    const homePage = document.getElementById("home");

    const weddingMusic = document.getElementById("weddingMusic");
    const musicButton = document.getElementById("musicButton");

    document.body.classList.add("entry-locked");

    let entryOpened = false;

    if (enterStoryButton) {

        enterStoryButton.addEventListener("click", function () {

            if (entryOpened) {
                return;
            }

            entryOpened = true;

            /* Start music after the guest clicks */

            if (weddingMusic) {

                weddingMusic.volume = 0.35;

                weddingMusic.play().catch(function (error) {
                    console.warn(
                        "Music could not start. Use the music button.",
                        error
                    );
                });
            }

            /* Hide entry screen */

            if (entryPage) {
                entryPage.classList.add("entry-hidden");
                entryPage.style.display = "none";
            }

            /* Allow scrolling */

            document.body.classList.remove("entry-locked");
            document.body.classList.add("entry-open");

            window.scrollTo(0, 0);

            /* Display main cover */

            setTimeout(function () {

                if (homePage) {
                    homePage.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

            }, 100);

        });
    }


    /* =====================================================
       3. WEDDING MUSIC BUTTON
       ===================================================== */

    function updateMusicButton() {

        if (!musicButton || !weddingMusic) {
            return;
        }

        const isPlaying = !weddingMusic.paused;

        musicButton.textContent = isPlaying ? "Ⅱ" : "♪";

        musicButton.classList.toggle("playing", isPlaying);

        musicButton.setAttribute(
            "aria-label",
            isPlaying ? "Pause wedding music" : "Play wedding music"
        );
    }

    if (musicButton && weddingMusic) {

        musicButton.addEventListener("click", function () {

            if (weddingMusic.paused) {

                weddingMusic.volume = 0.35;

                weddingMusic.play().catch(function (error) {
                    console.warn("Unable to play music:", error);
                    updateMusicButton();
                });

            } else {
                weddingMusic.pause();
            }

        });

        weddingMusic.addEventListener("play", updateMusicButton);
        weddingMusic.addEventListener("pause", updateMusicButton);
        weddingMusic.addEventListener("ended", updateMusicButton);

        updateMusicButton();
    }


    /* =====================================================
       4. SCROLL ANIMATIONS
       ===================================================== */

    const sections = document.querySelectorAll(
        "section:not(.hero)"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }

                });

            },
            { threshold: 0.15 }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });

    } else {

        sections.forEach(function (section) {
            section.classList.add("show");
        });

    }


    /* =====================================================
       5. RSVP GUEST COUNT
       Keep options 1–5 available for BOTH responses.
       ===================================================== */

    const attendanceOptions = document.querySelectorAll(
        'input[name="attendance"]'
    );

    const guestsInput = document.getElementById("guestCount");

    function updateGuestOptions() {

        if (!guestsInput) {
            return;
        }

        /*
           Do not force the guest count to 1.
           Do not disable the dropdown when declining.
        */

        guestsInput.disabled = false;
    }

    attendanceOptions.forEach(function (option) {
        option.addEventListener("change", updateGuestOptions);
    });

    updateGuestOptions();


    /* =====================================================
       6. RSVP THANK-YOU MESSAGE
       ===================================================== */

    const rsvpForm = document.getElementById("rsvpForm");
    const successMessage = document.getElementById("rsvpSuccess");

    /*
       Keep the thank-you message hidden until submission.
       Its text is updated below for both responses.
    */

    if (successMessage) {
        successMessage.style.display = "none";
    }

    if (rsvpForm && successMessage) {

        rsvpForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!rsvpForm.reportValidity()) {
                return;
            }

            const submitButton = rsvpForm.querySelector(
                ".luxury-rsvp-button"
            );

            if (!submitButton || submitButton.disabled) {
                return;
            }

            const originalButtonText = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = "SENDING...";

            const formData = new FormData(rsvpForm);

            fetch(rsvpForm.action, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            })

            .then(function () {

                /*
                   Use the same message for accepting
                   and declining guests.
                */

                successMessage.innerHTML = `
                    <div class="rsvp-thank-you">
                        <h2>Thank You!</h2>
                        <p>Your RSVP has been received.</p>
                        <p>Thank you for letting us know.</p>
                    </div>
                `;

                /* Hide the RSVP form */

                rsvpForm.classList.add("rsvp-submitted");
                rsvpForm.style.display = "none";

                /* Show the thank-you message */

                successMessage.classList.add("rsvp-success-visible");
                successMessage.style.display = "block";

                successMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            })

            .catch(function (error) {

                console.error("RSVP submission error:", error);

                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;

                alert(
                    "We could not send your RSVP. Please try again."
                );

            });

        });
    }

}); /* END DOMContentLoaded */
