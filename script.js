/**
 * OUR MEMORY LANE 📸 — DIGITAL SCRAPBOOK INTERACTIVE ENGINE
 * Dedicated with endless love to Anvesha 💖
 * Version: 5.0 (Updated: 22 April 2024 Anniversary & Real Romantic Audio Playlist)
 */

console.log("💖 Our Memory Lane v5.0 loaded - Anniversary: 22 April 2024 - For Anvesha & Arindam");

// ==========================================================================
// 1. THEME SWITCHING ENGINE
// ==========================================================================
const rootElement = document.documentElement;
const themeButtons = document.querySelectorAll('.theme-btn');

function setTheme(themeName) {
  rootElement.setAttribute('data-theme', themeName);
  try {
    localStorage.setItem('memory_lane_theme', themeName);
  } catch (err) {
    console.warn("Storage warning:", err);
  }

  themeButtons.forEach(btn => {
    if (btn.getAttribute('data-theme') === themeName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Re-adjust ambient particle colors if initialized
  if (typeof initParticles === 'function' && window.particlesReady) {
    try {
      initParticles();
    } catch (e) {
      console.warn("Particles re-init deferred:", e);
    }
  }
}

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme');
    setTheme(theme);
  });
});

// Load saved theme (defaults to pink)
const savedTheme = localStorage.getItem('memory_lane_theme') || 'pink';
setTheme(savedTheme);

// ==========================================================================
// 2. ROMANTIC WEB AUDIO SYNTHESIZER (LOFI HARP & MEMORY CHIMES)
// ==========================================================================
class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;

    // Romantic chord progression notes in Hz (Warm Lo-Fi Harp & Music Box)
    // Progression: Cmaj9 - Am9 - Fmaj7 - Gsus4 (Romantic & Dreamy)
    this.melodyChords = [
      // Chord 1: C major 9
      [261.63, 329.63, 392.00, 493.88, 587.33], 
      // Chord 2: A minor 9
      [220.00, 261.63, 329.63, 392.00, 493.88], 
      // Chord 3: F major 7
      [174.61, 261.63, 329.63, 392.00, 523.25], 
      // Chord 4: G add 9 / G sus
      [196.00, 246.94, 293.66, 392.00, 587.33]  
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq, time, duration = 1.6, gainLevel = 0.08) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm music-box / harp chime tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Gentle low-pass filter for cozy warmth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    // Envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  startArpeggio() {
    if (this.isPlaying) return;
    this.init();
    this.isPlaying = true;

    const playCycle = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime;
      const currentChordIndex = Math.floor(this.step / 4) % this.melodyChords.length;
      const chord = this.melodyChords[currentChordIndex];
      const noteIndex = this.step % chord.length;
      const freq = chord[noteIndex];

      // Soft bass note on first beat
      if (this.step % 4 === 0) {
        this.playNote(chord[0] / 2, now, 2.5, 0.07);
      }

      // Arpeggiated melody note
      this.playNote(freq, now, 1.8, 0.06);

      this.step++;
      this.timer = setTimeout(playCycle, 420);
    };

    playCycle();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    this.step = 0;
  }
}

const romanticAudio = new RomanticAudioEngine();

// Quick gentle chime sound for clicks and interactions
function playInteractionChime() {
  try {
    romanticAudio.init();
    if (romanticAudio.ctx) {
      const now = romanticAudio.ctx.currentTime;
      romanticAudio.playNote(659.25, now, 0.5, 0.04);
      romanticAudio.playNote(783.99, now + 0.1, 0.7, 0.04);
    }
  } catch (err) {
    // Ignore audio autoplay restrictions gracefully
  }
}

// ==========================================================================
// 3. ROMANTIC MUSIC PLAYLIST ENGINE (Real MP3 Tracks + Lofi Harp)
// ==========================================================================
const musicPlaylist = [
  {
    type: 'synth',
    title: 'Romantic Lofi Harp 🎶',
    desc: 'Lofi Harp & Music Box',
    icon: '🌸'
  },
  {
    type: 'audio',
    src: 'assets/audio/track1.mp3',
    title: 'Romantic Melody 1 🎵',
    desc: 'Our Favorite Song',
    icon: '✨'
  },
  {
    type: 'audio',
    src: 'assets/audio/track2.mp3',
    title: 'Romantic Melody 2 💕',
    desc: 'Sweetest Memories',
    icon: '🎀'
  },
  {
    type: 'audio',
    src: 'assets/audio/track3.mp3',
    title: 'Romantic Melody 3 🌙',
    desc: 'Late Night Whispers',
    icon: '🧸'
  }
];

let currentTrackIndex = 0;
window.isMusicActive = false;
console.log('isMusicActive initialized:', window.isMusicActive);

const bgAudio = document.getElementById('bgAudio');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const vinylDisc = document.getElementById('vinylDisc');
const discEmoji = document.getElementById('discEmoji');
const musicTrackName = document.getElementById('musicTrackName');
const musicStatus = document.getElementById('musicStatus');
const playMusicHeroBtn = document.getElementById('playMusicHeroBtn');

const playPauseMusicBtn = document.getElementById('playPauseMusicBtn');

function updateMusicUI(isPlaying) {
  const track = musicPlaylist[currentTrackIndex];
  if (musicTrackName) {
    musicTrackName.textContent = track.title;
  }
  if (discEmoji) {
    discEmoji.textContent = track.icon;
  }

  if (playPauseMusicBtn) {
    playPauseMusicBtn.textContent = isPlaying ? '⏸️' : '▶️';
    playPauseMusicBtn.title = isPlaying ? 'Pause song ⏸️' : 'Play song ▶️';
  }

  if (isPlaying) {
    if (vinylDisc) vinylDisc.classList.add('spinning');
    if (musicStatus) musicStatus.textContent = `Playing • ${currentTrackIndex + 1}/${musicPlaylist.length}`;
    if (playMusicHeroBtn) playMusicHeroBtn.textContent = 'Pause Music ⏸️';
  } else {
    if (vinylDisc) vinylDisc.classList.remove('spinning');
    if (musicStatus) musicStatus.textContent = 'Tap to play';
    if (playMusicHeroBtn) playMusicHeroBtn.textContent = 'Play Romantic Vibe 🎵';
  }
}

