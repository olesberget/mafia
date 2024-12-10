import React from 'react';

function DetectiveChoice({ players, onCheckRole }) {
    console.log('Players in Detective Choice:', players); // Debug: log the players prop

    return (
        <div className="players2">
            <ul className="player-list">
                {players.map(player => (
                    <li key={player.playerId} onClick={() => onCheckRole(player.playerId)}>
                        {player.nickname}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DetectiveChoice;