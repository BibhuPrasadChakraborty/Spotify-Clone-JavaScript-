const posterClick = document.querySelector(".poster_container");
const songlist = document.querySelector(".songsList");
const song_title = document.querySelector("#song-name");
const audioCircle = document.querySelector(".circular_container");
// const song_audio = document.querySelector("#song-audio");

// accessing the audio buttons.
const play_icon = document.querySelector("#playicon");
const previous_icon = document.querySelector("#previousicon");
const next_icon = document.querySelector("#nexticon");

// accessing the timings of the songs.
const current_time = document.querySelector("#current_time");
const total_duration = document.querySelector("#total_duration");

// This function is all about getting the song
async function getsongs() {
  const serverURL = await fetch("http://127.0.0.1:5500/mp3/");
  const response = await serverURL.text();
  const div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let songList = Array.from(anchor)
    .filter((a) => a.href.endsWith("mp3"))
    .map((a) => a.href);
  return songList;
}

const songs = getsongs();
function playsong() {
  songs.forEach((song, index) => {
    let list = creatingSongElement("li");
    list.textContent = `Song ${index + 1}`;
  });
}

// This function will extract the song title from the mp3 file
function extractSongTitle(url) {
  const filename = url.split("/").pop();
  const title = decodeURIComponent(filename.replace(".mp3", ""));
  return title;
}

// **** Important function********************************
// this function will play the song
let currentAudio = null;
async function play_particularsong(songurl) {
  const songs = await getsongs();
  currentSongIndex = songs.indexOf(songurl);
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(songurl);
  audio_progress(currentAudio);
  currentAudio.play();
  audio_playPause();
  play_icon.src = "icons/playicon.svg";
  song_title.textContent = extractSongTitle(songurl);

  audio_timing(currentAudio);
}

// USER INTERECTION ACTION CONCEPT
// When I will click on the song poster, a songlist are going to appear.
posterClick.addEventListener("click", () => {
  console.log("Poster Clicked");
  creatingSongElement();
});

// function to update the audiotime & the progressbar
// this function contains the process of loading the metadata first, letting the previous functionality happens first then the time
function audio_progress(audio) {
  audio.addEventListener("loadedmetadata", () => {
    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      audioCircle.style.left = `${progress}%`;
    });
  });
}

// function to play-pause the song & will also change the sign
function audio_playPause() {
  play_icon.addEventListener("click", () => {
    if (currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play();
        play_icon.src = "icons/pauseicon.svg";
      } else {
        currentAudio.pause();
        play_icon.src = "icons/playicon.svg";
      }
    }
  });
}

// Add this function to display current time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Update your audio_progress function
function audio_timing(audio) {
  audio.addEventListener("loadedmetadata", () => {
    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      audioCircle.style.left = `${progress}%`;

      // Get current time and duration
      const currentTime = formatTime(audio.currentTime);
      const totalDuration = formatTime(audio.duration);

      // Display times (assuming you have elements with these IDs)
      current_time.textContent = currentTime;
      total_duration.textContent = totalDuration;
    });
  });
}

let currentSongIndex = 0;
async function next_song() {
  const songs = await getsongs();
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  play_particularsong(songs[currentSongIndex]);
  console.log("clicked next song");
}

// setting up the search bar.
const searchBar = document.querySelector("#search_bar");

async function search_for_songs() {
  const searchQuery = searchBar.value.toLowerCase().trim();
  const songs = await getsongs();
  const filteredSongs = songs.filter((song) =>
    song.toLowerCase().includes(searchQuery)
  );

  if (searchQuery === filteredSongs.length) {
    searchBar.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        play_particularsong(filteredSongs[0]);
      }
    });
  }
}

async function previous_song() {
  const songs = await getsongs();
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  play_particularsong(songs[currentSongIndex]);
  console.log("clicked previous song");
}

next_icon.addEventListener("click", next_song);
previous_icon.addEventListener("click", previous_song);
// This function will create the entire list of the song element

async function creatingSongElement() {
  let songList = await getsongs();

  songList.forEach((song) => {
    const songElement = document.createElement("div");
    songElement.className = "song-name";
    songElement.innerHTML =
      songElement.innerHTML +
      ` <div class="song-info">
              <img src="icons/music play.svg" alt="MusicPlay" class="icons music_icons" >

              <div class="songname">
                        ${song.replaceAll("%", " ")}
              </div>
              <div class="playnow_artist_container">
                       <h1 class="playnow">Play Now</h1>
                       <h1 class="artist-names">Bryce Savage</h1>
              </div>           
        </div>
        `;

    songlist.appendChild(songElement);
    songElement.addEventListener("click", () => {
      play_particularsong(song);

      // song_title.textContent = songElement.textContent;
      // song_audio.src = song;
    });
  });
}

// THE LOGIN FUNCTINALITY

// accessing the login button
const login_Button = document.querySelector("#login_btn");
const login_Container = document.querySelector("#loginContainer");

// function to validate the login

function validateLogin() {
  // Toggle login container
  login_Button.addEventListener("click", function () {
    const login_Container = document.getElementById("loginContainer");
    login_Container.style.display =
      login_Container.style.display === "none" ||
      login_Container.style.display === ""
        ? "flex"
        : "none";
  });

  // Close login when clicking outside the login box
  login_Container.addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
    }
  });

  console.log("clicked for login function");
}

validateLogin();

const signup_btn = document.querySelector("#sign_up");
const form_container = document.querySelector("#formContainer");
const signUP_enter = document.querySelector("#signupBtn");

function signin_func() {
  signup_btn.addEventListener("click", (e) => {

    form_container.style.display =
      form_container.style.display === "none" ||
      form_container.style.display === ""
        ? "flex"
        : "none";
  });

  // Close login when clicking outside the login box
  form_container.addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
      
    }
  });
}
signin_func();