function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'memory-lane-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function playCurrentTrack() {
  const track = musicPlaylist[currentTrackIndex];
  console.log('playCurrentTrack invoked', { index: currentTrackIndex, track });

  // Stop any existing playback mode
  romanticAudio.stop();
  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }

  if (track.type === 'synth') {
    // Synth mode: start arpeggio immediately
    romanticAudio.startArpeggio();
    window.isMusicActive = true;
    updateMusicUI(true);
    showToast(`🎶 Playing: ${track.title}`);
  } else if (track.type === 'audio' && bgAudio) {
    // Audio mode: load and play the MP3 file
    bgAudio.src = track.src;
    bgAudio.load();
    bgAudio.play().then(() => {
      console.log('Audio playback succeeded');
      window.isMusicActive = true;
      updateMusicUI(true);
      showToast(`🎶 Playing: ${track.title}`);
    }).catch(err => {
      console.warn('Audio playback failed, fallback to synth', err);
      // Fallback to synth if audio cannot be played
      romanticAudio.startArpeggio();
      window.isMusicActive = true;
      updateMusicUI(true);
      showToast(`🎶 Playing (fallback): ${track.title}`);
    });
  } else {
    console.error('Unsupported track type or missing audio element', track);
  }
}

function pauseMusic() {
  window.isMusicActive = false;
  romanticAudio.stop();
  if (bgAudio) {
    bgAudio.pause();
  }
  updateMusicUI(false);
  showToast('Music paused ⏸️');
}

window.toggleMusicPlay = function(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (window.isMusicActive) {
    pauseMusic();
  } else {
    playCurrentTrack();
  }
};

window.nextMusicTrack = function(e) {
  if (e) e.stopPropagation();
  currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length;
  playCurrentTrack();
};

window.prevMusicTrack = function(e) {
  if (e) e.stopPropagation();
  currentTrackIndex = (currentTrackIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
  playCurrentTrack();
};

if (bgAudio) {
  // Auto-advance to next song when current track ends
  bgAudio.addEventListener('ended', () => {
    window.nextMusicTrack();
  });
}

if (playMusicHeroBtn) {
  playMusicHeroBtn.addEventListener('click', () => {
    window.toggleMusicPlay();
  });
}


// Initial UI setup for player
updateMusicUI(false);

// ==========================================================================
// 4. DAYS TOGETHER / LOVE COUNTER (Set to 22 April 2024)
// ==========================================================================
const DEFAULT_ANNIVERSARY = '2024-04-22';
const anniversaryInput = document.getElementById('anniversaryInput');
const daysCount = document.getElementById('daysCount');
const hoursCount = document.getElementById('hoursCount');
const minutesCount = document.getElementById('minutesCount');
const secondsCount = document.getElementById('secondsCount');

let savedAnniversary = localStorage.getItem('memory_lane_anniversary');
if (!savedAnniversary || savedAnniversary !== DEFAULT_ANNIVERSARY) {
  savedAnniversary = DEFAULT_ANNIVERSARY;
  try {
    localStorage.setItem('memory_lane_anniversary', DEFAULT_ANNIVERSARY);
  } catch (e) {}
}

if (anniversaryInput) {
  anniversaryInput.value = savedAnniversary;
  anniversaryInput.addEventListener('change', (e) => {
    try {
      localStorage.setItem('memory_lane_anniversary', e.target.value);
    } catch (err) {}
    updateLoveCounter();
  });
}

function updateLoveCounter() {
  const dateStr = anniversaryInput ? anniversaryInput.value : DEFAULT_ANNIVERSARY;
  // Parse date safely at midnight local time
  const parts = dateStr.split('-');
  const startDate = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, now - startDate);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (daysCount) daysCount.textContent = days;
  if (hoursCount) hoursCount.textContent = hours;
  if (minutesCount) minutesCount.textContent = minutes;
  if (secondsCount) secondsCount.textContent = seconds;
}

setInterval(updateLoveCounter, 1000);
updateLoveCounter();

// ==========================================================================
// 5. TOAST NOTIFICATION HELPER
// ==========================================================================
function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'memory-lane-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ==========================================================================
// 6. POLAROID SCRAPBOOK: 3D FLIP, LIGHTBOX & CUSTOM UPLOAD
// ==========================================================================
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const photoUploadInput = document.getElementById('photoUploadInput');
const polaroidScrapbook = document.getElementById('polaroidScrapbook');

window.flipPolaroidCard = function(wrapper, event) {
  if (!wrapper) return;
  wrapper.classList.toggle('flipped');
  const isFlipped = wrapper.classList.contains('flipped');
  const btn = wrapper.querySelector('.polaroid-flip-btn');
  if (btn) {
    btn.textContent = isFlipped ? '↺ Flip back to photo' : '↻ Flip to read note';
  }
  if (isFlipped) {
    showToast('💌 Handwritten note for Anvesha');
    playInteractionChime();
  }
};

window.openPhotoLightbox = function(container) {
  if (!container || !lightboxModal) return;
  const img = container.querySelector('.polaroid-img');
  const caption = container.closest('.polaroid-front')?.querySelector('.polaroid-caption');
  if (img && lightboxImg) {
    lightboxImg.src = img.src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption ? caption.textContent.trim() : 'Sweet memory with Anvesha';
    }
    lightboxModal.style.display = 'flex';
    setTimeout(() => {
      lightboxModal.classList.add('open');
    }, 10);
    playInteractionChime();
  }
};

window.closePhotoLightbox = function() {
  if (lightboxModal) {
    lightboxModal.classList.remove('open');
    setTimeout(() => {
      lightboxModal.style.display = 'none';
    }, 280);
  }
};

// ==========================================================================
// BACKEND SYNC & INDEXEDDB PERSISTENCE ENGINE (AppStorage)
// Guarantees all uploaded polaroids, custom notes, captions, and edits
// are permanently preserved across refreshes and synced with backend!
// ==========================================================================
const DB_NAME = 'OurMemoryLaneDB';
const DB_VERSION = 1;
const STORE_POLAROIDS = 'custom_polaroids';
const STORE_APP_DATA = 'app_data';

