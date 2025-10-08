const audio = document.getElementById('backgroundAudio');
const splash = document.getElementById('splash');
const textSpan = splash.querySelector('span');
const bgVideo = document.getElementById('bgVideo');
const mainFrame = document.getElementById('mainFrame');
const sideFrame = document.getElementById('sideFrame');
const btmFrame = document.getElementById('btmFrame');
const invites = [
  "djMQRCNAAZ",
  "yBG37e32XT"
];
const discordUserId = "950555329266065428";
const discordAvatarHash = "default";
const placeholderDisplayName = "mys";
const placeholderUsername = ".mys_fr";

function setUserData() {
  const pfpUrl = discordAvatarHash === "default"
    ? "https://i.pinimg.com/736x/66/78/7e/66787e293f540054e10aa49cd24b935a.jpg"
    : `https://cdn.discordapp.com/avatars/${discordUserId}/${discordAvatarHash}.webp?size=128`;
  document.getElementById("userPfp").src = pfpUrl;
  const displayNameElement = document.getElementById("userDisplayName");
  displayNameElement.textContent = '';
  typeUserDisplayName(displayNameElement);
  document.getElementById("userUsername").textContent = `@${placeholderUsername}`;
}

async function fetchServerData(invite) {
  try {
    const res = await fetch(`https://discord.com/api/v10/invites/${invite}?with_counts=true&with_expiration=true`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    const card = document.createElement("div");
    card.className = "server-card";
    const iconUrl = data.guild.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.webp?size=128`
      : "https://cdn.discordapp.com/embed/avatars/0.png";
    card.innerHTML = `
      <img src="${iconUrl}" class="server-icon" alt="Server Icon">
      <div class="server-info">
        <h2 class="server-name">${data.guild.name}</h2>
        <p class="server-stats">
          <span class="online">${data.approximate_presence_count} Online</span> •
          <span class="members">${data.approximate_member_count} Members</span>
        </p>
      </div>
      <a href="https://discord.gg/${invite}" target="_blank" class="join-btn">Join</a>
    `;
    document.getElementById("serverList").appendChild(card);
  } catch (err) {
    console.error("Error fetching server:", invite, err);
  }
}

invites.forEach(code => fetchServerData(code));
setUserData();

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
let velocityX = 0, velocityY = 0;

const rotationFactor = 15;
const stiffness = 0.1;
const damping = 0.9;
const wobbleFactor = 0.07;

let isHovering = false;

mainFrame.addEventListener('mouseenter', () => isHovering = true);
mainFrame.addEventListener('mouseleave', () => {
    isHovering = false;
    targetX = 0;
    targetY = 0;
});

mainFrame.addEventListener('mousemove', (e) => {
    if (!isHovering) return;
    const rect = mainFrame.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    targetX = mouseY * rotationFactor;
    targetY = mouseX * rotationFactor;
});

function animate3D() {
    const forceX = targetX - currentX;
    const forceY = targetY - currentY;

    velocityX += forceX * stiffness * wobbleFactor;
    velocityY += forceY * stiffness * wobbleFactor;

    velocityX *= damping;
    velocityY *= damping;

    currentX += velocityX;
    currentY += velocityY;

    mainFrame.style.transform = `
        rotateX(${-currentX}deg)
        rotateY(${currentY}deg)
    `;

    requestAnimationFrame(animate3D);
}

animate3D();

bgVideo.addEventListener('contextmenu', e => e.preventDefault());

const splashText = "click to view";
let splashIndex = 0;
let splashDeleting = false;

function typeSplashEffect() {
  let cursor = textSpan.querySelector('.cursor');
  if (!cursor) {
    cursor = document.createElement('span');
    cursor.className = 'cursor';
    textSpan.appendChild(cursor);
  }

  if (!splashDeleting) {
    if (splashIndex <= splashText.length) {
      textSpan.firstChild.textContent = splashText.substring(0, splashIndex);
      splashIndex++;
      setTimeout(typeSplashEffect, 225);
    } else {
      splashDeleting = true;
      setTimeout(typeSplashEffect, 1000);
    }
  } else {
    if (splashIndex > 0) {
      textSpan.firstChild.textContent = splashText.substring(0, splashIndex - 1);
      splashIndex--;
      setTimeout(typeSplashEffect, 100);
    } else {
      splashDeleting = false;
      textSpan.firstChild.textContent = '';
      setTimeout(typeSplashEffect, 0);
    }
  }
}

function initializeSplashText() {
  const textNode = document.createTextNode('');
  textSpan.insertBefore(textNode, textSpan.firstChild);
  typeSplashEffect();
}

initializeSplashText();

function typeUserDisplayName(element) {
  let cursor = element.querySelector('.cursor');
  if (!cursor) {
    cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.appendChild(cursor);
  }

  let index = 0;
  let deleting = false;
  const text = placeholderDisplayName;

  const textNode = document.createTextNode('');
  element.insertBefore(textNode, cursor);

  function type() {
    if (!deleting) {
      if (index <= text.length) {
        textNode.textContent = text.substring(0, index);
        index++;
        setTimeout(type, 550);
      } else {
        deleting = true;
        setTimeout(type, 225);
      }
    } else {
      if (index > 0) {
        textNode.textContent = text.substring(0, index - 1);
        index--;
        setTimeout(type, 335);
      } else {
        deleting = false;
        textNode.textContent = '';
        setTimeout(type, 0);
      }
    }
  }
  type();
}

bgVideo.style.filter = 'blur(32px)';

function fadeInAudio(audioElement, targetVolume = 0.2, duration = 4000) {
  audioElement.volume = 0;
  audioElement.play().catch(e => console.log(e));
  const stepTime = 50;
  const step = targetVolume / (duration / stepTime);
  const interval = setInterval(() => {
    if (audioElement.volume < targetVolume) {
      audioElement.volume = Math.min(audioElement.volume + step, targetVolume);
    } else {
      clearInterval(interval);
    }
  }, stepTime);
}

const audioList = [
  "https://github.com/mysisnotreal/audio/raw/refs/heads/main/tuff.mp3.mp3",
  "https://github.com/mysisnotreal/audio/raw/refs/heads/main/tuffer.mp3",
  "https://github.com/mysisnotreal/audio/raw/refs/heads/main/Different%20Music%20(kltekk%20Mix).mp3",
  "https://github.com/mysisnotreal/audio/raw/refs/heads/main/Too%20Legendary%20(A.T.%20mixxx).mp3",
  "https://github.com/mysisnotreal/audio/raw/refs/heads/main/Bank%20Specialist%20Mixxx.mp3",
  "https://github.com/mysisnotreal/audio/raw/refs/heads/main/EBK%20Jaaybo%20-%205K%20(Lyrics).mp3",
  "https://github.com/mysisnotreal/audio/raw/refs/heads/main/Klmhonos%20%E2%80%93%20This%20Love%20(Remix)%20%5BOfficial%20Video%5D.mp3"
];

let currentAudioIndex = Math.floor(Math.random() * audioList.length);
audio.src = audioList[currentAudioIndex];

audio.addEventListener('ended', () => {
  currentAudioIndex = (currentAudioIndex + 1) % audioList.length;
  audio.src = audioList[currentAudioIndex];
  audio.load();
  audio.play().catch(e => console.log(e));
});

splash.addEventListener('click', () => {
  fadeInAudio(audio, 0.2, 10000);
  splash.style.opacity = '0';
  bgVideo.style.filter = 'blur(0px)';
  setTimeout(() => {
    splash.style.display = 'none';
    mainFrame.style.opacity = '1';
    sideFrame.style.opacity = '1';
    btmFrame.style.opacity = '1';
  }, 1000);
});
