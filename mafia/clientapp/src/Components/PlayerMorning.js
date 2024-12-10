import React, {useState} from 'react';
import '../Components/CSS/Lobby.css';
import '../Components/CSS/Night.css';
import "../Components/CSS/Lobby.css";
import HiddenChatbox from "./HiddenChatbox";
import GettingCharacter from "./GettingCharacter";
import PlayerList from "./PlayerList";
function PlayerMorning({ gameId ,players ,role, chat, onSendMessage,   }) {
    const [showChat, setShowChat] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    console.log(`PlayerStart - role received:`, role);
    const toggleChat = () => {
        setShowChat(!showChat);
    }
    const toggleRoleDescription = () => {
        setShowDescription(!showDescription);
    }

    if (!role || !role.name || !role.description) {
        console.log("Role data is incomplete or missing:", role);
        return <div>Loading role information...</div>;
    }

    return (
        <div className={Player-morning-container}>
            <h1>Time to Vote!</h1>

            <div className={'voting-window'}>
                <p>Chose the suspect:</p>
                
            </div>





            <button onClick={toggleRoleDescription} className={'role-container-button'}>
                {showDescription ? "Hide Role" : "Show Role"}
            </button>
            <div className={`Role-Container-Night ${showDescription ? 'active' : ''}`}>
                <h1>Role: {role.name}</h1>
                <GettingCharacter role={role ? role.name : null} />
            </div>

            <button onClick={toggleChat} className="toggle-chat-button">
                {showChat ? "Hide Chat" : "Show Chat"}
            </button>
            <div className={`player-start-chat-box ${showChat ? 'active' : ''}`}>
                <HiddenChatbox chat={chat} onSendMessage={onSendMessage}/>
            </div>
        </div>
    );
}export default PlayerMorning;