if (VS.page.footer) {

    VS.control = (function () {

        function ScoreControl(id, fn) {
            this.element = document.getElementById(id);
            this.element.onclick = fn;
        }
        ScoreControl.prototype.enable = function() {
            this.element.disabled = false;
        };
        ScoreControl.prototype.disable = function() {
            this.element.disabled = true;
        };

        var play = new ScoreControl("score-play", VS.score.playPause);
        play.setPlay = function() {
            d3.select("g#play").classed("hide", 0);
            d3.select("g#pause").classed("hide", 1);
        };
        play.setPause = function() {
            d3.select("g#play").classed("hide", 1);
            d3.select("g#pause").classed("hide", 0);
        };

        var keydownListener = function(event) {
            if (event.defaultPrevented) {
                return;
            }

            var keyPressed = event.key || event.keyCode;

            // event.key;
            // event.keyCode; // deprecated but for Safari support
            switch (keyPressed) {
            case " ":
            case 32:
                VS.score.playPause();
                break;
            case "ArrowLeft":
            case 37:
                stepPointer(-1);
                break;
            case "ArrowRight":
            case 39:
                stepPointer(1);
                break;
            case "Escape":
            case 27:
                VS.score.stop();
                break;
            // case "/":
            // case 191:
            //     document.getElementById("score-pointer").focus();
            //     break;
            default:
                return;
            }
            event.preventDefault();
        };

        return {
            play: play,
            stop: new ScoreControl("score-stop", VS.score.stop),
            fwd: new ScoreControl("score-fwd", function(){ stepPointer(1); }),
            back: new ScoreControl("score-back", function(){ stepPointer(-1); }),
            pointer: new ScoreControl("score-pointer", VS.score.pause),
            updateStepButtons: function() {
                if(VS.score.pointer === 0) {
                    this.back.disable();
                    this.fwd.enable();
                } else if(VS.score.pointer === (VS.score.getLength() - 1)) {
                    this.back.enable();
                    this.fwd.disable();
                } else {
                    this.back.enable();
                    this.fwd.enable();
                }
            },
            keydownListener: keydownListener
        };

    })();

    VS.control.back.disable();
    VS.control.stop.disable();
    window.addEventListener("keydown", VS.control.keydownListener, true);
}

function updatePointer(ndex){ // score, control // should be part of VS, not global
    VS.score.pointer = ndex;
    VS.control.pointer.element.value = ndex;
}

function stepPointer(num){ // score, control // should be part of VS, not global
    if(!VS.score.playing) { // don't allow skip while playing, for now
        updatePointer(Math.min(Math.max(VS.score.pointer + num, 0), VS.score.getLength() - 1));
        VS.control.updateStepButtons();
        VS.score.stepCallback();
    }
}
