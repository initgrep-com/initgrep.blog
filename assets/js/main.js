class InitGrep {
    hasMenuOpacityEnabled = false;
    hoveredIn = false;

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

    changeTheme(){
        
    }



}


//run scripts below

const initgrep = new InitGrep();
initgrep.updateScrollChangeEvents();
initgrep.hideBasicOverlay();
initgrep.hideSearchWrapper();
initgrep.hideSettingWrapper();
initgrep.closeSearchWrapper();
initgrep.openSearchWrapper();
initgrep.openSettingWrapper();
initgrep.closeSettingWrapper();
initgrep.changeMenuOpactiyOnHover();