class InitGrep {
    hasMenuOpacityEnabled = false;
    hoveredIn = false;

    LIGHT_LIGHT = "light_light_theme";
    LIGHT_ORANGE = "light_orange_theme";
    LIGHT_INDIGO = "light_indigo_theme";
    DARK_ORANGE = "dark_orange_theme";
    DARK_INDIGO = "dark_indigo_theme";

    updateScrollChangeEvents() {
        document.addEventListener(
            "scroll",
            () => {
                const scrollTop = document.documentElement["scrollTop"] || document.body["scrollTop"];
                const scrollBottom = (document.documentElement["scrollHeight"] || document.body["scrollHeight"])
                    - document.documentElement.clientHeight;
                const scrollPercentString = scrollTop / scrollBottom * 100 + "%";
                this.updateProgressScrollBar(scrollPercentString);
                this.changeMenuOpacityOnScroll(scrollTop);
            },
            { passive: true }
        );
    }

    updateProgressScrollBar(scrollPercent) {
        document.getElementById("progress").style.setProperty("--scroll", scrollPercent);
    }

    changeMenuOpacityOnScroll(scrollPercent) {
        if (scrollPercent >= 500 && !this.hasMenuOpacityEnabled) {
            this.hasMenuOpacityEnabled = true;
            document.querySelector('.menu-component').classList.add('scroll-opactity');
        }
        if (scrollPercent < 500 && this.hasMenuOpacityEnabled) {
            this.hasMenuOpacityEnabled = false;
            document.querySelector('.menu-component').classList.remove('scroll-opactity');
        }
    }

    changeMenuOpactiyOnHover() {
        document.querySelector('.menu-component')
            .addEventListener('mouseover',
                () => {
                    if (this.hasMenuOpacityEnabled) {
                        document.querySelector('.menu-component').classList.remove('scroll-opactity');
                        this.hasMenuOpacityEnabled = false;
                        this.hoveredIn = true;
                    }
                });

        document.querySelector('.menu-component')
            .addEventListener('mouseout', () => {
                if (!this.hasMenuOpacityEnabled && this.hoveredIn) {
                    document.querySelector('.menu-component').classList.add('scroll-opactity');
                    this.hasMenuOpacityEnabled = true;
                    this.hoveredIn = false;
                }
            });
    }

    openSearchWrapper() {
        document.querySelector('.search-open-wrapper').addEventListener('click', () => {
            document.querySelector('.basic-overlay').style.left = "0%";
            document.querySelector('.search-overlay').style.left = "0%";
        });

    }
    closeSearchWrapper() {
        document.querySelector('.close-search-button').addEventListener('click', () => {
            document.querySelector('.basic-overlay').style.left = "-100%";
            document.querySelector('.search-overlay').style.left = "-100%";
        });
    }

    openSettingWrapper() {
        // check mediaqueries for different screen size and keep the top as required.
        document.querySelector('.setting-open-wrapper').addEventListener('click', () => {
            document.querySelector('.basic-overlay').style.left = "0%";
            document.querySelector('.setting-overlay').style.top = "60%";
        });


    }
    closeSettingWrapper() {

        document.querySelector('.close-setting-button').addEventListener('click', () => {
            document.querySelector('.basic-overlay').style.left = "-100%";
            document.querySelector('.setting-overlay').style.top = "160%";
        });
    }

    changeTheme(cssFile, cssLinkIndex) {
        const oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
        const finalPath = `/assets/style/${cssFile}.css`;
        const newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", finalPath);
        document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
    }

    switchTheme() {

        document.querySelector('button#light-light')
            .addEventListener('click', () => {
                this.changeTheme(this.LIGHT_LIGHT, 0);
                localStorage.setItem("theme", this.LIGHT_LIGHT);
            });

        document.querySelector('button#light-orange')
            .addEventListener('click', () => {
                this.changeTheme(this.LIGHT_ORANGE, 0);
                localStorage.setItem("theme", this.LIGHT_ORANGE);
            });

        document.querySelector('button#light-indigo')
            .addEventListener('click', () => {
                this.changeTheme(this.LIGHT_INDIGO, 0);
                localStorage.setItem("theme", this.LIGHT_INDIGO);
            });

        document.querySelector('button#dark-orange')
            .addEventListener('click', () => {
                this.changeTheme(this.DARK_ORANGE, 0);
                localStorage.setItem("theme", this.DARK_ORANGE);
            });

        document.querySelector('button#dark-indigo')
            .addEventListener('click', () => {
                this.changeTheme(this.DARK_INDIGO, 0);
                localStorage.setItem("theme", this.DARK_INDIGO);
            });
    }

    loadThemeOnLoad() {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === this.LIGHT_INDIGO ||
            currentTheme === this.LIGHT_ORANGE ||
            currentTheme === this.DARK_INDIGO ||
            currentTheme === this.LIGHT_LIGHT
        ) {

            this.changeTheme(currentTheme, 0);
        }
    }

}

//run scripts below
(function () {
    const initgrep = new InitGrep();
    initgrep.loadThemeOnLoad();
    initgrep.updateScrollChangeEvents();

    initgrep.openSearchWrapper();
    initgrep.closeSearchWrapper();

    initgrep.openSettingWrapper();
    initgrep.closeSettingWrapper();

    initgrep.changeMenuOpactiyOnHover();
    initgrep.switchTheme();

})();