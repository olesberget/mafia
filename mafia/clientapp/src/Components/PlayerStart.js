import React, { useState } from "react";
import HiddenChatbox from "./HiddenChatbox.js";
import "../Components/CSS/Start.css";
import "../Components/CSS/Lobby.css";
import GettingCharacter from './GettingCharacter';
import ReadyCheckButton from "./ReadyCheckButton";

function PlayerStart({ gameId, playerNickname, role, chat, onSendMessage, onReadyChange }) {
    const [showDescription, setShowDescription] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showRules, setShowRules] = useState(false);

    
    console.log(`PlayerStart - role received:`, role);

    const toggleRoleDescription = () => {
        setShowDescription(!showDescription);
    }

    const toggleRules = () => {
        setShowRules(!showRules);
    }

    
    const toggleChat = () => {
        setShowChat(!showChat);
    }

    if (!role || !role.name || !role.description) {
        console.log("Role data is incomplete or missing:", role);
        return <div>Loading role information...</div>;
    }


    return (
        <div className="player-start-container">

            <h1>Role: {role.name}</h1>
            <div className={'button-container'}>
                <div className={`player-role-bar ${showDescription ? 'active' : ''}`} onClick={toggleRoleDescription}>
                    Role Description:
                    <div className="role-description">
                        <GettingCharacter role={role ? role.name : null} />
                    </div>

                </div>
                <div className={`rules ${showRules ? 'active' : ''}`} onClick={toggleRules}>
                    Rules:
                    <div className="Rules">
                        <p>This is the rules</p>
                    </div>
                </div>
            </div>
            <br/>
            <div className={'ready-check-button'}>
                <ReadyCheckButton onReadyChange={onReadyChange} />
            </div>



            <button onClick={toggleChat} className="toggle-chat-button">
                {showChat ? "Hide Chat" : "Show Chat"}
            </button>
            <div className={`player-start-chat-box ${showChat ? 'active' : ''}`}>
                <HiddenChatbox chat={chat} onSendMessage={onSendMessage}/>
            </div>
        </div>
    );
}

export default PlayerStart;

