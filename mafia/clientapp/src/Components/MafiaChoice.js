import React from 'react';

function MafiaChoice({ players, onKill }) {
    console.log('Players in MafiaChoice:', players); // Debug: log the players prop

    return (
        <div className="players2">
            <ul className="player-list">
                {players.map(player => (
                    <li key={player.playerId} onClick={() => onKill(player.playerId)}>
                        {player.nickname}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MafiaChoice;
