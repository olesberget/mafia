import React from 'react';

function DoctorChoice({ players, onSave }) {
    console.log('Players in Doctor Choice:', players); // Debug: log the players prop

    return (
        <div className="players2">
            <ul className="player-list">
                {players.map(player => (
                    <li key={player.playerId} onClick={() => onSave(player.playerId)}>
                        {player.nickname}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DoctorChoice;