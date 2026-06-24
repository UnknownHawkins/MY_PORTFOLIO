"use client";

let audioCtx: AudioContext | null = null;
let clickBuffer: AudioBuffer | null = null;
let hoverBuffer: AudioBuffer | null = null;

// Fallback HTML5 Audio instances
let clickAudio: HTMLAudioElement | null = null;
let hoverAudio: HTMLAudioElement | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

// Programmatic trimming of leading silence from loaded AudioBuffers
const trimLeadingSilence = (buffer: AudioBuffer): AudioBuffer => {
  const threshold = 0.001; // Silence amplitude threshold
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;

  let firstNonSilentIndex = length;

  // Gather channels PCM data
  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c));
  }

  // Find the first sample that exceeds the threshold in any channel
  for (let i = 0; i < length; i++) {
    let isSilent = true;
    for (let c = 0; c < numChannels; c++) {
      if (Math.abs(channelData[c][i]) > threshold) {
        isSilent = false;
        break;
      }
    }
    if (!isSilent) {
      firstNonSilentIndex = i;
      break;
    }
  }

  // If no silence or all silence, return original
  if (firstNonSilentIndex === 0 || firstNonSilentIndex === length) {
    return buffer;
  }

  // Create a new trimmed buffer
  const trimmedLength = length - firstNonSilentIndex;
  const ctx = getAudioContext();
  if (!ctx) return buffer;

  try {
    const trimmedBuffer = ctx.createBuffer(numChannels, trimmedLength, sampleRate);
    for (let c = 0; c < numChannels; c++) {
      const trimmedData = trimmedBuffer.getChannelData(c);
      const originalData = channelData[c];
      trimmedData.set(originalData.subarray(firstNonSilentIndex));
    }
    console.debug(`[Sound] Trimmed ${firstNonSilentIndex} silent samples (~${((firstNonSilentIndex / sampleRate) * 1000).toFixed(2)} ms) from audio.`);
    return trimmedBuffer;
  } catch (err) {
    console.debug("[Sound] Failed to create trimmed buffer, returning original:", err);
    return buffer;
  }
};

const loadSound = async (url: string): Promise<AudioBuffer | null> => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    if (!ctx) return null;
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    return trimLeadingSilence(decoded);
  } catch (err) {
    console.debug("Failed to load sound buffer:", url, err);
    return null;
  }
};

// Initialize listeners and preload sound buffers
if (typeof window !== "undefined") {
  const resumeContext = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch((err) => console.debug("Resume failed:", err));
    }
  };

  // Listen for early user interactions to resume the AudioContext ASAP
  const interactionEvents = ["click", "keydown", "mousedown", "pointerdown", "touchstart"];
  interactionEvents.forEach((event) => {
    window.addEventListener(event, resumeContext, { once: true, capture: true });
  });

  // Preload and decode buffers immediately
  loadSound("/assets/click sound.wav").then((buffer) => {
    clickBuffer = buffer;
  });
  loadSound("/assets/hoversound.wav").then((buffer) => {
    hoverBuffer = buffer;
  });
}

export const playClickSound = () => {
  if (typeof window === "undefined") return;
  if (clickBuffer) {
    try {
      const ctx = getAudioContext();
      if (!ctx) throw new Error("No context");
      
      if (ctx.state === "suspended") {
        ctx.resume().catch((err) => console.debug("Click resume failed:", err));
      }
      
      const source = ctx.createBufferSource();
      source.buffer = clickBuffer;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.25;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      return;
    } catch (e) {
      console.debug("Web Audio click play failed, falling back:", e);
    }
  }

  // Fallback to HTML5 Audio
  try {
    if (!clickAudio) {
      clickAudio = new Audio("/assets/click sound.wav");
      clickAudio.volume = 0.25;
    }
    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => {});
  } catch (err) {
    console.debug("Click fallback play failed:", err);
  }
};

export const playHoverSound = () => {
  if (typeof window === "undefined") return;
  if (hoverBuffer) {
    try {
      const ctx = getAudioContext();
      if (!ctx) throw new Error("No context");
      
      if (ctx.state === "suspended") {
        ctx.resume().catch((err) => console.debug("Hover resume failed:", err));
      }
      
      const source = ctx.createBufferSource();
      source.buffer = hoverBuffer;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.15;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      return;
    } catch (e) {
      console.debug("Web Audio hover play failed, falling back:", e);
    }
  }

  // Fallback to HTML5 Audio
  try {
    if (!hoverAudio) {
      hoverAudio = new Audio("/assets/hoversound.wav");
      hoverAudio.volume = 0.15;
    }
    hoverAudio.currentTime = 0;
    hoverAudio.play().catch(() => {});
  } catch (err) {
    console.debug("Hover fallback play failed:", err);
  }
};
