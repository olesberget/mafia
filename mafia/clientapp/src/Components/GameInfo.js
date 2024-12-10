import React from 'react';
function GameInfo({ gameId }) {
    return (
        <div className="game-info">
            <p className="TitleGameInfo">Game Id:</p> <p className="TitleGameInfo">{gameId}</p>
        </div>
    );
}
export default GameInfo;