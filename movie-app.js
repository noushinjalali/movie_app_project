// Selectors for DOM elements
const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const startTimerButton = document.getElementById("start-timer");
const timerMessage = document.getElementById("timer-message");
const elapsedTimeElement = document.getElementById("elapsed-time");
const sortOptions = document.getElementById("sort-options");
const filterOptions = document.getElementById("filter-options");
let elapsedSeconds = 0;
let moviesData = []; // Add this line to store fetched movies data

async function getMovies() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/noushinjalali/noushinjalali.github.io/main/data/movies.json");
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log('Fetched data:', data);  // Log the fetched data

    if (Array.isArray(data.movies)) {
      moviesData = data.movies; // Initialize global moviesData
    } else {
      throw new Error('Fetched data does not contain an array of movies');
    }
    
    displayMovies(moviesData); // Use moviesData for initial display
  } catch (error) {
    console.error('Fetch error:', error);
    movieList.innerHTML = `<p>Failed to load movies. Please try again later.</p>`;
  }
}

function displayMovies(movieArray) {
  movieList.innerHTML = "";
  
  movieArray.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    
    const moviePoster = document.createElement("img");
    moviePoster.src = movie.poster;
    movieCard.appendChild(moviePoster);
    
    const movieDetails = document.createElement("div");
    movieDetails.className = "movie-details";
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
    comment.className = "comment-section";
    movieCard.appendChild(comment);

    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment ...";
    comment.appendChild(commentInput);

    const commentButton = document.createElement("button");
    commentButton.textContent = "Submit";
    commentButton.addEventListener("click", function () {
      if (commentInput.value.trim() === "") {
        alert("Comment cannot be empty!");
      } else {
        addComment(movie, commentInput.value, comment);
        commentInput.value = "";
      }
    });

    comment.appendChild(commentButton);

    const starRating = document.createElement("div");
    starRating.className = "rating";
    let userRating = getSavedRating(movie) || 0;
    for (let i = 0; i < 5; i++) {
      const rating = document.createElement("span");
      rating.className = "star";
      rating.textContent = "★";
      rating.dataset.index = i + 1;
      if (i < userRating) rating.classList.add('rated');
      
      rating.addEventListener("mouseover", (e) => {
        const ratingValue = e.target.dataset.index;
        highlightStars(starRating, ratingValue);
      });
      
      rating.addEventListener("mouseout", () => {
        highlightStars(starRating, userRating);
      });

      rating.addEventListener("click", (e) => {
        userRating = e.target.dataset.index;
        highlightStars(starRating, userRating);
        saveRating(movie, userRating);
        if (userRating == 1){
          alert(`You have rated ${userRating} star to ${movie.title}`);
        } else {
          alert(`You have rated ${userRating} stars to ${movie.title}`);
        }
      });

      starRating.appendChild(rating);
    }
    movieCard.appendChild(starRating);

    displayComments(movie, comment);
    movieList.appendChild(movieCard);
  });
}

function highlightStars(starRating, ratingValue) {
  const stars = starRating.querySelectorAll(".star");
  stars.forEach((star, index) => {
    if (index < ratingValue) {
      star.classList.add('rated');
    } else {
      star.classList.remove('rated');
    }
  });
}

function filterMoviesByTitle(title) {
  const filteredMovies = moviesData.filter(movie => {
    return movie.title.toLowerCase().includes(title.toLowerCase());
  });
  displayMovies(filteredMovies);
}

function saveRating(movie, rating) {
  const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
  ratings[movie.title] = rating;
  localStorage.setItem('ratings', JSON.stringify(ratings));
}

function getSavedRating(movie) {
  const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
  return ratings[movie.title];
}

function addComment(movie, commentText, commentContainer) {
  const comments = JSON.parse(localStorage.getItem('comments')) || {};
  if (!comments[movie.title]) comments[movie.title] = [];
  comments[movie.title].push(commentText);
  localStorage.setItem('comments', JSON.stringify(comments));
  displayComments(movie, commentContainer);
}

function displayComments(movie, commentContainer) {
  const comments = JSON.parse(localStorage.getItem('comments')) || {};
  commentContainer.innerHTML = '';
  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.placeholder = "Add a comment ...";
  commentContainer.appendChild(commentInput);

  const commentButton = document.createElement("button");
  commentButton.textContent = "Submit";
  commentButton.addEventListener("click", function () {
    if (commentInput.value.trim() === "") {
      alert("Comment cannot be empty!");
    } else {
      addComment(movie, commentInput.value, commentContainer);
      commentInput.value = "";
    }
  });

  commentContainer.appendChild(commentButton);

  if (comments[movie.title]) {
    comments[movie.title].forEach((commentText, index) => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment";

      const commentTextNode = document.createElement("p");
      commentTextNode.textContent = commentText;
      commentDiv.appendChild(commentTextNode);

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "edit-button"; // Add class name for styling
      editButton.addEventListener("click", function () {
        const newComment = prompt("Edit your comment:", commentText);
        if (newComment !== null) {
          comments[movie.title][index] = newComment;
          localStorage.setItem('comments', JSON.stringify(comments));
          displayComments(movie, commentContainer);
        }
      });
      commentDiv.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button"; // Add class name for styling
      deleteButton.addEventListener("click", function () {
        comments[movie.title].splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
        displayComments(movie, commentContainer);
      });
      commentDiv.appendChild(deleteButton);

      commentContainer.appendChild(commentDiv);
    });
  }
}

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value;
  filterMoviesByTitle(searchValue);
});

startTimerButton.addEventListener("click", function () {
  const timerInput = document.getElementById("movie-pick-timer").value;
  let time = parseInt(timerInput) * 60; // Convert minutes to seconds

  const timerInterval = setInterval(() => {
    if (time <= 0) {
      clearInterval(timerInterval);
      alert("Time's up! Pick a movie!");
    } else {
      time--;
      timerMessage.textContent = `Time left: ${Math.floor(time / 60)}:${time % 60}`;
    }
  }, 1000);
});

setInterval(() => {
  elapsedSeconds++;
  elapsedTimeElement.textContent = `${elapsedSeconds} seconds`;
}, 1000);

function sortMoviesBy(criteria) {
  let sortedMovies = [...moviesData]; // Fix array copy here
  
  switch (criteria) {
    case "title":
      sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "genre":
      sortedMovies.sort((a, b) => a.genre.localeCompare(b.genre));
      break;
    case "director":
      sortedMovies.sort((a, b) => a.director.localeCompare(b.director));
      break;
    case "time":
      sortedMovies.sort((a, b) => a.time - b.time);
      break;
    case "price":
      sortedMovies.sort((a, b) => a.price - b.price);
      break;
    default:
      break;
  }
  
  displayMovies(sortedMovies);
}

function filterMoviesByDuration(duration) {
  let filteredMovies = [];
  
  switch (duration) {
    case "lessThan3Hours":
      filteredMovies = moviesData.filter(movie => movie.time < 180);
      break;
    case "moreThan3Hours":
      filteredMovies = moviesData.filter(movie => movie.time >= 180);
      break;
    default:
      break;
  }
  
  displayMovies(filteredMovies);
}

// Event listeners
sortOptions.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const sortCriterion = e.target.dataset.sort;
    sortMoviesBy(sortCriterion);
  }
});

filterOptions.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const filterCriterion = e.target.dataset.filter;
    filterMoviesByDuration(filterCriterion);
  }
});

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value;
  filterMoviesByTitle(searchValue);
});

getMovies();
