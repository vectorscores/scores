var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2);

var main = d3.select(".main")
    .style('width', boxwidth + 'px')
    .style('height', boxwidth + 'px');

globWidth = 120; // fixed, for this test

function rangeGen(length, min, max) {
    var pcs = [];
    for (var i = 0; i < length; i++) {
        pcs.push(Math.floor(Math.random() * (max - min)) + min);
    }
    return pcs;
}

function wedgeRangeGen(length, min, max) {
    var pcs = [];
    var band = (max - min) / length;
    for (var i = 0; i < length; i++) {
        pcs.push(Math.floor(Math.random() * band) + (min + (band * i)));
    }
    return pcs;
}

function stepRangeGen(length, min, max) {
    var pcs = [];
    var disp = 10;
    min += disp;
    max -= disp;
    var lmax,
        lmin;
    var thispc = Math.floor(Math.random() * (max - min)) + min; // initial selection
    for (var i = 0; i < length; i++) {
        lmax = Math.min(thispc + disp, max);
        lmin = Math.max(thispc - disp, min);
        thispc = Math.floor(Math.random() * (lmax - lmin)) + lmin;
        pcs.push(thispc);
    }
    return pcs;
}

globject = {
    rangeEnv: {
        type: 'midi',
        hi: wedgeRangeGen(4, 64, 127),
        lo: stepRangeGen(4, 0, 63),
        times: [0, 0.3, 0.5, 1] // may want independent times for hi and lo
    },
    pitches: {
        classes: [0, 2, 6],
        weight: [0.5, 0.25, 0.25]
    },
    duration: {
        values: [0.5, 0.75, 1],
        weights: [0.5, 0.25, 0.25]
    },
    articulation: {
        values: [">", "_", "."],
        weights: [0.5, 0.25, 0.25]
    },
    dynamics: { // global
        values: ["mp", "cres.", "f"],
        dur: [0, 0.5, 1] //
    }
};

var glob = main.append("g");

var lineData = [];
for (var i = 0; i < globject.rangeEnv.times.length; i++) {
    lineData.push({ "x": globject.rangeEnv.times[i], "y": globject.rangeEnv.hi[i]});
}
var lowData = [];
for (var i = 0; i < globject.rangeEnv.times.length; i++) {
    lowData.push({ "x": globject.rangeEnv.times[i], "y": globject.rangeEnv.lo[i]});
}
// draw the top, back around the bottom, then connect back to the first point
var datLine = lineData.concat(lowData.reverse());

var lineFunction = d3.svg.line()
     .x(function(d) { return d.x * globWidth; })
     .y(function(d) { return 127 - d.y; }) // pitch is bottom-up, not pixel top2bottom
     .tension(0.8)
     .interpolate("cardinal-closed");

//The line SVG Path we draw
var lineGraph = glob.append("path")
    .attr("d", lineFunction(datLine))
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "none");

// var textarr = [
//     { "x": 0, "y": 10},
//     { "x": 0, "y": 20},
//     { "x": 0, "y": 50}
// ];
// var texts = glob.append("text")
//     .attr("d", textarr);

glob.append("text")
    .attr("y", 127 + 24)
    .text("[" + globject.pitches.classes + "]");

var dataset = globject.dynamics.values;

var textline = glob.append("g");

textline.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
            // evenly spaced, for now
            var l = dataset.length - 1;
            return i * (globWidth / l);
        })
    .attr("y", 127 + 42)
    .text(function(d) { return d; });

// glob.attr("transform", "translate(" + ((width * 0.5) - globWidth) + "," + 127 + ")");

// resize

d3.select(window).on('resize', resize);

function resize() {
    // update width
    boxwidth = Math.min( parseInt(d3.select('main').style('width'), 10), maxwidth);
    center = boxwidth * 0.5;
    width = boxwidth - (margin * 2);

    main
        .style('width', boxwidth + 'px')
        .style('height', boxwidth + 'px');
    glob.attr("transform", "translate(" + (center - (globWidth*0.5)) + "," + (center - (globWidth*0.5)) + ")");

    // debug
    d3.select('rect')
        .attr("width", width)
        .attr("height", width);
    d3.select('circle')
        .attr("transform", "translate(" + center + ", " + center + ")");
}
//
resize();
//
main.classed("debug", true);
main.append("rect")
    .attr("width", width)
    .attr("height", width)
    .attr("transform", "translate(" + margin + ", " + margin + ")");
main.append("circle")
    .attr("r", 5)
    .attr("transform", "translate(" + center + ", " + center + ")");