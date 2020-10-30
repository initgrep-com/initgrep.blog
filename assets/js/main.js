class InitGrep {
    hasMenuOpacityEnabled = false;
    hoveredIn = false;

    LIGHT_LIGHT = "light_light_theme";
    LIGHT_YELLOW = "light_yellow_theme";
    LIGHT_INDIGO = "light_indigo_theme";
    LIGHT_GREEN = "light_green_theme";
    DARK_ORANGE = "dark_orange_theme";
    DARK_INDIGO = "dark_indigo_theme";
    DARK_GREEN = "dark_green_theme";
    isSettingOpen = false;
    isSearchOpen = false;

    version = "2.0.0.1";


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

            if (!this.isSearchOpen) {
                document.querySelector('.basic-overlay').style.left = "0%";
                document.querySelector('.search-overlay').style.left = "0%";
                document.querySelector('.search-overlay').classList.remove('revSlideInLeft');
                document.querySelector('.search-overlay').classList.add('slideInLeft');
                this.isSearchOpen = true;
            }

        });

    }

    closeSearchWrapper() {
        if (this.isSearchOpen) {
            document.querySelector('.basic-overlay').style.left = "-100%";
            document.querySelector('.search-overlay').style.left = "-100%";
            document.querySelector('.search-overlay').classList.remove('slideInLeft');
            document.querySelector('.search-overlay').classList.add('revSlideInLeft');
            this.isSearchOpen = false;
        }

    }

    closeSearchWrapperOnCloseBtn() {
        document.querySelector('.close-search-button').addEventListener('click', () => {
            this.closeSearchWrapper();
        });
    }

    closeSearchWrapperOnMaskClick() {
        document.querySelector('.basic-overlay').addEventListener('click', () => {
            this.closeSearchWrapper();
        });
    }

    setThemeColorForBrowser() {
        const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--c-icon-color') || "#333333";
        document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
        document.querySelector('meta[name="msapplication-navbutton-color"]').setAttribute('content', themeColor);
        document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute('content', themeColor);
    }

    openSettingWrapper() {
        document.querySelector('.setting-open-wrapper').addEventListener('click', () => {
            if (!this.isSettingOpen) {
                let finalTop = '0%';
                document.querySelector('.basic-overlay').style.left = "0%";
                //here it depends on media size 
                document.querySelector('.setting-overlay').style.bottom = finalTop;
                document.querySelector('.setting-overlay').classList.remove('revSlideInTop');
                document.querySelector('.setting-overlay').classList.add('slideInTop');
                this.isSettingOpen = true;
            }
        });
    }



    closeSettingWrapper() {
        if (!!this.isSettingOpen) {
            document.querySelector('.basic-overlay').style.left = "-100%";
            document.querySelector('.setting-overlay').style.bottom = "-60%";
            document.querySelector('.setting-overlay').classList.remove('slideInTop');
            document.querySelector('.setting-overlay').classList.add('revSlideInTop');
            this.isSettingOpen = false
        }
    }

    closeSettingWrapperOnCloseBtn() {
        document.querySelector('.close-setting-button').addEventListener('click', () => {
            this.closeSettingWrapper();
        });
    }

    closeSettingWrapperOnMaskClick() {
        document.querySelector('.basic-overlay').addEventListener('click', () => {
            this.closeSettingWrapper();
        });
    }

    closeModalOnEscape() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const isNotCombinedKey = !(event.ctrlKey || event.altKey || event.shiftKey);
                if (isNotCombinedKey) {
                    this.closeSearchWrapper();
                    this.closeSettingWrapper();
                }
            }
        });
    }

    /** theme change code */

    changeTheme(cssFile, cssLinkIndex) {
        const oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
        const finalPath = `/assets/style/${cssFile}.css`;
        const newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", finalPath);
        document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);

        setTimeout(() => {
            this.setThemeColorForBrowser();
            this.closeSettingWrapper();
        }, 1200);
    }


    switchTheme() {
        document.querySelector('button#light-light')
            .addEventListener('click', () => {
                this.changeTheme(this.LIGHT_LIGHT, 0);
                localStorage.setItem("theme", this.LIGHT_LIGHT);
            });

        document.querySelector('button#light-yellow')
            .addEventListener('click', () => {
                this.changeTheme(this.LIGHT_YELLOW, 0);
                localStorage.setItem("theme", this.LIGHT_YELLOW);
            });

        document.querySelector('button#light-indigo')
            .addEventListener('click', () => {
                this.changeTheme(this.LIGHT_INDIGO, 0);
                localStorage.setItem("theme", this.LIGHT_INDIGO);
            });

        document.querySelector('button#light-green')
            .addEventListener('click', () => {
                this.changeTheme(this.LIGHT_GREEN, 0);
                localStorage.setItem("theme", this.LIGHT_GREEN);
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

        document.querySelector('button#dark-green')
            .addEventListener('click', () => {
                this.changeTheme(this.DARK_GREEN, 0);
                localStorage.setItem("theme", this.DARK_GREEN);
            });
    }

    loadThemeOnLoad() {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === this.LIGHT_INDIGO ||
            currentTheme === this.LIGHT_YELLOW ||
            currentTheme === this.LIGHT_LIGHT ||
            currentTheme === this.LIGHT_GREEN ||
            currentTheme === this.DARK_INDIGO ||
            currentTheme === this.DARK_GREEN
        ) {
            this.changeTheme(currentTheme, 0);
        }
    }


    enableVersioning() {
        const ver = localStorage.getItem('_ver');
        if (ver !== this.version) {
            localStorage.clear();
            localStorage.setItem('_ver', this.version);
        }
    }

}

//run scripts below
(function () {
    const initgrep = new InitGrep();

    initgrep.loadThemeOnLoad();

    initgrep.enableVersioning();
    initgrep.updateScrollChangeEvents();

    initgrep.openSearchWrapper();
    initgrep.closeSearchWrapperOnCloseBtn();
    initgrep.closeSearchWrapperOnMaskClick();

    initgrep.openSettingWrapper();
    initgrep.closeSettingWrapperOnCloseBtn();
    initgrep.closeSettingWrapperOnMaskClick();

    initgrep.closeModalOnEscape();

    initgrep.changeMenuOpactiyOnHover();
    initgrep.switchTheme();

})();