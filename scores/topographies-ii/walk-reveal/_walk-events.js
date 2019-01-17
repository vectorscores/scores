/**
 * Reveal a starting point, chosen from an extreme high or low
 */
function getScoreRange(data) {
    return {
        min: Math.min.apply(null, data),
        max: Math.max.apply(null, data)
    };
}
var startingIndex = (function() {
    var range = getScoreRange(topography);

    var extremaIndices = topography
        .map(function(d, i) {
            return {
                height: d,
                index: i
            };
        })
        .filter(function(d) {
            return (d.height === range.min) || (d.height === range.max);
        });

    return VS.getItem(extremaIndices).index;
}());

function createEmptyFrame(duration) {
    return {
        walkerIndex: startingIndex,
        direction: '',
        duration: duration,
        topography: topography.map(function(d) {
            return {
                height: d,
                revealed: 0,
                explored: false
            };
        })
    };
}

var firstFrame = createEmptyFrame(0);

var walkEvents = [].concat(
    firstFrame,
    walkFrames(),
    createEmptyFrame(6000)
);

function walkFrames() {
    var frames = [];

    for (var i = 0, lastFrame; i < nEvents; i++) {
        lastFrame = (i > 0) ? frames[i - 1] : firstFrame;
        frames.push(createNewFrame(lastFrame));
    }

    return frames;
}

function numberIsInBounds(n) {
    return (n > 0) && (n < score.width);
}
function pointIsInBounds(point) {
    return numberIsInBounds(point.x) && numberIsInBounds(point.y);
}

// With 100 events, will be between 90-120s total duration
function randDuration() {
    return VS.getRandIntIncl(900, 1200);
}

function createNewFrame(lastFrame) {

    var lastPoint = indexToPoint(lastFrame.walkerIndex);

    var adjacentChoices = ['north', 'south', 'east', 'west', 'northWest', 'southEast']
        .map(function(dir) {
            return {
                direction: dir,
                point: window[dir](lastPoint)
            };
        })
        .filter(function(d) {
            return pointIsInBounds(d.point);
        })
        .map(function(d) {
            return {
                direction: d.direction,
                index: pointToIndex(d.point)
            };
        });

    function revealAdjacentChoices(index, frame) {
        adjacentChoices.map(function(d) {
            return d.index;
        })
        .filter(function() {
            return Math.random() < 0.2;
        }).forEach(function(index) {
            frame.topography[index].revealed += nearbyRevealFactor;
        });

        return frame;
    }

    function createNewFrame(tuple) {
        var newFrame = {
            topography: lastFrame.topography.map(function(d) {
                // copy
                return {
                    height: d.height,
                    // decrement reveal, if not 0
                    revealed: d.revealed ? d.revealed - 1 : 0,
                    explored: d.explored
                };
            })
        };
        newFrame.duration = randDuration();
        newFrame.walkerIndex = tuple.index;
        newFrame.direction = tuple.direction;
        newFrame.topography[tuple.index].explored = true;
        newFrame.topography[tuple.index].revealed = revealFactor;
        newFrame = revealAdjacentChoices(tuple.index, newFrame);
        return newFrame;
    }

    /**
     * Same direction
     */
    var sameDirIndices = adjacentChoices.filter(function(d) {
        return d.direction === lastFrame.direction;
    })
    .map(function(d) {
        return {
            direction: '',
            index: d.index
        };
    });

    if (sameDirIndices.length) {
        return createNewFrame(sameDirIndices[0]);
    }

    /**
     * Unexplored
     */
    var unexploredIndices = adjacentChoices.filter(function(d) {
        return !lastFrame.topography[d.index].explored;
    });

    if (unexploredIndices.length) {
        return createNewFrame(VS.getItem(unexploredIndices));
    }

    /**
     * Explored
     * If all adjacent points are explored, move to the point with the lowest "reveal",
     * aligned with the "try to remember the past" instruction.
     */
    var exploredIndices = adjacentChoices.filter(function(d) {
        return lastFrame.topography[d.index].explored;
    });

    // In theory, this should never be thrown--but may be helpful catching errors in experimentation.
    if (!exploredIndices.length) {
        throw new Error('No available indices of any type');
    }

    function getRevealed(index) {
        return lastFrame.topography[index].revealed;
    }

    var exploredIndexLeastRevealed = [].concat(exploredIndices).sort(function(a, b) {
        return getRevealed(a.index) > getRevealed(b.index);
    })[0];

    return createNewFrame(exploredIndexLeastRevealed);
}