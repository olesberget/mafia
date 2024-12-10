import React from 'react';
import '../Components/CSS/Start.css';
function ContinueButton({ onClick, connection, gameId, disabled }) {
    // You can add additional functionality or styling here
    return (
        <div className="continue-button">
            <button 
                className={'ContinueButton'} 
                onClick={() => onClick(connection, gameId)}
                disabled={disabled}>
                Continue
            </button>
        </div> 

    );
}

export default ContinueButton;