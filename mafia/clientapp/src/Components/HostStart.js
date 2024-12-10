import React from 'react';
import ContinueButton from "./ContinueButton.js";

function HostStart({ gameId, connection, onContinue, onEndGame, readyCount, totalPlayers}) {

    return (
        <div className="host-start-container">
            <h1>Game has started!<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></h1>
            <h2>Players ready: {readyCount}/{totalPlayers}</h2>
            <div className={'hostStartButtons'}>
                <ContinueButton 
                    connection={connection}
                    gameId={gameId}
                    onClick={onContinue}
                    disabled={readyCount !== totalPlayers}
                />
                <button className={'endgame'} onClick={onEndGame}>End Game</button>
            </div>
        </div>
    );
}

export default HostStart; 