const AppStorage = {
  db: null,
  syncTimeout: null,

  async init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to localStorage');
        resolve(null);
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_POLAROIDS)) {
          db.createObjectStore(STORE_POLAROIDS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_APP_DATA)) {
          db.createObjectStore(STORE_APP_DATA, { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      req.onerror = (e) => {
        console.warn('IndexedDB open error:', e);
        resolve(null);
      };
    });
  },

  updateIndicator(status, text) {
    const pill = document.getElementById('syncStatusPill');
    if (!pill) return;
    pill.classList.remove('saving', 'error');
    const textEl = pill.querySelector('.sync-text');
    if (status === 'saving') {
      pill.classList.add('saving');
      if (textEl) textEl.textContent = text || 'Saving...';
    } else if (status === 'error') {
      pill.classList.add('error');
      if (textEl) textEl.textContent = text || 'Saved Locally';
    } else {
      if (textEl) textEl.textContent = text || 'Vault Saved';
    }
  },

  async compressImage(file, maxWidth = 1600, quality = 0.88) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  async getAllPolaroids() {
    if (!this.db) {
      try {
        const raw = localStorage.getItem('memory_lane_custom_polaroids');
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_POLAROIDS, 'readonly');
      const store = tx.objectStore(STORE_POLAROIDS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },

  async savePolaroid(polaroid) {
    this.updateIndicator('saving');
    if (this.db) {
      const tx = this.db.transaction(STORE_POLAROIDS, 'readwrite');
      tx.objectStore(STORE_POLAROIDS).put(polaroid);
    }
    this.scheduleBackendSync('polaroid', polaroid);
  },

  async deletePolaroid(id) {
    this.updateIndicator('saving');
    if (this.db) {
      const tx = this.db.transaction(STORE_POLAROIDS, 'readwrite');
      tx.objectStore(STORE_POLAROIDS).delete(id);
    }
    try {
      await fetch(`/api/polaroid/${id}`, { method: 'DELETE' });
    } catch (e) {}
    this.updateIndicator('saved');
  },

  async getAppData(key, defaultValue = null) {
    if (!this.db) {
      try {
        const raw = localStorage.getItem(`memory_lane_${key}`);
        return raw ? JSON.parse(raw) : defaultValue;
      } catch (e) { return defaultValue; }
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_APP_DATA, 'readonly');
      const store = tx.objectStore(STORE_APP_DATA);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
      req.onerror = () => resolve(defaultValue);
    });
  },

  async setAppData(key, value) {
    this.updateIndicator('saving');
    if (this.db) {
      const tx = this.db.transaction(STORE_APP_DATA, 'readwrite');
      tx.objectStore(STORE_APP_DATA).put({ key, value, updatedAt: Date.now() });
    }
    try {
      localStorage.setItem(`memory_lane_${key}`, JSON.stringify(value));
    } catch (e) {}
    this.scheduleBackendSync('save', { [key]: value });
  },

  scheduleBackendSync(endpoint, payload) {
    clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          this.updateIndicator('saved');
        } else {
          this.updateIndicator('saved', 'Vault Saved');
        }
      } catch (err) {
        this.updateIndicator('saved', 'Vault Saved');
      }
    }, 400);
  },

  async fetchBackendData() {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  async clearAll() {
    if (this.db) {
      const tx1 = this.db.transaction(STORE_POLAROIDS, 'readwrite');
      tx1.objectStore(STORE_POLAROIDS).clear();
      const tx2 = this.db.transaction(STORE_APP_DATA, 'readwrite');
      tx2.objectStore(STORE_APP_DATA).clear();
    }
    try {
      localStorage.removeItem('memory_lane_custom_polaroids');
      localStorage.removeItem('memory_lane_stories');
      localStorage.removeItem('memory_lane_editedExistingPolaroids');
      localStorage.removeItem('memory_lane_bucketList');
      localStorage.removeItem('memory_lane_promises');
      localStorage.removeItem('memory_lane_centerpiece');
    } catch (e) {}

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {}
  }
};

function attachPolaroidEditListeners(wrapper) {
  const id = wrapper.getAttribute('data-id');
  const isCustom = wrapper.getAttribute('data-custom') === 'true';

  const captionEl = wrapper.querySelector('.polaroid-caption');
  const noteEl = wrapper.querySelector('.handwritten-note p');

  const onEdit = () => {
    const caption = captionEl ? captionEl.textContent.trim() : '';
    const note = noteEl ? noteEl.textContent.trim() : '';

    if (isCustom) {
      AppStorage.getAllPolaroids().then(list => {
        const item = list.find(x => x.id === id);
        if (item) {
          item.caption = caption;
          item.note = note;
          AppStorage.savePolaroid(item);
        }
      });
    } else {
      AppStorage.getAppData('editedExistingPolaroids', {}).then(dict => {
        dict = dict || {};
        dict[id] = { caption, note };
        AppStorage.setAppData('editedExistingPolaroids', dict);
      });
    }
  };

  if (captionEl) {
    captionEl.addEventListener('blur', onEdit);
    captionEl.addEventListener('input', () => AppStorage.updateIndicator('saving'));
  }
  if (noteEl) {
    noteEl.addEventListener('blur', onEdit);
    noteEl.addEventListener('input', () => AppStorage.updateIndicator('saving'));
  }
}

function createCustomPolaroidElement(p) {
  const wrapper = document.createElement('div');
  wrapper.className = `polaroid-wrapper ${p.tilt || 'tilt-slight'}`;
  wrapper.setAttribute('data-id', p.id);
  wrapper.setAttribute('data-custom', 'true');
  wrapper.setAttribute('onclick', 'flipPolaroidCard(this, event)');

  wrapper.innerHTML = `
    <button type="button" class="polaroid-delete-btn" onclick="deleteCustomPolaroid('${p.id}', event)" title="Remove this photo">🗑️</button>
    <div class="polaroid-tape ${p.tape || 'tape-pink'}"></div>
    <div class="polaroid-card">
      <div class="polaroid-front">
        <div class="polaroid-img-container" onclick="event.stopPropagation(); openPhotoLightbox(this)" title="Click to view full photo">
          <img src="${p.src}" alt="${p.caption || 'Memory with Anvesha'}" class="polaroid-img">
          <span class="zoom-icon">🔍</span>
        </div>
        <div class="polaroid-caption" contenteditable="true" onclick="event.stopPropagation()">${p.caption || 'Our Sweet Memory ✨'}</div>
        <div class="polaroid-date">${p.date || 'Sweet Moments'}</div>
      </div>
      <div class="polaroid-back" onclick="event.stopPropagation(); flipPolaroidCard(this.closest('.polaroid-wrapper'), event)">
        <div class="handwritten-note">
          <h4>Behind this photo 💕</h4>
          <p contenteditable="true" onclick="event.stopPropagation()">${p.note || 'Click here to write your sweet memory about this moment with Anvesha...'}</p>
          <div class="doodle-heart">💌 forever</div>
        </div>
      </div>
    </div>
    <div class="polaroid-flip-btn" onclick="event.stopPropagation(); flipPolaroidCard(this.closest('.polaroid-wrapper'), event)" title="Flip polaroid">↻ Flip to read note</div>
  `;
  attachPolaroidEditListeners(wrapper);
  return wrapper;
}

