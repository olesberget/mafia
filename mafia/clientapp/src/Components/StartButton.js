import React from 'react';

function StartButton(props) {
    const handleClick = () => {
        console.log("Start button clicked.");
        props.onStart();
    };

    return (
        <div className="start-button">
        <button onClick={handleClick}>
            Start
        </button>
        </div>
        
    );
}

export default StartButton;