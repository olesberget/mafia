import React, { useState, useEffect } from 'react';
import narrator from "./Narator.mp3";
import narrator2 from "./Narator2.mp3";
import narrator3 from "./Narator3.mp3";

const AutoPlayAudio = () => {
    const audioSources = [narrator, narrator2, narrator3];
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [audio] = useState(new Audio());

    useEffect(() => {
        const playAudio = async () => {
            audio.src = audioSources[currentAudioIndex];
            try {
                await audio.play();
            } catch (e) {
                console.error('Error playing audio:', e);
            }
        };

        const playNextAudioAfterDelay = () => {
            if (currentAudioIndex < audioSources.length - 1) {
                setTimeout(() => {
                    setCurrentAudioIndex(currentAudioIndex + 1);
                }, 10000); // 10-second delay
            }
        };

        // Only set up the event listener if we're not at the last audio file
        if (currentAudioIndex < audioSources.length - 1) {
            audio.addEventListener('ended', playNextAudioAfterDelay);
        }

        playAudio();

        return () => {
            audio.removeEventListener('ended', playNextAudioAfterDelay);
            audio.pause();
        };
    }, [currentAudioIndex, audio, audioSources]); // Re-run effect when currentAudioIndex changes

    return null; // No actual JSX needed, audio is handled programmatically
};

export default AutoPlayAudio;