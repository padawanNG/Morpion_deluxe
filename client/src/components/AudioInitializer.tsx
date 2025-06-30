import React, { useEffect, useState } from 'react';
import { useAudio } from '@/lib/stores/useAudio';
import { createRelaxingAudio } from '@/lib/audioGenerator';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

const AudioInitializer: React.FC = () => {
  const { 
    isMuted, 
    toggleMute,
    setClickSound,
    setPlacementSound,
    setMovementSound,
    setBotMoveSound,
    setSuccessSound
  } = useAudio();
  
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const initializeAudio = async () => {
    try {
      console.log('Initializing relaxing audio...');
      const audioSounds = createRelaxingAudio();
      
      // Wait a bit for audio generation to complete
      setTimeout(() => {
        setClickSound(audioSounds.clickSound);
        setPlacementSound(audioSounds.placementSound);
        setMovementSound(audioSounds.movementSound);
        setBotMoveSound(audioSounds.botMoveSound);
        setSuccessSound(audioSounds.successSound);
        
        setAudioInitialized(true);
        console.log('Relaxing audio system initialized!');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setAudioError(true);
    }
  };

  useEffect(() => {
    // Initialize audio on component mount
    initializeAudio();
  }, []);

  const handleToggleMute = () => {
    toggleMute();
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleMute}
        className="h-8 w-8 p-0"
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      
      {!audioInitialized && !audioError && (
        <span className="text-xs text-gray-500">Initializing audio...</span>
      )}
      
      {audioError && (
        <span className="text-xs text-red-500">Audio unavailable</span>
      )}
    </div>
  );
};

export default AudioInitializer;