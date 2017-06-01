VS.enableModal = function(modalId, openId, closeId) {
    var modal = document.getElementById(modalId),
        openTrigger = document.getElementById(openId),
        closeTrigger = document.getElementById(closeId),
        overlay = document.getElementById("score-modal-overlay"); // wraps all score modals

    function openModal() {
        overlay.style.display = "block";
        modal.style.display = "block";
        VS.page.headerClassed("show");
        VS.page.footerClassed("show");
        if (VS.page.footer) { VS.score.pause(); }

        closeTrigger.addEventListener("click", closeModal, true);
        window.removeEventListener("keydown", VS.control.keydownListener, true);
        window.addEventListener("click", clickListener, true);
        window.addEventListener("keydown", keydownListener, true);
    }

    function closeModal() {
        overlay.style.display = "none";
        modal.style.display = "none";
        VS.page.headerClassed("");
        VS.page.footerClassed("");

        closeTrigger.removeEventListener("click", closeModal, true);
        window.removeEventListener("click", clickListener, true);
        window.removeEventListener("keydown", keydownListener, true);
        window.addEventListener("keydown", VS.control.keydownListener, true);
    }

    function clickListener(event) {
        if (event.target === overlay) { closeModal(); }
    }

    function keydownListener(event) {
        if (event.defaultPrevented) { return; }

        switch (event.key) {
        case "Escape":
            closeModal();
            break;
        default:
            return;
        }
        event.preventDefault();
    }

    openTrigger.addEventListener("click", openModal, true);
};

// TODO this check belongs in document.ready
if (document.getElementById("score-info-open")) {
    VS.enableModal("score-info-modal", "score-info-open", "score-info-close");
}
if (document.getElementById("score-settings-open")) {
    VS.enableModal("score-settings-modal", "score-settings-open", "score-settings-close");
}