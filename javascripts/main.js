"use strict";

let $ = require("jquery");
let controller = require("./controller");
let userFactory = require("./userFactory");
let db = require('./movieFactory');
let $container = $('.container');
let templates = require('./templateBuilder');


//When the user clicks the log in link, this calls the function to log them in with firebase
$("#log-on").click( function() {
	$("#log-out").addClass("hideIt");
	$(".messagePreLogin").addClass("hideIt");
	userFactory.logInGoogle()
	.then( (result) => {
		$("#search-bar").prop("disabled", false);
		let user = result.user.uid;
		console.log("user", user);
		$("#log-out").removeClass("hideIt");
		$(".messagePostLogin").removeClass("hideIt");

	});
});

//When the user clicks the log out link, this calls the function to log them out
//it also refreshes the page so that the user returns to the default website
$("#log-out").click( function() {
	$("#log-out").addClass("hideIt");
	userFactory.logOutGoogle();
	location.reload();
});

$(document).on("click", ".card-link", function() {
	let movieId = $(this).data("add-watch");
	$(`#${movieId}-add-watchlist`).addClass("hideIt");
	$(`#${movieId}-stars-container`).removeClass("hideIt");
	let title = $(`#${movieId}-title`).text();
	controller.addToWatchList(movieId, title);
});

$(document).on("click", ".star", function() {
	let thisStarIndex = $(this).attr("id").split("-");
	let starMovieId = thisStarIndex[0];
	console.log(thisStarIndex);
	for (let i = 1; i <= thisStarIndex[2]; i++) {
		document.getElementById(`${thisStarIndex[0]}-star-${i}`).classList.add("rated");
	}
});

$(document).keypress(function(e) {
  var key = e.which;
  if(key == 13) {
  	$container.html("");
    let searchValue = $("#search-bar").val();
      db.getMovies(searchValue);
      db.printUserMovies();
  }
 });

$("#unwatched").click(function() {
	$container.html("");
 	db.printUserMovies()
  	.then((movieData) => {
    	console.log("movieData", movieData);
    	console.log("object key?", Object.keys(movieData));
    	$.each(movieData, (index, movie) => {
      	if(movie.watched === false) {
      		console.log("movie", movie.cast);
        	let completedCard = templates.buildMovieCard(movie[index]);
       	 	$container.append(completedCard);
      	}
    });
  });
});
