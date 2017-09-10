---
layout: compress-js
---
VS.lineCloud = function() {
    var w = VS.constant(127),
        h = VS.constant(127),
        dur = VS.constant(1),
        phrase = VS.constant([{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }]), // TODO pitch === relative
        curve = d3.curveLinear;

    // TODO how to handle last duration?
    // if last dur !== 0, duplicate pitch with 0 dur

    function phraseToPoints(points) {
        var phraseDuration = points.reduce(function(a, o) {
            return a + o.duration;
        }, 0);

        var durationScale = phraseDuration / dur();

        var currentTime = 0;

        var xOffset = VS.getRandExcl(0, 1 - durationScale);
        var yOffset = Math.floor(VS.getRandExcl(0, 128));

        return points.map(function(o) {
            var point = {
                x: currentTime + xOffset,
                y: o.pitch + yOffset
            };

            currentTime += (o.duration / phraseDuration) * durationScale;

            return point;
        });
    }

    function midiToY(y) {
        return 1 - (y / 127);
    }

    function lineCloud(selection, args) {
        args = args || {};

        var n = args.n || 1; // TODO allow to be set by method?

        var width = w(), // w(d, i),
            height = h(), // h(d, i);
            duration = dur();

        var data = [];

        for (var i = 0; i < n; i++) {
            data.push(phraseToPoints(phrase()));
        }

        var line = d3.line()
            .x(function(d) {
                return d.x * width;
            })
            .y(function(d) {
                return midiToY(d.y) * height;
            })
            .curve(curve);

        selection.selectAll(".line-cloud-path")
            .data(data)
            .enter()
            .append("path")
                .attr("class", "line-cloud-path")
                .attr("d", line);
    }

    lineCloud.width = function(_) {
        return arguments.length ? (w = typeof _ === "function" ? _ : VS.constant(+_), lineCloud) : w;
    };

    lineCloud.height = function(_) {
        return arguments.length ? (h = typeof _ === "function" ? _ : VS.constant(+_), lineCloud) : h;
    };

    lineCloud.duration = function(_) {
        return arguments.length ? (dur = typeof _ === "function" ? _ : VS.constant(+_), lineCloud) : dur;
    };

    lineCloud.phrase = function(_) {
        return arguments.length ? (phrase = typeof _ === "function" ? _ : VS.constant(_), lineCloud) : phrase;
    };

    lineCloud.curve = function(_) {
        return arguments.length ? (curve = typeof _ === "function" ? _ : curve, lineCloud) : curve;
    };

    return lineCloud;
};