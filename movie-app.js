const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const sortInput = document.getElementById("sort-input");

const movies = [
  {
    id: 1,
    title: "Interstellar",
    year: 2014,
    genre: "Adventure, Drama, Science Fiction",
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    director: "Christopher Nolan",
    poster:
      "https://www.themoviedb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    time: "2h 49m",
    price: "$99.00",
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    genre: "Action, Science Fiction, Adventure",
    overview:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious.",
    director: "Christopher Nolan",
    poster:
      "https://www.themoviedb.org/t/p/w1280/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    time: "2h 28m",
    price: "$99.00",
  },
  {
    id: 3,
    title: "Shutter Island",
    year: 2010,
    genre: "Drama, Thriller, Mystery",
    overview:
      "World War II soldier-turned-U.S. Marshal Teddy Daniels investigates the disappearance of a patient from a hospital for the criminally insane, but his efforts are compromised by troubling visions and a mysterious doctor.",
    director: "Martin Scorsese",
    poster:
      "https://www.themoviedb.org/t/p/w1280/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg",
    time: "2h 18m",
    price: "$79.00",
  },
  {
    id: 4,
    title: "Hamlet",
    year: 1990,
    genre: "Drama, History",
    overview:
      "Hamlet, Prince of Denmark, returns home to find his father murdered and his mother now marrying the murderer... his uncle. Meanwhile, war is brewing.",
    director: "Kenneth Branagh",
    poster:
      "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ilurgUOp6SCl4cuhfjctj1qxlfZ.jpg",
    time: "4h 2m",
    price: "$99.00",
  },
];

function displayMovies(movieArray) {
  movieList.innerHTML = "";
  // Clear the existing movie list

  movieArray.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    // Create <div class="movie-card">

    const moviePoster = document.createElement("img");
    moviePoster.src = movie.poster;
    movieCard.appendChild(moviePoster);
    // Create <img src="..."> to add the poster

    const movieDetails = document.createElement("div");
    movieDetails.className = "movie-details";
    // Create <div class="movie-details">
    movieDetails.innerHTML = `
      <h2>${movie.title}</h2>
      <p>${movie.genre}</p>
      <p><strong>Overview:</strong> ${movie.overview}</p>
      <p><strong>Director:</strong> ${movie.director}</p>
      <p><strong>Time:</strong> ${movie.time}</p>
      <p><strong>Price:</strong> ${movie.price}</p>
    `;
    movieCard.appendChild(movieDetails);

    const comment = document.createElement("div");
    // Create <div class="comment">
    comment.className = "comment";
    movieCard.appendChild(comment);

    const commentInput = document.createElement("input");
    // Create <input type="text" placeholder="Add a comment ...">
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment ...";
    comment.appendChild(commentInput);

    const commentButton = document.createElement("button");
    commentButton.textContent = "Submit";
    // Create <button>Submit<button> as comment child
    commentButton.addEventListener("click", function () {
      const commentText = document.createElement("p");
      // create a p element for when a comment inputs.
      commentText.textContent = commentInput.value;
      //text content of p element is equal to inputting comment.
      comment.appendChild(commentText);
      //if commentText (<p>) created append as comment child.
      commentInput.value = "";
      //defined the default of input value as empty.
    });
    comment.appendChild(commentButton);

    const starRating = document.createElement("div");
    starRating.className = "rating";
    for (let i = 0; i < 5; i++) {
      //create 5 stars
      const rating = document.createElement("span");
      rating.id = "star";
      rating.textContent = "★";
      rating.dataset.index = i + 1;
      rating.addEventListener("click", (e) => {
        const ratingValue = e.target.dataset.index;
        if (ratingValue == 1) {
          alert(`You have rated ${ratingValue} star to ${movie.title}`);
        } else {
          alert(`You have rated ${ratingValue} stars to ${movie.title}`);
        }
      });
      starRating.appendChild(rating);
    }
    movieCard.appendChild(starRating);
    movieList.appendChild(movieCard);
  });
}

displayMovies(movies);
// Corrected from movieArray to movies

// Timer to pick a movie
const timerSection = document.getElementById("timer-section");
const timerInput = document.getElementById("movie-pick-timer");
const timerButton = document.getElementById("start-timer");
const timerMessage = document.getElementById("timer-message");

timerButton.addEventListener("click", () => {
  const minutes = parseInt(timerInput.value); //convert a string to an integer
  if (isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid number of minutes.");
    return;
  }

  //when user inputs a time
  timerMessage.textContent = `You have ${minutes} minutes to pick a movie.`;

  //set a countdown timer
  setTimeout(() => {
    alert("Time's up! Pick a movie now.");
    timerMessage.textContent = "";
  }, minutes * 60 * 1000); //convert the input minutes to millisecond
});

// Timer to show elapsed time on the page
const elapsedTimeSection = document.getElementById("elapsed-timer-section");
const elapsedTimeText = document.getElementById("elapsed-time");

let elapsedSeconds = 0;
setInterval(() => {
  elapsedSeconds++;
  elapsedTimeText.textContent = `${elapsedSeconds} seconds`;
}, 1000); //every 1 second
