import React from 'react';
import GameInfo from './GameInfo';
import PlayerList from './PlayerList';
import ChatBox from './ChatBox';
import StartButton from './StartButton';
import '../Components/CSS/Lobby.css';

function HostLobby({ gameId, players, chat, onStart }) {

    return (
        <div className="host-lobby-container">
            <div className="head">
                <GameInfo gameId={gameId} />
                <StartButton onStart={onStart} />
            </div>
            <div className="box">
                <PlayerList
                    players={players}
                />
                <h3>Chat:</h3>
                <ChatBox className={'hostChat'} chat={chat} />
            </div>
        </div>
    );
}

export default HostLobby;
