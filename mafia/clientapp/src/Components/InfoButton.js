import React from 'react';

function InfoButton(props) {
    // You can add additional functionality or styling here

    return (
        <div className="info-button">
            <button onClick={props.onClick}>
                Info
            </button>
        </div>

    );
}

export default InfoButton;