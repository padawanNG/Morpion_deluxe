import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  clickSound: HTMLAudioElement | null;
  placementSound: HTMLAudioElement | null;
  movementSound: HTMLAudioElement | null;
  botMoveSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setClickSound: (sound: HTMLAudioElement) => void;
  setPlacementSound: (sound: HTMLAudioElement) => void;
  setMovementSound: (sound: HTMLAudioElement) => void;
  setBotMoveSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playClick: () => void;
  playPlacement: () => void;
  playMovement: () => void;
  playBotMove: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  clickSound: null,
  placementSound: null,
  movementSound: null,
  botMoveSound: null,
  isMuted: true, // Start muted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setClickSound: (sound) => set({ clickSound: sound }),
  setPlacementSound: (sound) => set({ placementSound: sound }),
  setMovementSound: (sound) => set({ movementSound: sound }),
  setBotMoveSound: (sound) => set({ botMoveSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },

  playClick: () => {
    const { clickSound, isMuted } = get();
    if (clickSound && !isMuted) {
      const soundClone = clickSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(error => {
        console.log("Click sound play prevented:", error);
      });
    }
  },

  playPlacement: () => {
    const { placementSound, isMuted } = get();
    if (placementSound && !isMuted) {
      const soundClone = placementSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(error => {
        console.log("Placement sound play prevented:", error);
      });
    }
  },

  playMovement: () => {
    const { movementSound, isMuted } = get();
    if (movementSound && !isMuted) {
      const soundClone = movementSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(error => {
        console.log("Movement sound play prevented:", error);
      });
    }
  },

  playBotMove: () => {
    const { botMoveSound, isMuted } = get();
    if (botMoveSound && !isMuted) {
      const soundClone = botMoveSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.7; // Increased from 0.3 to 0.7 for better audibility
      soundClone.play().catch(error => {
        console.log("Bot move sound play prevented:", error);
      });
    }
  }
}));
