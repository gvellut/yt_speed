// ==UserScript==
// @name         Easier video speed setting
// @namespace    https://vellut.com/
// @version      0.4
// @description  It's all in the title
// @author       GV
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(() => {
    let speed = 1;
    const hotkeys = {
        DECREASE: "KeyZ",
        RESET: "KeyX",
        SPEED: "KeyB",
        MAX: "KeyN",
    };



    const setSpeed = (speed) => {
        waitFor(".html5-main-video").then((video) => {
            video.playbackRate = speed;

            console.log(`New speed is ${speed}x`);

            let oldDisplay = document.getElementById("speed-display-monkey");
            if (!oldDisplay) {
                let newElement = document.createElement("div");
                let display = `<div id="speed-display-monkey" style="border: 2px solid white; position: absolute; left: 2.5%; top: 50px; width: fit-content; height: fit-content; z-index: 9999; background: rgba(15, 30, 18, .5); cursor: all-scroll; padding: 1rem; border-radius: 5px;"><strong style="color: white; font-size: 22px;">${speed}X speed</strong></div>`;
                newElement.innerHTML = display;

                document.body.append(newElement);
            } else {
                oldDisplay.getElementsByTagName("strong")[0].innerText = `${speed}X speed`;
                oldDisplay.style.opacity = 1;
            }
            fadeOutEffect();
        });
    };

    function waitFor(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function fadeOutEffect() {
        var fadeTarget = document.getElementById("speed-display-monkey");
        var fadeEffect = setInterval(function () {
            if (!fadeTarget.style.opacity) {
                fadeTarget.style.opacity = 1;
            }
            if (fadeTarget.style.opacity > 0) {
                fadeTarget.style.opacity -= 0.2;
            } else {
                clearInterval(fadeEffect);
            }
        }, 100);
    }


    const afterNavigate = () => {
        if ("/watch" === location.pathname) {
            setSpeed(speed);
        }
    };

    (document.body || document.documentElement).addEventListener(
        "transitionend",
        function (/*TransitionEvent*/ event) {
            if (event.propertyName === "transform" && event.target.id === "progress") {
                afterNavigate();
            }
        },
        true
    );

    const isComposableElement = (element) => {
        if (!element) {
            return false;
        }

        return (
            element.contentEditable === 'true' || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
        );
    };

    document.onkeydown = function (e) {
        if (isComposableElement(e.target)) {
            return;
        }

        if (Object.values(hotkeys).includes(e.code)) {
            switch (e.code) {
                case hotkeys.DECREASE:
                    speed -= 0.25;
                    speed = speed <= 0.1 ? 0.1 : speed;
                    break;
                case hotkeys.RESET:
                    speed = 1;
                    break;
                case hotkeys.SPEED:
                    speed = 1.75;
                    break;
                case hotkeys.MAX:
                    speed = 2.5;
                    break;
            }

            if (speed !== null) {
                setSpeed(speed);
            }
        }
    };

    // After page load
    afterNavigate();
})();