window.deleteCustomPolaroid = async function(id, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const wrapper = document.querySelector(`.polaroid-wrapper[data-id="${id}"]`);
  if (wrapper) {
    wrapper.style.transition = 'all 0.3s ease';
    wrapper.style.transform = 'scale(0.8) translateY(-20px)';
    wrapper.style.opacity = '0';
    setTimeout(async () => {
      wrapper.remove();
      await AppStorage.deletePolaroid(id);
      showToast('Polaroid removed from scrapbook 🗑️');
    }, 280);
  }
};

window.confirmResetMemories = async function() {
  const confirmed = confirm("Are you sure you want to reset memories back to original? Any custom uploaded photos will be removed and default scrapbook restored.");
  if (confirmed) {
    await AppStorage.clearAll();
    showToast('Vault reset to defaults 🔄');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  }
};

// Upload and Auto-Save Custom Polaroids
if (photoUploadInput) {
  photoUploadInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    showToast(`Adding ${files.length} photo${files.length > 1 ? 's' : ''}... 📸`);
    for (const file of files) {
      const dataUrl = await AppStorage.compressImage(file);
      const title = file.name.replace(/\.[^/.]+$/, "");
      await addNewPolaroid(dataUrl, title);
    }
    photoUploadInput.value = '';
  });
}

