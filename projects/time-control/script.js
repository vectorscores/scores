var scoreEvents = {
	add: function(t){ this.events.push(t) },
	events: [],
	getLength: function(){ return this.events.length },
	playing: false,
	pointer: 0,
	preroll: 0, // 300; // delay before play
	timeAt: function(i){ return this.events[i] },
	allTimeouts: [],
	clearTimeouts: function() {
		this.allTimeouts.forEach(function(t){
			clearTimeout(t);
		});
	}
};
var btn = {
	play: document.getElementById("play"),
	stop: document.getElementById("stop"),
	fwd: document.getElementById("fwd"),
	back: document.getElementById("back")
};

function play(){
	if(!scoreEvents.playing){
		console.log('PLAY');
		scoreEvents.playing = true;
		btn.play.className = 'active';
		btn.play.textContent = '\u2016'; // pause
		btn.stop.className = '';
		btn.back.className = 'disabled';
		btn.fwd.className = 'disabled';
		schedule(scoreEvents.preroll, testEvent, scoreEvents.pointer);
	} else {
		console.log('PAUSED');
		scoreEvents.playing = false;
		btn.play.textContent = '\u25b9'; // play button
		scoreEvents.clearTimeouts();
		updateStepButtons();
	}
}
function stop(){
	console.log('STOPPED');
	scoreEvents.playing = false;
	updatePointer(0);
	btn.play.textContent = '\u25b9'; // play button
	btn.play.className = '';
	btn.stop.className = 'stopped';
	scoreEvents.clearTimeouts();
	updateStepButtons();

	// also clear active classes from elements
	var spanz = document.getElementsByTagName("span");
	for (var i = 0; i < spanz.length; i++) {
		var thisspan = spanz[i];
		thisspan.className = '';
	}
}

function schedule(time, fn, params) {
    console.log('sched ', params, ': ', time);
	// allTimeouts.push( setTimeout(fn, time, params) ); // not <IE9
	scoreEvents.allTimeouts.push( setTimeout(function(){ fn(params); }, time) ); // IE fix?
}
function updateStepButtons(){
	if(scoreEvents.pointer == 0) {
		btn.back.className = 'disabled';
		btn.fwd.className = '';
	} else if(scoreEvents.pointer == (scoreEvents.getLength() - 1)) {
		btn.back.className = '';
		btn.fwd.className = 'disabled';
	} else {
		btn.back.className = '';
		btn.fwd.className = '';
	}
}
updateStepButtons();
function updatePointer(ndex){
	scoreEvents.pointer = ndex;
	document.getElementById("pointer").value = ndex;
}
function stepPointer(num){
	if(!scoreEvents.playing) { // don't allow skip while playing, for now
		updatePointer(Math.min(Math.max(scoreEvents.pointer + num, 0), scoreEvents.getLength() - 1));
		updateStepButtons();
	}
}
function testEvent(ndex) {
	var id = scoreEvents.timeAt(ndex);
	updatePointer(ndex);
	// this is the only event-specific code
	// all else should be part of vs library
	setSpanActive(id, ndex);
	// ^^^
	// var id = scoreEvents.events[ndex];
	if (ndex < scoreEvents.getLength() - 1) {
		var diff = scoreEvents.timeAt(ndex+1) - id;
		schedule(diff, testEvent, ndex+1);
	} else {
		stop();
	}
}

//
// TEST events
//

// create events
var numvents = Math.floor(Math.random()*5) + 10;

function createSpan(eventTime){
	var spanel = document.createElement("span");
	spanel.setAttribute("id", eventTime);
	spanel.appendChild(document.createTextNode(eventTime));
	document.getElementById("events").appendChild(spanel);
}

// create first event
scoreEvents.add(0);
createSpan(0);

// create remaining events
for (var i = 0; i < numvents; i++) {
	var eventTime = Math.floor(Math.random()*500)+(i*1500)+1000;
	scoreEvents.add(eventTime);
	createSpan(eventTime);
}

// activate span
function setSpanActive(id, ndex){
	var thing = document.getElementById(id);
	console.log('event ', ndex, ': ', id);
	thing.setAttribute("class", "active");
}