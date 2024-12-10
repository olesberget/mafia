import React from 'react';

function RuleButton(props) {
    // You can add additional functionality or styling here

    return (
        <div className="rule-button">
            <button onClick={props.onClick}>
                Rules
            </button>
        </div>

    );
}

export default RuleButton;