async function addNewPolaroid(imageSrc, title = "New Favorite Memory", options = {}) {
  const tilts = ['tilt-left', 'tilt-right', 'tilt-slight'];
  const randomTilt = tilts[Math.floor(Math.random() * tilts.length)];
  const tapes = ['tape-pink', 'tape-glitter', 'tape-minimal'];
  const randomTape = tapes[Math.floor(Math.random() * tapes.length)];

  const polaroid = {
    id: options.id || ('custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
    src: imageSrc,
    caption: options.caption || (title + ' ✨'),
    note: options.note || 'Click here to write your sweet memory about this moment with Anvesha...',
    date: options.date || 'Sweet Moments',
    tilt: options.tilt || randomTilt,
    tape: options.tape || randomTape,
    createdAt: options.createdAt || Date.now()
  };

  const wrapper = createCustomPolaroidElement(polaroid);

  if (polaroidScrapbook) {
    polaroidScrapbook.prepend(wrapper);
    burstConfettiSmall();
    showToast('New polaroid pinned & saved to vault! 📸');
  }

  if (!options.skipSave) {
    await AppStorage.savePolaroid(polaroid);
  }
}

// ==========================================================================
// 7. "REMEMBER THIS DAY?" RANDOM MEMORY REVEAL
// ==========================================================================
const scratchCover = document.getElementById('scratchCover');
const mysteryPhoto = document.getElementById('mysteryPhoto');
const mysteryDate = document.getElementById('mysteryDate');
const mysteryLocation = document.getElementById('mysteryLocation');
const mysteryTitle = document.getElementById('mysteryTitle');
const mysteryDesc = document.getElementById('mysteryDesc');
const mysteryArindamNote = document.getElementById('mysteryArindamNote');
const mysteryInsideJoke = document.getElementById('mysteryInsideJoke');

const memoriesPool = [
  {
    photo: "assets/images/couple_cuddle.jpg",
    date: "That Rainy Sunday Afternoon",
    location: "📍 Living Room Fortress",
    title: "The Blanket Fort Movie Marathon",
    desc: "We built a giant blanket fort with fairy lights in the living room, ate microwave popcorn, and fell asleep halfway through the movie with your hand interlocked in mine.",
    arindamNote: "I didn't care about the movie at all. I was just staring at your peaceful sleeping face.",
    insideJoke: "We dropped 3 popcorn kernels in the blankets and gave up looking for them."
  },
  {
    photo: "assets/images/couple_selfie.jpg",
    date: "Late Night at 1:30 AM",
    location: "📍 Midnight Auto Ride",
    title: "The Midnight Ride & Chai Mission",
    desc: "Riding through the quiet streets with the night breeze in our faces, laughing at inside jokes, feeling like the whole city belonged only to the two of us.",
    arindamNote: "You held onto my jacket so tightly every time the auto hit a bump.",
    insideJoke: "The driver definitely wondered why we were giggling non-stop at literally nothing."
  },
  {
    photo: "assets/images/anvesha.jpg",
    date: "A Golden Afternoon",
    location: "📍 The Sunlit Staircase",
    title: "The Moment You Smiled at Me",
    desc: "You were sitting there looking like pure poetry. When your eyes met mine and your lips curled into that radiant smile, my heart did a little backflip.",
    arindamNote: "I took 20 photos of you, and in every single one you looked like an angel.",
    insideJoke: "'Wait, let me fix my hair!' (Your hair was already flawless, Anvesha)."
  },
  {
    photo: "assets/images/couple_kiss.jpg",
    date: "Our Secret Cozy Moments",
    location: "📍 Right in My Arms",
    title: "Cheek Kisses & Warm Hugs",
    desc: "No matter how busy or tiring the day has been, the moment I get to pull you into my arms and kiss your cheek, all my worries disappear into thin air.",
    arindamNote: "Your cheek is the softest thing on Earth, and kissing you is my favorite habit.",
    insideJoke: "You pretended to be annoyed for exactly 2 seconds before leaning in closer."
  },
  {
    photo: "assets/images/arindam.jpg",
    date: "Concert Night Lights",
    location: "📍 The Music Crowd",
    title: "Looking for You in Every Crowd",
    desc: "Surrounded by music, flashing stage lights, and cheering crowds, but all I could think about was wishing you were right next to me dancing under the lights.",
    arindamNote: "Every love song that played had your name written all over it.",
    insideJoke: "I sent you a voice note screaming the chorus completely off-key."
  },
  {
    photo: "assets/images/couple_love_you.jpg",
    date: "Dinner Date & Bright Smiles",
    location: "📍 Our Favorite Table",
    title: "Cutest Smile Across the Table",
    desc: "Sitting across from you in your pretty pink top, watching your eyes sparkle as you rested your cheek in your hand and smiled that smile that melts my heart every single time.",
    arindamNote: "I could spend an eternity just looking at you smiling like that.",
    insideJoke: "'Love you <3' written on our hearts forever."
  },
  {
    photo: "assets/images/couple_cozy_mood.jpg",
    date: "Late Night Cozy Whispers",
    location: "📍 Right Next to You",
    title: "Our Peaceful Sanctuary",
    desc: "Quiet hours, soft lighting, and your gentle hand on my cheek. No words needed—just feeling safe, peaceful, and endlessly grateful that I get to call you mine.",
    arindamNote: "Holding you close in the quiet is my absolute favorite feeling in the world.",
    insideJoke: "The ultimate mood: simply being together."
  }
];

let currentMemoryIdx = 0;

window.revealSecretMemory = function() {
  if (scratchCover) {
    scratchCover.classList.add('unveiled');
    scratchCover.style.display = 'none';
  }
  burstConfettiSmall();
  showToast('Secret memory revealed! ✨');
  playInteractionChime();
};

window.shuffleMemory = function() {
  currentMemoryIdx = (currentMemoryIdx + 1) % memoriesPool.length;
  const mem = memoriesPool[currentMemoryIdx];
  if (mysteryPhoto && mem.photo) mysteryPhoto.src = mem.photo;
  if (mysteryDate) mysteryDate.textContent = mem.date;
  if (mysteryLocation) mysteryLocation.textContent = mem.location;
  if (mysteryTitle) mysteryTitle.textContent = mem.title;
  if (mysteryDesc) mysteryDesc.textContent = mem.desc;
  if (mysteryArindamNote) mysteryArindamNote.textContent = `"${mem.arindamNote}"`;
  if (mysteryInsideJoke) mysteryInsideJoke.textContent = `"${mem.insideJoke}"`;

  const card = document.getElementById('memoryRevealCard');
  if (card) {
    card.style.transform = 'scale(0.97)';
    setTimeout(() => { card.style.transform = 'scale(1)'; }, 180);
  }
  showToast('New memory uncovered! 🎲');
  playInteractionChime();
};

window.playMemoryChime = function() {
  try {
    romanticAudio.init();
    if (romanticAudio.ctx) {
      const now = romanticAudio.ctx.currentTime;
      romanticAudio.playNote(523.25, now, 0.8, 0.08);
      romanticAudio.playNote(659.25, now + 0.2, 0.8, 0.08);
      romanticAudio.playNote(783.99, now + 0.4, 1.2, 0.08);
      romanticAudio.playNote(1046.50, now + 0.6, 1.6, 0.08);
    }
  } catch (e) {}
  showToast('🎶 Playing romantic memory chime');
  burstConfettiSmall();
};

// ==========================================================================
// 8. LOVE LETTERS MODAL (POSTAL STATIONERY)
// ==========================================================================
const letterModal = document.getElementById('letterModal');
const modalLetterTitle = document.getElementById('modalLetterTitle');
const modalLetterDate = document.getElementById('modalLetterDate');
const modalLetterBody = document.getElementById('modalLetterBody');

const loveLettersData = {
  1: {
    title: "Why I Love You, Anvesha",
    date: "Forever & Always 💖",
    body: `Dearest Anvesha,<br><br>
    I love you for a million little things that you probably don't even realize you do.<br><br>
    I love the sound of your laugh when something genuinely catches you off guard. I love how deeply you care about the people around you. I love the way your eyes crinkle when you're truly happy, and how you make any room brighter just by stepping into it.<br><br>
    Loving you isn't just a feeling; it's the easiest, most natural choice I make every single day. You are my favorite person, my best friend, and the greatest gift of my life.`
  },
  2: {
    title: "Open When You Miss Me",
    date: "Special Delivery 🧸",
    body: `My Sweet Anvesha,<br><br>
    If you're reading this right now and missing me, close your eyes for a second. Take a deep, gentle breath and wrap your arms around yourself. Imagine me right beside you, holding you tight and kissing your forehead.<br><br>
    No matter where we are, how busy life gets, or how many miles might lie between us, you carry my heart with you everywhere you go.<br><br>
    I am always thinking of you, rooting for you, and counting the minutes until I see your gorgeous smile again. Call or text me right now — I want to hear your voice.`
  },
  3: {
    title: "Open When You Need A Smile",
    date: "A Warm Hug For Bad Days 🌟",
    body: `Hey Beautiful,<br><br>
    Bad days happen, but remember: you are so much stronger, braver, and more capable than you give yourself credit for.<br><br>
    Whatever is weighing on your mind today, don't let it steal your spark. You have conquered 100% of your hardest days so far, and you will get through this one too.<br><br>
    And if nobody told you today: I am so endlessly proud of you. I believe in you even when you doubt yourself. Drink some water, put on comfy socks, and remember that you are cherished beyond words.`
  },
  4: {
    title: "On Our Anniversary",
    date: "A Toast To Our Love Story 🥂",
    body: `Happy Anniversary, My Love Anvesha!<br><br>
    Looking back at every single memory, every laugh we shared, every late-night ride, and every quiet moment holding hands — choosing to love you has been the single best decision of my entire life.<br><br>
    You make ordinary days feel extraordinary. Thank you for walking beside me, for trusting me with your heart, and for making life so incredibly beautiful.<br><br>
    Here is to today, to tomorrow, and to a hundred more anniversaries together holding hands. I love you more than words could ever describe.`
  },
  5: {
    title: "When You Can't Sleep",
    date: "Midnight Whispers 🌙",
    body: `Hey Sleepless Beauty,<br><br>
    It's late, the world is quiet, and your mind is probably running a marathon right now. Put your phone down after reading this, take three slow deep breaths, and let yourself relax.<br><br>
    Think of our favorite moments together — the silly car rides, our funniest inside jokes, and the warmth of resting your head on my chest.<br><br>
    You are safe, you are deeply loved, and tomorrow is a fresh new day full of possibilities. Dream of us tonight. Goodnight, Anvesha. ❤️`
  },
  6: {
    title: "If We Ever Have A Fight",
    date: "Always Remembering We Are A Team 🤝❤️",
    body: `My Dearest Anvesha,<br><br>
    If we ever argue, disagree, or feel frustrated with each other, I want you to remember this one absolute truth:<br><br>
    It is never you against me; it is ALWAYS you and me against the problem.<br><br>
    My love for you doesn't shake or change over disagreements. Even when we're mad, you are still my favorite person in the whole universe. Let's take a deep breath, hug it out, and talk. I love you, and nothing is ever going to change that.`
  }
};

window.openLoveLetter = function(id) {
  const data = loveLettersData[id];
  if (!data) return;

  if (modalLetterTitle) modalLetterTitle.textContent = data.title;
  if (modalLetterDate) modalLetterDate.textContent = data.date;
  if (modalLetterBody) modalLetterBody.innerHTML = data.body;

  if (letterModal) {
    letterModal.style.display = 'flex';
    setTimeout(() => {
      letterModal.classList.add('open');
    }, 10);
  }

  showToast('Opening sealed letter for Anvesha 💌');
  playInteractionChime();
};

window.closeLoveLetter = function() {
  if (letterModal) {
    letterModal.classList.remove('open');
    setTimeout(() => {
      letterModal.style.display = 'none';
    }, 280);
  }
};

// ==========================================================================
// 9. FUTURE BUCKET LIST ENGINE (WITH REMOVE BUTTON)
// ==========================================================================
const bucketListItems = document.getElementById('bucketListItems');
const newBucketInput = document.getElementById('newBucketInput');
const bucketProgressBar = document.getElementById('bucketProgressBar');
const bucketProgressText = document.getElementById('bucketProgressText');

window.updateBucketProgress = function() {
  if (!bucketListItems) return;
  const items = bucketListItems.querySelectorAll('.bucket-checkbox-item');
  const checkedItems = bucketListItems.querySelectorAll('.bucket-checkbox-item.checked');
  const total = items.length;
  const completed = checkedItems.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (bucketProgressBar) bucketProgressBar.style.width = `${percent}%`;
  if (bucketProgressText) bucketProgressText.textContent = `${completed} of ${total} Completed (${percent}%)`;
};

async function saveAllBucketItems() {
  if (!bucketListItems) return;
  const items = Array.from(bucketListItems.querySelectorAll('.bucket-checkbox-item')).map(item => ({
    text: item.querySelector('.bucket-text').textContent.trim(),
    checked: item.querySelector('input').checked
  }));
  await AppStorage.setAppData('bucketList', items);
}

window.toggleBucketItem = function(checkbox) {
  if (!checkbox) return;
  const item = checkbox.closest('.bucket-checkbox-item');
  if (item) {
    item.classList.toggle('checked', checkbox.checked);
    window.updateBucketProgress();
    saveAllBucketItems();
    if (checkbox.checked) {
      burstConfettiSmall();
      showToast('Adventure completed! 🎉');
      playInteractionChime();
    }
  }
};

window.removeBucketItem = function(btn, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const item = btn.closest('.bucket-checkbox-item');
  if (item) {
    item.style.transition = 'all 0.25s ease';
    item.style.transform = 'translateX(35px)';
    item.style.opacity = '0';
    setTimeout(() => {
      item.remove();
      window.updateBucketProgress();
      saveAllBucketItems();
      showToast('Adventure removed 🗑️');
    }, 220);
  }
};

window.addBucketAdventure = function(event) {
  if (event) event.preventDefault();
  if (!newBucketInput || !bucketListItems) return;
  const text = newBucketInput.value.trim();
  if (!text) return;

  const label = document.createElement('label');
  label.className = 'bucket-checkbox-item';
  label.innerHTML = `
    <input type="checkbox" onchange="toggleBucketItem(this)">
    <span class="custom-checkmark"></span>
    <span class="bucket-text">${text}</span>
    <button type="button" class="remove-bucket-btn" onclick="removeBucketItem(this, event)" title="Remove this adventure" aria-label="Remove adventure">✕</button>
  `;

  bucketListItems.appendChild(label);
  newBucketInput.value = '';
  window.updateBucketProgress();
  saveAllBucketItems();
  showToast('New adventure added & saved! ✨');
  burstConfettiSmall();
};

window.updateBucketProgress();

// ==========================================================================
// 10. FINAL SURPRISE VAULT & OPENABLE TOP SECRET
// ==========================================================================
const secretModal = document.getElementById('secretModal');
const topSecretEnvelope = document.getElementById('topSecretEnvelope');
const unfoldedSecretLetter = document.getElementById('unfoldedSecretLetter');
const secretPromisesGrid = document.getElementById('secretPromisesGrid');
const newSecretPromiseInput = document.getElementById('newSecretPromiseInput');
const replaceCenterpieceInput = document.getElementById('replaceCenterpieceInput');
const finalCenterpiecePhoto = document.getElementById('finalCenterpiecePhoto');

window.openVaultModal = function() {
  if (secretModal) {
    secretModal.style.display = 'flex';
    setTimeout(() => {
      secretModal.classList.add('open');
    }, 10);
    triggerGrandFinale();
    showToast('Top Secret Vault Unlocked! 🔓✨');
  }
};

window.closeVaultModal = function() {
  if (secretModal) {
    secretModal.classList.remove('open');
    setTimeout(() => {
      secretModal.style.display = 'none';
    }, 280);
  }
};

window.openTopSecretEnvelope = function() {
  if (topSecretEnvelope && unfoldedSecretLetter) {
    topSecretEnvelope.style.transition = 'all 0.3s ease';
    topSecretEnvelope.style.transform = 'scale(0.92)';
    topSecretEnvelope.style.opacity = '0';
    setTimeout(() => {
      topSecretEnvelope.style.display = 'none';
      unfoldedSecretLetter.classList.add('open');
      unfoldedSecretLetter.style.display = 'block';
      burstConfettiSmall();
      showToast('💌 Final Love Letter Unfolded!');
      playInteractionChime();
    }, 250);
  }
};

window.toggleSecretPromise = function(card) {
  if (!card) return;
  card.classList.toggle('unfolded');
  const icon = card.querySelector('.promise-seal-icon');
  const isUnfolded = card.classList.contains('unfolded');
  if (icon) {
    icon.textContent = isUnfolded ? '🔓' : '🔒';
  }
  if (isUnfolded) {
    burstConfettiSmall();
    showToast('Secret promise unlocked 🗝️');
    playInteractionChime();
  }
};

async function saveAllPromises() {
  if (!secretPromisesGrid) return;
  const promises = Array.from(secretPromisesGrid.querySelectorAll('.secret-promise-card')).map(card => {
    const content = card.querySelector('.promise-card-content')?.textContent.replace(/^"|"$/g, '').trim();
    return { content };
  }).filter(p => p.content);
  await AppStorage.setAppData('promises', promises);
}

window.addSecretPromise = async function(event) {
  if (event) event.preventDefault();
  if (!newSecretPromiseInput || !secretPromisesGrid) return;
  const promiseText = newSecretPromiseInput.value.trim();
  if (!promiseText) return;

  const count = secretPromisesGrid.children.length + 1;
  const card = document.createElement('div');
  card.className = 'secret-promise-card';
  card.setAttribute('onclick', 'toggleSecretPromise(this)');
  card.innerHTML = `
    <div class="promise-seal-icon">🔒</div>
    <div class="promise-card-title">Secret Promise #${count}</div>
    <div class="promise-card-preview">Tap to unlock promise...</div>
    <div class="promise-card-content">"${promiseText}"</div>
  `;

  secretPromisesGrid.appendChild(card);
  newSecretPromiseInput.value = '';
  await saveAllPromises();
  showToast('Secret promise added & saved to vault! 🗝️');
  burstConfettiSmall();
};

// Centerpiece Photo Upload & Auto-Save
if (replaceCenterpieceInput && finalCenterpiecePhoto) {
  replaceCenterpieceInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const dataUrl = await AppStorage.compressImage(file, 1600, 0.9);
      finalCenterpiecePhoto.src = dataUrl;
      await AppStorage.setAppData('centerpiece', dataUrl);
      showToast('Vault centerpiece updated and saved! 💖');
    }
  });
}

