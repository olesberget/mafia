import React, { useState } from 'react';

function ReadyCheckButton({ onReadyChange }) {
    const [isReady, setIsReady] = useState(false);

    const toggleReady = () => {
        const newReadyState = !isReady;
        setIsReady(newReadyState);
        onReadyChange(newReadyState); // Communicate the readiness state upwards
    };

    return (
        <button onClick={toggleReady}>
            {isReady ? 'Not Ready' : 'Ready'}
        </button>
    );
}

export default ReadyCheckButton;
