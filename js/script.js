const wrapper = document.querySelector(".wrapper");
const thumbnail = wrapper.querySelector(".image-area img");
const song = wrapper.querySelector(".song-details .name");
const artist = wrapper.querySelector(".song-details .artist");
const audio = wrapper.querySelector("#audio");
const control_sync = wrapper.querySelector(".play-pause");
const back_track = wrapper.querySelector("#prev");
const step_ahead = wrapper.querySelector("#next");
const control_area = wrapper.querySelector(".progress-area");
const flow_control = wrapper.querySelector(".progress-bar");
const loopify = wrapper.querySelector("#repeat");
const beat_queue = wrapper.querySelector(".music-list");
const more_beats = wrapper.querySelector("#more-music");
const fade_out = beat_queue.querySelector("#close");
const ul = wrapper.querySelector("ul");

let music_index = Math.floor((Math.random() * music.length) + 1);

for (let i=0; i<music.length; i++) {
    let li = `
        <li li-index=${i+1}>
            <div class="row">
                <span>${music[i].name}</span>
                <p>${music[i].artist}</p>
            </div>
            <audio src="${music[i].path}" class="${music[i].path.split("/").pop().split(".").shift()}"></audio>
            <span class="audio-duration" id=${music[i].path.split("/").pop().split(".").shift()}>${music[i].path}</span>
        </li>
    `;
    ul.insertAdjacentHTML("beforeend", li);

    let li_audio_tag = ul.querySelector(`.${music[i].path.split("/").pop().split(".").shift()}`);
    let li_audio_duration = ul.querySelector(`#${music[i].path.split("/").pop().split(".").shift()}`);

    li_audio_tag.addEventListener("loadeddata", function() {
        let audio_duration = li_audio_tag.duration;
        let minutes = Math.floor(audio_duration / 60);
        let seconds = Math.floor(audio_duration % 60);

        li_audio_duration.innerText = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        li_audio_duration.setAttribute("t-duration", `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    });
}

function loadSongs(index) {
    song.innerText = music[index - 1].name;
    artist.innerText = music[index - 1].artist;
    thumbnail.src = music[index - 1].thumbnail;
    audio.src = music[index - 1].path;
}

function play() {
    wrapper.classList.remove("play");
    wrapper.classList.add("paused");
    control_sync.querySelector("i").innerText = "pause";
    audio.play();
}

function pause() {
    wrapper.classList.remove("paused");
    wrapper.classList.add("play");
    control_sync.querySelector("i").innerText = "play_arrow";
    audio.pause();
}

function trackRewind() {
    music_index--;
    music_index < 1 ? music_index = music.length : music_index = music_index;
    loadSongs(music_index);
    play();
    playingNow();
}

function trackLeap() {
    music_index++;
    music_index > music.length ? music_index = 1 : music_index = music_index;
    loadSongs(music_index);
    play();
    playingNow();
}

function playingNow() {
    const li_collections = ul.querySelectorAll("li");

    for (let i=0; i<li_collections.length; i++) {
        let audio_tag = li_collections[i].querySelector(".audio-duration");

        if (li_collections[i].classList.contains("playing")) {
            li_collections[i].classList.remove("playing");
            audio_tag.innerText = audio_tag.getAttribute("t-duration");

        }

        if (li_collections[i].getAttribute("li-index") == music_index) {
            li_collections[i].classList.add("playing");
            audio_tag.innerText = "now listening...";
        }

        li_collections[i].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let li_index = element.getAttribute("li-index");
    music_index = li_index;
    loadSongs(music_index);
    play();
    playingNow();
}

window.addEventListener("load", function() {
    loadSongs(music_index);
    playingNow();
});

control_sync.addEventListener("click", function() {
    const is_paused = wrapper.classList.contains("paused");
    is_paused ? pause() : play();
    playingNow();
});

back_track.addEventListener("click", function() {
    trackRewind();
});

step_ahead.addEventListener("click", function() {
    trackLeap();
});

audio.addEventListener("timeupdate", function(e) {
    const current_time = e.target.currentTime;
    const duration = e.target.duration;

    let progress_width = (current_time / duration) * 100;
    let playback_time = wrapper.querySelector(".current");
    let track_duration = wrapper.querySelector(".duration");

    flow_control.style.width = `${progress_width}%`;
    
    audio.addEventListener("loadeddata", function() {
        let audio_duration = audio.duration;
        let total_minutes = Math.floor(audio_duration / 60);
        let total_seconds = Math.floor(audio_duration % 60);

        track_duration.innerText = `${total_minutes < 10 ? "0" + total_minutes : total_minutes}:${total_seconds < 10 ? "0" + total_seconds : total_seconds}`;
    });

    let current_minutes = Math.floor(current_time / 60);
    let current_seconds = Math.floor(current_time % 60);

    playback_time.innerText = `${current_minutes < 10 ? "0" + current_minutes : current_minutes}:${current_seconds < 10 ? "0" + current_seconds : current_seconds}`;
});

control_area.addEventListener("click", function(e) {
    let control_value = control_area.clientWidth;
    let clicked_offsetX = e.offsetX;
    let audio_duration = audio.duration;

    audio.currentTime = (clicked_offsetX / control_value) * audio_duration;
    play();
});

loopify.addEventListener("click", function() {
    let symbol = loopify.innerText;

    switch (symbol) {
        case "repeat":
            loopify.innerText = "repeat_one";
            loopify.setAttribute("title", "song looped");
            break;
        
        case "repeat_one":
            loopify.innerText = "shuffle";
            loopify.setAttribute("title", "playback shuffle");
            break;
        
        case "shuffle":
            loopify.innerText = "repeat";
            loopify.setAttribute("title", "playlist lopped");
            break;

        default: break;
    };
});

audio.addEventListener("ended", function() {
    let symbol = loopify.innerText;

    switch (symbol) {
        case "repeat":
            trackLeap();
            break;
        
        case "repeat_one":
            audio.currentTime = 0;
            loadSongs(music_index);
            play();
            break;
        
        case "shuffle":
            let random_index = Math.floor((Math.random() * music.length) + 1);
            
            do {
                random_index = Math.floor((Math.random() * music.length) + 1);
            } while (music_index == random_index);

            music_index = random_index;
            loadSongs(music_index);
            play();
            playingNow();
            break;

        default: break;
    };
});

more_beats.addEventListener("click", function() {
    beat_queue.classList.add("show");
});

fade_out.addEventListener("click", function() {
    beat_queue.classList.remove("show");
});