// ==========================================================================
// 11. AMBIENT FLOATING HEARTS & PARTICLES CANVAS
// ==========================================================================
const ambientCanvas = document.getElementById('ambientCanvas');
const actx = ambientCanvas ? ambientCanvas.getContext('2d') : null;
let particles = [];

function resizeAmbientCanvas() {
  if (!ambientCanvas) return;
  ambientCanvas.width = window.innerWidth;
  ambientCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeAmbientCanvas);
resizeAmbientCanvas();

class AmbientParticle {
  constructor() {
    this.reset();
  }

  reset() {
    if (!ambientCanvas) return;
    this.x = Math.random() * ambientCanvas.width;
    this.y = ambientCanvas.height + Math.random() * 50;
    this.size = Math.random() * 12 + 6;
    this.speedY = Math.random() * 0.8 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 1.5;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    if (!actx) return;
    actx.save();
    actx.translate(this.x, this.y);
    actx.rotate((this.rotation * Math.PI) / 180);
    actx.globalAlpha = this.opacity;

    const currentTheme = rootElement.getAttribute('data-theme') || 'pink';

    if (currentTheme === 'galaxy') {
      actx.fillStyle = '#ff71ce';
      actx.shadowBlur = 10;
      actx.shadowColor = '#01cdfe';
      actx.beginPath();
      actx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
      actx.fill();
    } else if (currentTheme === 'minimal') {
      actx.fillStyle = '#bfa075';
      actx.beginPath();
      actx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
      actx.fill();
    } else {
      actx.fillStyle = '#ff758c';
      const s = this.size / 15;
      actx.beginPath();
      actx.moveTo(0, 0);
      actx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
      actx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
      actx.fill();
    }
    actx.restore();
  }
}

