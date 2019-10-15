class InitGrep {

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
            $('.basic-overlay').show();
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

initgrep.hideBasicOverlay();
initgrep.hideSearchWrapper();
initgrep.hideSettingWrapper();
initgrep.closeSearchWrapper();
initgrep.openSearchWrapper();
initgrep.openSettingWrapper();
initgrep.closeSettingWrapper();