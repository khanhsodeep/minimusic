const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const footInfo = $(".footer_info h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".footer_control");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".content_3");
const btnVolume = $(".volume");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Music 1",
      singer: "Singer 1",
      path: "./assets/music/music1.mp3",
      image: "./assets/img/img1.jpg",
      album: "Test"
    },
    {
      name: "Music 2",
      singer: "Singer 2",
      path: "./assets/music/music2.mp3",
      image: "./assets/img/img2.jpg",
      album: "Test"
    },
    {
      name: "Music 3",
      singer: "Singer 3",
      path: "./assets/music/music1.mp3",
      image: "./assets/img/img1.jpg",
      album: "Test"
    },
    {
        name: "Music 3",
        singer: "Singer 3",
        path: "./assets/music/music2.mp3",
        image: "./assets/img/img2.jpg",
        album: "Test"
      },
      {
        name: "Music 3",
        singer: "Singer 3",
        path: "./assets/music/music1.mp3",
        image: "./assets/img/img1.jpg",
        album: "Test"
      },
      {
        name: "Music 3",
        singer: "Singer 3",
        path: "./assets/music/music1.mp3",
        image: "./assets/img/img1.jpg",
        album: "Test"
      },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
    
      return `
      <table style="width: 100%">
            <tr class="song ${
                index === this.currentIndex ? "active" : ""
              }"  data-index=${index}>
              <td style="width: 10% ">${index}</td>
              <td  style="width: 50%">
                <div class="content_3_songs_title">
                  <img src="${song.image}" alt="" height="40" width="40">
                  <div class="content_3_songs_title-name">
                    <h6>${song.name}</h6>
                    <h6>${song.singer}</h6>
                  </div>
                </div>
              </td>
              <td  style="width: 30%;">${song.album}</td>
              <td style="width: 10%"></td>
            </tr>
   
      </table>
            `;
    });
    playlist.innerHTML = htmls.join("");
   
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    // Xu li CD quay / dung
    const cdThumbAnimate = cdThumb.animate(
      [
        { transform: "rotate(360deg)" }, //10s
      ],
      {
        duration: 10000,
        interations: Infinity,
      }
    );
    // cdThumbAnimate.pause();
    // xu li zoom in out CD
    // document.onscroll = function () {
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   const newCdWidth = cdWidth - scrollTop;
    //   cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    //   cd.style.opacity = newCdWidth / scrollTop;
    // };

    // Xu li khi onlick play

    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi bai hat duoc play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // khi bai hat duoc pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    // khi tien do thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // xu li khi tua
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // khi next song
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // khi prev song
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }

      audio.play();
      app.render();
      app.scrollToActiveSong();
    };
    // repeat songs
    repeatBtn.onclick = function (e) {
      // app.isRepeat = !app.isRepeat;
      // app.setConfig('isRepeat', app.isRepeat)
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    // xu li bat tat random song
    randomBtn.onclick = function (e) {
      // app.isRandom = !app.isRandom;
      // app.setConfig('isRandom', app.isRandom)
      randomBtn.classList.toggle("active", app.isRandom);
    };
    
    
    btnVolume.oninput=function(){
        audio.volume=  btnVolume.value/100
           console.log( btnVolume.value/100)
       };


    // xu li khi audio ended
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lang nghe hanh vi click vao songs
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      // xu li khi click vao song
      if (songNode || e.target.closest("option")) {
        //xu li khi click vao song
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          audio.play();
          app.render();
        }
        //xu li khi click vao option
        if (e.target.closest("option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
  },
  loadCurrentSong: function () {
    footInfo.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function(){
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // gan cau hinh tu config vao app  
    this.loadConfig();
    //   dinh nghia cac thuoc tinh cho object
    this.defineProperties();

    // lang nghe cac su kien (DOM Events)
    this.handleEvents();

    // tai thong tin bai hat
    this.loadCurrentSong();

    // render playlist
    this.render();
    // hien thi trasng thai ban dau
    // repeatBtn.classList.toggle("active", app.isRepeat);
    // randomBtn.classList.toggle("active", app.isRandom);
  },
};
app.start();

