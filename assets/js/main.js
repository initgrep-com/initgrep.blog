class InitGrep {
    hasMenuOpacityEnabled = false;
    hoveredIn = false;

    LIGHT_ORANGE = "light_orange_theme";
    LIGHT_INDIGO = "light_indigo_theme";
    DARK_ORANGE = "dark_orange_theme";
    DARK_INDIGO = "dark_indigo_theme";

    updateScrollChangeEvents() {

        document.addEventListener(
            "scroll",
            () => {
                console.log("onscroll called");
                const scrollTop =
                    document.documentElement["scrollTop"] || document.body["scrollTop"];
                const scrollBottom =
                    (document.documentElement["scrollHeight"] ||
                        document.body["scrollHeight"]) - document.documentElement.clientHeight;
                const scrollPercent = scrollTop / scrollBottom * 100;
                const scrollPercentString = scrollTop / scrollBottom * 100 + "%";

                //    console.log("scrolltop ",scrollTop);
                //    console.log("scrollBottom ",scrollBottom, scrollPercent);

                this.updateProgressScrollBar(scrollPercentString);
                this.changeMenuOpacityOnScroll(scrollTop);
            },
            { passive: true }
        );
    }

    updateProgressScrollBar(scrollPercent) {
        document
            .getElementById("progress")
            .style.setProperty("--scroll", scrollPercent);
    }

    changeMenuOpacityOnScroll(scrollPercent) {
        if (scrollPercent >= 500 && !this.hasMenuOpacityEnabled) {
            console.log("add the opacity");
            this.hasMenuOpacityEnabled = true;
            $('.menu-component').addClass('scroll-opactity');
        }
        if (scrollPercent < 500 && this.hasMenuOpacityEnabled) {
            this.hasMenuOpacityEnabled = false;
            console.log("remove the opacity");
            $('.menu-component').removeClass('scroll-opactity');
        }
    }

    changeMenuOpactiyOnHover() {
        $('.menu-component').hover(
            () => {
                if (this.hasMenuOpacityEnabled) {
                    $('.menu-component').removeClass('scroll-opactity');
                    this.hasMenuOpacityEnabled = false;
                    this.hoveredIn = true;
                }
            },
            () => {
                if (!this.hasMenuOpacityEnabled && this.hoveredIn) {
                    $('.menu-component').addClass('scroll-opactity');
                    this.hasMenuOpacityEnabled = true;
                    this.hoveredIn = false;
                }
            }
        );
    }

    hideSearchWrapper() {
        // $('.search-overlay').hide();
        $('.search-overlay').hide();
    }

    hideSettingWrapper() {
        $('.setting-overlay').hide();
    }

    hideBasicOverlay() {
        $('.basic-overlay').hide();
    }
    openSearchWrapper() {
        $('.search-open-wrapper').click(function () {
            $('.search-overlay').show(300);
            $('.basic-overlay').show(300);
        });
    }
    closeSearchWrapper() {
        $('.close-search-button').click(function () {
            $('.search-overlay').hide(300);
            $('.basic-overlay').hide();
        })
    }

    openSettingWrapper() {
        $('.setting-open-wrapper').click(function () {
            $('.setting-overlay').show();
            $('.basic-overlay').show();
        });
    }
    closeSettingWrapper() {
        $('.close-setting-button').click(function () {
            $('.setting-overlay').hide();
            $('.basic-overlay').hide();
        })
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
        $('button#light-orange').click(() => {
            this.changeTheme(this.LIGHT_ORANGE, 0);
            localStorage.setItem("theme", this.LIGHT_ORANGE);
        });
        $('button#light-indigo').click(() => {
            this.changeTheme(this.LIGHT_INDIGO, 0);
            localStorage.setItem("theme", this.LIGHT_INDIGO);
        });
        $('button#dark-orange').click(() => {
            this.changeTheme(this.DARK_ORANGE, 0);
            localStorage.setItem("theme", this.DARK_ORANGE);
        });
        $('button#dark-indigo').click(() => {
            this.changeTheme(this.DARK_INDIGO, 0);
            localStorage.setItem("theme", this.DARK_INDIGO);
        });
    }

    loadThemeOnLoad() {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === this.LIGHT_INDIGO ||
            currentTheme === this.LIGHT_ORANGE ||
            currentTheme === this.DARK_INDIGO) {
            // console.log("dooes it call here");
            this.changeTheme(currentTheme, 0);
        }
    }

}


//run scripts below
//run scripts below
$(function () {
    const initgrep = new InitGrep();

    initgrep.hideBasicOverlay();
    initgrep.hideSearchWrapper();
    initgrep.hideSettingWrapper();

    initgrep.loadThemeOnLoad();
    initgrep.updateScrollChangeEvents();

    initgrep.closeSearchWrapper();
    initgrep.openSearchWrapper();
    initgrep.openSettingWrapper();
    initgrep.closeSettingWrapper();
    initgrep.changeMenuOpactiyOnHover();
    initgrep.switchTheme();

});