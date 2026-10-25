
/* =========================================================
   NELUNI & KAVINDA — WEDDING WEBSITE JAVASCRIPT
   Wedding Date: 16 January 2027
   Sri Lanka Time: 11:00 AM
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. WEDDING COUNTDOWN
       ===================================================== */

    const weddingDate = new Date(
        "2027-01-16T11:00:00+05:30"
    ).getTime();

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    function updateCountdown() {

        const now = Date.now();
        const distance = weddingDate - now;

        if (distance <= 0) {

            if (daysElement) daysElement.textContent = "00";
            if (hoursElement) hoursElement.textContent = "00";
            if (minutesElement) minutesElement.textContent = "00";
            if (secondsElement) secondsElement.textContent = "00";

            return;
        }

        const days = Math.floor(
            distance / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (distance % (1000 * 60)) / 1000
        );

        if (daysElement) {
            daysElement.textContent = String(days).padStart(2, "0");
        }

        if (hoursElement) {
            hoursElement.textContent = String(hours).padStart(2, "0");
        }

        if (minutesElement) {
            minutesElement.textContent = String(minutes).padStart(2, "0");
        }

        if (secondsElement) {
            secondsElement.textContent = String(seconds).padStart(2, "0");
        }
    }

    updateCountdown();

    const countdownInterval = setInterval(updateCountdown, 1000);


    /* =====================================================
       2. ENTRY PAGE
       ===================================================== */

    const entryPage = document.getElementById("entryPage");
    const enterStoryButton = document.getElementById("enterStory");
    const homeSection = document.getElementById("home");

    if (entryPage) {
        document.body.classList.add("entry-locked");
    }

    if (enterStoryButton) {

        enterStoryButton.addEventListener("click", function () {

            document.body.classList.remove("entry-locked");
            document.body.classList.add("entry-open");

            if (entryPage) {
                entryPage.classList.add("entry-hidden");
            }

            if (homeSection) {
                homeSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            // Start wedding music after the visitor enters.
            playWeddingMusic();

        });
    }


    /* =====================================================
       3. WEDDING MUSIC
       ===================================================== */

    const weddingMusic = document.getElementById("weddingMusic");
    const musicButton = document.getElementById("musicButton");

    function updateMusicButton(isPlaying) {

        if (!musicButton) return;

        if (isPlaying) {

            musicButton.innerHTML = "♫";
            musicButton.setAttribute(
                "aria-label",
                "Pause wedding music"
            );

            musicButton.setAttribute(
                "title",
                "Pause wedding music"
            );

            musicButton.classList.add("music-playing");

        } else {

            musicButton.innerHTML = "♪";
            musicButton.setAttribute(
                "aria-label",
                "Play wedding music"
            );

            musicButton.setAttribute(
                "title",
                "Play wedding music"
            );

            musicButton.classList.remove("music-playing");
        }
    }

    function playWeddingMusic() {

        if (!weddingMusic) return;

        const playPromise = weddingMusic.play();

        if (playPromise !== undefined) {

            playPromise
                .then(function () {
                    updateMusicButton(true);
                })
                .catch(function () {
                    // Some browsers may block automatic playback.
                    updateMusicButton(false);
                });

        }
    }

    if (weddingMusic) {

        weddingMusic.addEventListener("play", function () {
            updateMusicButton(true);
        });

        weddingMusic.addEventListener("pause", function () {
            updateMusicButton(false);
        });

        weddingMusic.addEventListener("ended", function () {
            updateMusicButton(false);
        });
    }

    if (musicButton) {

        musicButton.addEventListener("click", function () {

            if (!weddingMusic) return;

            if (weddingMusic.paused) {

                playWeddingMusic();

            } else {

                weddingMusic.pause();
            }

        });
    }


    /* =====================================================
       4. SCROLL ANIMATIONS
       ===================================================== */

    const animatedSections = document.querySelectorAll(
        "section:not(.hero)"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        animatedSections.forEach(function (section) {
            sectionObserver.observe(section);
        });

    } else {

        // Fallback for older browsers.
        animatedSections.forEach(function (section) {
            section.classList.add("show");
        });
    }


    /* =====================================================
       5. RSVP FORM
       ===================================================== */

    const rsvpForm = document.getElementById("rsvpForm");
    const rsvpSuccess = document.getElementById("rsvpSuccess");
    const guestCount = document.getElementById("guestCount");

    if (rsvpForm) {

        const submitButton = rsvpForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        /*
         * Keep guest selection available for BOTH
         * accepting and declining responses.
         */

        if (guestCount) {
            guestCount.disabled = false;
        }

        /*
         * Submit the RSVP to Google Apps Script.
         */

        rsvpForm.addEventListener("submit", function (event) {

            event.preventDefault();

            // Prevent duplicate submissions.
            if (rsvpForm.dataset.submitting === "true") {
                return;
            }

            const attendanceInput = rsvpForm.querySelector(
                'input[name="attendance"]:checked'
            );

            // Check that an attendance option is selected.
            if (!attendanceInput) {

                alert(
                    "Please select whether you will attend or decline."
                );

                return;
            }

            // Check that a guest count is selected.
            if (guestCount && !guestCount.value) {

                alert("Please select the number of guests.");

                guestCount.focus();

                return;
            }

            // Check that the form has a Google Apps Script URL.
            const formAction = rsvpForm.action;

            if (
                !formAction ||
                formAction === window.location.href ||
                !/^https:\/\/script\.google\.com\//i.test(formAction)
            ) {

                alert(
                    "The RSVP form URL is missing or incorrect. " +
                    "Please check the form action in your HTML."
                );

                return;
            }

            const formData = new FormData(rsvpForm);

            // Ensure attendance is sent using the correct field name.
            formData.set("attendance", attendanceInput.value);

            rsvpForm.dataset.submitting = "true";

            if (submitButton) {

                submitButton.disabled = true;

                if (submitButton.tagName === "INPUT") {
                    submitButton.value = "SENDING...";
                } else {
                    submitButton.textContent = "SENDING...";
                }
            }

            /*
             * no-cors allows the request to be sent to Google
             * Apps Script without requiring a readable response.
             *
             * A no-cors response cannot confirm that the row
             * was successfully saved in Google Sheets.
             */

            fetch(formAction, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            })
            .then(function () {

                // Show the existing thank-you area.
                rsvpForm.classList.add("rsvp-submitted");

                if (rsvpSuccess) {

                    rsvpSuccess.innerHTML = `
                        <div class="rsvp-thank-you">
                            <h3>Thank You!</h3>
                            <p>Your RSVP has been received.</p>
                            <p>Thank you for letting us know.</p>
                        </div>
                    `;

                    rsvpSuccess.classList.add(
                        "rsvp-success-visible"
                    );

                    rsvpSuccess.style.display = "block";
                }

                // Hide the form after submission.
                rsvpForm.style.display = "none";

            })
            .catch(function (error) {

                console.error("RSVP submission error:", error);

                alert(
                    "Something went wrong while sending your RSVP. " +
                    "Please try again."
                );

                rsvpForm.dataset.submitting = "false";

                if (submitButton) {

                    submitButton.disabled = false;

                    if (submitButton.tagName === "INPUT") {
                        submitButton.value = "SUBMIT RSVP";
                    } else {
                        submitButton.textContent = "SUBMIT RSVP";
                    }
                }

            });

        });
    }


    /* =====================================================
       6. INITIAL MUSIC BUTTON STATE
       ===================================================== */

    if (weddingMusic && weddingMusic.paused) {
        updateMusicButton(false);
    }


    /* =====================================================
       7. CLEANUP NOTE
       ===================================================== */

    // The countdown updates every second while this page is open.
    // No other timers are required.

});