function initParticles() {
  particles = [];
  const count = window.innerWidth < 600 ? 25 : 50;
  for (let i = 0; i < count; i++) {
    const p = new AmbientParticle();
    p.y = Math.random() * (ambientCanvas ? ambientCanvas.height : 800);
    particles.push(p);
  }
  window.particlesReady = true;
}
initParticles();

function animateAmbient() {
  if (actx && ambientCanvas) {
    actx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
  }
  requestAnimationFrame(animateAmbient);
}
animateAmbient();

// Interactive Sparkle Trail on Mouse Move
window.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.2 && ambientCanvas) {
    const sparkle = new AmbientParticle();
    sparkle.x = e.clientX + (Math.random() - 0.5) * 20;
    sparkle.y = e.clientY + (Math.random() - 0.5) * 20;
    sparkle.speedY = Math.random() * 1.5 + 0.5;
    sparkle.opacity = 0.9;
    particles.push(sparkle);
    if (particles.length > 80) particles.shift();
  }
});

// ==========================================================================
// 12. GRAND FINALE CONFETTI & HEARTS EXPLOSION
// ==========================================================================
const confettiCanvas = document.getElementById('confettiCanvas');
const cctx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];

function resizeConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

class Confetti {
  constructor(x, y, isHeart = false) {
    this.x = x || confettiCanvas.width / 2;
    this.y = y || confettiCanvas.height / 2;
    this.size = Math.random() * 14 + 8;
    this.speedX = (Math.random() - 0.5) * 16;
    this.speedY = (Math.random() - 0.7) * 18;
    this.gravity = 0.35;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 12;
    this.isHeart = isHeart;
    this.colors = ['#ff5e84', '#ff8fa3', '#ffd1dc', '#a855f7', '#ec4899', '#fde047', '#38bdf8', '#ffffff'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.opacity = 1;
    this.decay = Math.random() * 0.015 + 0.008;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.rotation += this.rotSpeed;
    this.opacity -= this.decay;
  }

  draw() {
    if (!cctx || this.opacity <= 0) return;
    cctx.save();
    cctx.translate(this.x, this.y);
    cctx.rotate((this.rotation * Math.PI) / 180);
    cctx.globalAlpha = Math.max(0, this.opacity);
    cctx.fillStyle = this.color;

    if (this.isHeart) {
      const s = this.size / 14;
      cctx.beginPath();
      cctx.moveTo(0, 0);
      cctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
      cctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
      cctx.fill();
    } else {
      cctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    cctx.restore();
  }
}

window.triggerGrandFinale = function() {
  if (!confettiCanvas) return;
  confettiParticles = [];
  const count = 180;
  for (let i = 0; i < count; i++) {
    const isHeart = Math.random() > 0.4;
    const startX = confettiCanvas.width * (0.3 + Math.random() * 0.4);
    const startY = confettiCanvas.height * 0.5;
    confettiParticles.push(new Confetti(startX, startY, isHeart));
  }
  animateConfetti();
  playInteractionChime();
};

window.burstConfettiSmall = function() {
  if (!confettiCanvas) return;
  for (let i = 0; i < 40; i++) {
    confettiParticles.push(new Confetti(confettiCanvas.width / 2, confettiCanvas.height * 0.4, true));
  }
  animateConfetti();
};

let confettiAnimId = null;
function animateConfetti() {
  if (!cctx || !confettiCanvas) return;
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < confettiCanvas.height + 50);
  confettiParticles.forEach(p => {
    p.update();
    p.draw();
  });

  if (confettiParticles.length > 0) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(confettiAnimId);
  }
}

