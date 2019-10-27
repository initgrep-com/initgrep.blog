class InitGrep {

    enableScrollProgress() {
        
        document.addEventListener(
            "scroll",
            function () {
                console.log("oncroll called");
                const scrollTop =
                    document.documentElement["scrollTop"] || document.body["scrollTop"];
                const scrollBottom =
                    (document.documentElement["scrollHeight"] ||
                        document.body["scrollHeight"]) - document.documentElement.clientHeight;
               const scrollPercent = scrollTop / scrollBottom * 100 + "%";
                document
                    .getElementById("progress")
                    .style.setProperty("--scroll", scrollPercent);
            },
            { passive: true }
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



}


//run scripts below

const initgrep = new InitGrep();
initgrep.enableScrollProgress();
initgrep.hideBasicOverlay();
initgrep.hideSearchWrapper();
initgrep.hideSettingWrapper();
initgrep.closeSearchWrapper();
initgrep.openSearchWrapper();
initgrep.openSettingWrapper();
initgrep.closeSettingWrapper();