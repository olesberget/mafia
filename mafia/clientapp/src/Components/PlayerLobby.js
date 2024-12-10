import React from 'react';
import '../Components/CSS/Lobby.css';
import HiddenChatbox from "./HiddenChatbox";


function PlayerLobby({ gameId, playerNickname, chat, onSendMessage }) {



    return (
        <div className="player-lobby-container">
            <div className="left-side">
                <div className="waiting">
                    <p className="TitlePlayer">Waiting for other players</p>
                    <div className="lds-ellipsis">
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <div className={'right-side'}>
            <HiddenChatbox  chat={chat} onSendMessage={onSendMessage}/>
            </div>
        </div>
    );
}
export default PlayerLobby;