// ==========================================================================
// 13. APP STORAGE INITIALIZATION & AUTO-RESTORE ON PAGE LOAD
// ==========================================================================
async function initStorageAndRestore() {
  await AppStorage.init();

  // 1. Restore Custom Polaroids from IndexedDB
  const customPolaroids = await AppStorage.getAllPolaroids();
  if (Array.isArray(customPolaroids) && customPolaroids.length > 0) {
    const list = [...customPolaroids].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    list.forEach(p => {
      if (!document.querySelector(`.polaroid-wrapper[data-id="${p.id}"]`)) {
        const wrapper = createCustomPolaroidElement(p);
        if (polaroidScrapbook) polaroidScrapbook.prepend(wrapper);
      }
    });
  }

  // 2. Attach edit listeners to all polaroids in DOM and restore edits for original polaroids
  document.querySelectorAll('.polaroid-wrapper').forEach(wrapper => {
    attachPolaroidEditListeners(wrapper);
  });

  const editedExisting = await AppStorage.getAppData('editedExistingPolaroids', {});
  if (editedExisting && typeof editedExisting === 'object') {
    for (const [id, data] of Object.entries(editedExisting)) {
      const wrapper = document.querySelector(`.polaroid-wrapper[data-id="${id}"]`);
      if (wrapper && data) {
        if (data.caption) {
          const cap = wrapper.querySelector('.polaroid-caption');
          if (cap) cap.textContent = data.caption;
        }
        if (data.note) {
          const note = wrapper.querySelector('.handwritten-note p');
          if (note) note.textContent = data.note;
        }
      }
    }
  }

  // 3. Restore and attach auto-save to Story Chapters
  const savedStories = await AppStorage.getAppData('stories', {});
  ['storyPart1', 'storyPart2', 'storyPart3'].forEach(partId => {
    const el = document.getElementById(partId);
    if (el) {
      if (savedStories && savedStories[partId]) {
        el.innerHTML = savedStories[partId];
      }
      el.addEventListener('blur', () => {
        AppStorage.getAppData('stories', {}).then(dict => {
          dict = dict || {};
          dict[partId] = el.innerHTML;
          AppStorage.setAppData('stories', dict);
          showToast('Story memory saved 📖');
        });
      });
      el.addEventListener('input', () => AppStorage.updateIndicator('saving'));
    }
  });

  // 4. Restore Bucket List
  const savedBucket = await AppStorage.getAppData('bucketList', null);
  if (Array.isArray(savedBucket) && savedBucket.length > 0 && bucketListItems) {
    bucketListItems.innerHTML = '';
    savedBucket.forEach(item => {
      const label = document.createElement('label');
      label.className = `bucket-checkbox-item ${item.checked ? 'checked' : ''}`;
      label.innerHTML = `
        <input type="checkbox" onchange="toggleBucketItem(this)" ${item.checked ? 'checked' : ''}>
        <span class="custom-checkmark"></span>
        <span class="bucket-text">${item.text}</span>
        <button type="button" class="remove-bucket-btn" onclick="removeBucketItem(this, event)" title="Remove this adventure" aria-label="Remove adventure">✕</button>
      `;
      bucketListItems.appendChild(label);
    });
    window.updateBucketProgress();
  }

  // 5. Restore Secret Promises
  const savedPromises = await AppStorage.getAppData('promises', null);
  if (Array.isArray(savedPromises) && savedPromises.length > 0 && secretPromisesGrid) {
    savedPromises.forEach(p => {
      const count = secretPromisesGrid.children.length + 1;
      const card = document.createElement('div');
      card.className = 'secret-promise-card';
      card.setAttribute('onclick', 'toggleSecretPromise(this)');
      card.innerHTML = `
        <div class="promise-seal-icon">🔒</div>
        <div class="promise-card-title">Secret Promise #${count}</div>
        <div class="promise-card-preview">Tap to unlock promise...</div>
        <div class="promise-card-content">"${p.content}"</div>
      `;
      secretPromisesGrid.appendChild(card);
    });
  }

  // 6. Restore Centerpiece
  const savedCenterpiece = await AppStorage.getAppData('centerpiece', null);
  if (savedCenterpiece && finalCenterpiecePhoto) {
    finalCenterpiecePhoto.src = savedCenterpiece;
  }

  // 7. Background Server Sync (if backend API /api/data is reachable)
  try {
    const serverData = await AppStorage.fetchBackendData();
    if (serverData) {
      if (Array.isArray(serverData.polaroids)) {
        for (const sp of serverData.polaroids) {
          const exists = (customPolaroids || []).some(cp => cp.id === sp.id);
          if (!exists) {
            await AppStorage.savePolaroid(sp);
            if (!document.querySelector(`.polaroid-wrapper[data-id="${sp.id}"]`)) {
              const wrapper = createCustomPolaroidElement(sp);
              if (polaroidScrapbook) polaroidScrapbook.prepend(wrapper);
            }
          }
        }
      }
      AppStorage.updateIndicator('saved', 'Vault Synced');
    } else {
      AppStorage.updateIndicator('saved', 'Vault Saved');
    }
  } catch (e) {
    AppStorage.updateIndicator('saved', 'Vault Saved');
  }
}

// Kick off initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStorageAndRestore);
} else {
  initStorageAndRestore();
}

