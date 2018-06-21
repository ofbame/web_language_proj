document.addEventListener('DOMContentLoaded', function() {

	var antimageSoundBoard;
	var stormspiritSoundBoard;

	/* *** JSON *** */
	
	var xhr = new XMLHttpRequest();
    if (typeof xhr.overrideMimeType === "function") { 
		xhr.overrideMimeType("application/json");  
	}else {
		// AJAX May not work in certain browsers where strict CORS policies exist!
	}
	var url = "sounds.json";
	
	

	xhr.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var soundboards = JSON.parse(this.responseText);

	        antimageSoundBoard = soundboards.boards[0];
	        stormspiritSoundBoard = soundboards.boards[1];
	    }
	};

	if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    	xhr.open("GET", url, true);

  	} else if (typeof XDomainRequest != "undefined") {

    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    	xhr = new XDomainRequest();
    	xhr.open(method, url);

  	} else {
    	// CORS is not supported by the browser.
    	// BUT TRY ANYWAY
    	xhr.open("GET", url, true);
    	alert("CORS is not supported for AJAX!");
  	}
	
	xhr.send();

	 /* ***Button Event Listeners*** */
	document.getElementById("light-theme").onclick = function() {
		changeToLightTheme();
	}

	document.getElementById("dark-theme").onclick = function() {
		changeToDarkTheme();
	}

	document.getElementById("antimage-sounds").onclick = function() {
		generateSoundboard(antimageSoundBoard);
	}

	document.getElementById("stormspirit-sounds").onclick = function() {
		generateSoundboard(stormspiritSoundBoard);
	}
	

}, false);

/* Takes in a soundboard array from the JSON */
function generateSoundboard(board) {

	//Clear soundboard before generating content
	var container = document.querySelector(".container-fluid");
	while(container.firstChild){
    	container.removeChild(container.firstChild);
	}

	//Generate Sound Tiles
	if ('content' in document.createElement("template")) {
		var numRows = 1;
		var numCols = 12;

		//Generates 3 rows of 4 columns
		var i, j;
		for (i = 0; i < numRows; i++) {
			//Generate row
			var rowDiv = document.createElement("div");
			rowDiv.setAttribute("class", "row");
			container.appendChild(rowDiv);

			for (j = 0; j < numCols; j++) {
				var num = (i * numCols) + j;
				//Generate columns
				rowDiv.appendChild(generateSoundtile(board.sounds[num].tileName, 
					board.sounds[num].soundFile, board.sounds[num].imageFile, num));
			}
		}
	}
}

/* Generates an individual sound tile */
function generateSoundtile(name, soundfile, imagefile, id) {

	//Sound tile id
	var soundID = "sound-" + id + "";

	//Access the template
	var tileTemplate = document.getElementById("soundtile-template");

	//Clone the template so we can edit it
	var clone = tileTemplate.content.cloneNode(true);

	//Edit the content of the template
	var tileText = clone.querySelector(".sound-title");
	var audioFile = clone.querySelector("audio");
	var imageFile = clone.querySelector("img");
	var playButton = clone.querySelector("button");

	tileText.textContent = name;

	audioFile.src = soundfile;
	audioFile.setAttribute("id", soundID);

	imageFile.src = imagefile;

	playButton.onclick = function() {
		document.getElementById(soundID).play()
	}

	return clone;
}

function changeToLightTheme() {
	var body = document.querySelector("body");
	var header = document.querySelector("header");
	var footer = document.querySelector("footer");
	var main = document.querySelector("main");
	var p = document.querySelector("p");
	var h4 = document.querySelector("h4");

	body.style.backgroundColor = "white";
	header.style.backgroundColor = "#EEEEEE";
	footer.style.backgroundColor = "#EEEEEE";
	main.style.backgroundColor = "white";
	p.style.color = "black";
	h4.style.color = "black";

	document.querySelector("footer > p").style.color = "black";
	document.querySelector("footer > h4").style.color = "black";
	document.querySelector('.sound-box').style.backgroundColor = '#40e8e8';
}

function changeToDarkTheme() {
	var body = document.querySelector("body");
	var header = document.querySelector("header");
	var footer = document.querySelector("footer");
	var main = document.querySelector("main");
	var p = document.querySelector("p");
	var h4 = document.querySelector("h4");

	body.style.backgroundColor = "black";
	header.style.backgroundColor = "#444444";
	footer.style.backgroundColor = "#444444";
	main.style.backgroundColor = "#222222";
	p.style.color = "white";
	h4.style.color = "white";

	document.querySelector("footer > p").style.color = "white";
	document.querySelector("footer > h4").style.color = "white";
	document.querySelector('.sound-box').style.backgroundColor = '#295d5d';
}

