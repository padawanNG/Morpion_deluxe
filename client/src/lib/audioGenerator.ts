// Generate relaxing audio tones for game interactions
export const createRelaxingAudio = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Create a soft, gentle click sound
  const createClickSound = (): HTMLAudioElement => {
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const envelope = Math.exp(-i / (audioContext.sampleRate * 0.03));
      data[i] = Math.sin(800 * 2 * Math.PI * i / audioContext.sampleRate) * 0.3 * envelope;
    }
    
    return bufferToAudio(buffer);
  };

  // Create a soft placement sound (lower frequency)
  const createPlacementSound = (): HTMLAudioElement => {
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.2, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const envelope = Math.exp(-i / (audioContext.sampleRate * 0.05));
      const freq1 = 440; // A4
      const freq2 = 554; // C#5
      data[i] = (
        Math.sin(freq1 * 2 * Math.PI * i / audioContext.sampleRate) * 0.3 +
        Math.sin(freq2 * 2 * Math.PI * i / audioContext.sampleRate) * 0.2
      ) * envelope;
    }
    
    return bufferToAudio(buffer);
  };

  // Create a gentle movement sound (slide effect)
  const createMovementSound = (): HTMLAudioElement => {
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.25, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const progress = i / data.length;
      const frequency = 600 + (progress * 200); // Slide from 600Hz to 800Hz
      const envelope = Math.sin(progress * Math.PI) * 0.4; // Bell curve envelope
      data[i] = Math.sin(frequency * 2 * Math.PI * i / audioContext.sampleRate) * envelope;
    }
    
    return bufferToAudio(buffer);
  };

  // Create a subtle bot move sound (lower, more mechanical)
  const createBotMoveSound = (): HTMLAudioElement => {
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.15, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const envelope = Math.exp(-i / (audioContext.sampleRate * 0.04));
      const freq = 300; // Lower frequency for bot
      data[i] = Math.sin(freq * 2 * Math.PI * i / audioContext.sampleRate) * 0.25 * envelope;
    }
    
    return bufferToAudio(buffer);
  };

  // Create a success sound (ascending chord)
  const createSuccessSound = (): HTMLAudioElement => {
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    const frequencies = [523, 659, 784]; // C, E, G major chord
    
    for (let i = 0; i < data.length; i++) {
      const envelope = Math.exp(-i / (audioContext.sampleRate * 0.15));
      let sample = 0;
      
      frequencies.forEach(freq => {
        sample += Math.sin(freq * 2 * Math.PI * i / audioContext.sampleRate) * 0.2;
      });
      
      data[i] = sample * envelope;
    }
    
    return bufferToAudio(buffer);
  };

  // Convert AudioBuffer to HTMLAudioElement
  const bufferToAudio = (buffer: AudioBuffer): HTMLAudioElement => {
    const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineContext.destination);
    source.start(0);
    
    const audio = new Audio();
    
    offlineContext.startRendering().then(renderedBuffer => {
      const wav = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      audio.src = URL.createObjectURL(blob);
    });
    
    return audio;
  };

  // Convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const data = buffer.getChannelData(0);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return arrayBuffer;
  };

  return {
    clickSound: createClickSound(),
    placementSound: createPlacementSound(),
    movementSound: createMovementSound(),
    botMoveSound: createBotMoveSound(),
    successSound: createSuccessSound()
  };
};