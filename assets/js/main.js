class InitGrep {

    hideSearchWrapper() {
        // $('.search-overlay').hide();
        $('.search-overlay').hide();
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
            console.log("called");
            $('.search-overlay').hide(300);
            $('.basic-overlay').hide();
        })
    }



}


//run scripts below

const initgrep = new InitGrep();

initgrep.hideBasicOverlay();
initgrep.hideSearchWrapper();
initgrep.closeSearchWrapper();
initgrep.openSearchWrapper();