var antimageSoundBoard;
var stormspiritSoundBoard;
$(function(){
	var url = "sounds.json";
	$.ajax({
		url: url,
		complete: function(jqXHR, textStatus) {
			if( jqXHR.readyState == 4 && jqXHR.status== 200) {
				var soundboards = JSON.parse(jqXHR.responseText);
	        	antimageSoundBoard = soundboards.boards[0];
	        	stormspiritSoundBoard = soundboards.boards[1];
			}else {
				alert("Did not get 200 Status. Received: " + jqXHR.status);
			}
		}
	});
});

 /* ***Button Event Listeners*** */

$('#light-theme').on('click', function() {
	changeToLightTheme();
});

$('#dark-theme').on('click', function() {
	changeToDarkTheme();
});
$('#antimage-sounds').on('click', function() {
	generateSoundboard(antimageSoundBoard);
});

$('#stormspirit-sounds').on('click', function() {
	generateSoundboard(stormspiritSoundBoard);
});

/* Takes in a soundboard array from the JSON */
function generateSoundboard(board) {

	//Clear soundboard before generating content
	var $container = $('.container-fluid');
	$container.empty();

	//Generate Sound Tiles
	//https://jsperf.com/jquery-vs-createelement
	if( !$('template').length ) {
		var num = 12;
		var $rowDiv = $(document.createElement("div"));
		$rowDiv.addClass("row");
		$container.append($rowDiv);
		for(var i=0; i < num; i++) {
			$rowDiv.append( generateSoundtile(board.sounds[num].tileName, 
					board.sounds[num].soundFile, board.sounds[num].imageFile, num));
		}
	}else{
		alert("template tag not found on page :( !");
	}


}

/* Generates an individual sound tile */
function generateSoundtile(name, soundfile, imagefile, id) {

	//Sound tile id
	var soundID = "sound-" + id + "";

	//Access the template
	var $tileTemplate = $('#soundtile-template');

	//Clone the template so we can edit it
	var $clone = $tileTemplate.clone();

	//Edit the content of the template
	var $tileText = $(".sound-title", $clone);
	var $audioFile = $("audio", $clone);
	var $imageFile = $("img",$clone);
	var $playButton = $("button",$clone);

	$tileText.text() = name;

	$audioFile.attr('src', soundfile);
	$audioFile.attr("id", soundID);

	$imageFile.attr('src', imagefile);

	$playButton.on('click', function() {
		$('#'+soundID).play();
	});

	return clone;
}

function changeToLightTheme() {

	$('body').css('backgroundColor', 'white');
	$('header').css('backgroundColor',"#EEEEEE");
	$('footer').css('backgroundColor',"#EEEEEE");
	$('main').css('backgroundColor', "white");
	$('p').css('color',"black");
	$('h4').css('color',"black");

	$("footer > p").css('color',"black");
	$("footer > h4").css('color', "black");
	$('.sound-box').css('backgroundColor', '#40e8e8');
}

function changeToDarkTheme() {
	$('body').css('backgroundColor', 'black');
	$('header').css('backgroundColor',"#444444");
	$('footer').css('backgroundColor',"#444444");
	$('main').css('backgroundColor', "#222222");
	$('p').css('color',"white");
	$('h4').css('color',"white");

	$("footer > p").css('color',"white");
	$("footer > h4").css('color', "white");

	$('.sound-box').css('backgroundColor', '#295d5d');
}

