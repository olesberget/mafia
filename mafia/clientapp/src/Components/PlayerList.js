

import React from 'react';
function PlayerList({ players }) {
    return (
        <div className="players">
            <div className="title">
                <p>Players:</p></div>
            <ul className="player-list">
                {players.map((player, index) => (
                    <li key={index}>{player.nickname}</li>
                ))}
            </ul>
        </div>
    );
}
export default PlayerList;


