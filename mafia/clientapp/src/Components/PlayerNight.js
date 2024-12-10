import React, { useState, useEffect } from 'react';
import '../Components/CSS/Lobby.css';
import '../Components/CSS/Night.css';
import "../Components/CSS/Lobby.css";
import HiddenChatbox from "./HiddenChatbox";
import GettingCharacter from "./GettingCharacter";
import PlayerList from "./PlayerList";
import MafiaChoice from "./MafiaChoice";
import DoctorChoice from "./DoctorChoice";
import DetectiveChoice from "./DetectiveChoice";

function PlayerNight({ gameId, players, role, chat, onSendMessage, onKill, hasMadeMafiaChoice, hasMadeDoctorChoice, hasMadeDetectiveChoice, onCheckRole, onSave, onDetectiveChoiceMade }) {
    const [showChat, setShowChat] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showMafiaChoice, setShowMafiaChoice] = useState(false);
    const [showDoctorChoice, setShowDoctorChoice] = useState(false);
    const [showDetectiveChoice, setShowDetectiveChoice] = useState(false);
    const [showRoleInfo, setShowRoleInfo] = useState(false);
    const [roleInfoText, setRoleInfoText] = useState('');
    const [roleInfoTimeout, setRoleInfoTimeout] = useState(null);
    const [detectedRoleName, setDetectedRoleName] = useState(null);
    const [playerInfo, setPlayerInfo] = useState({ nickname: '', roleName: '' });
    const handleSkip = () => {onDetectiveChoiceMade();};
    const handleRoleChecked = (targetPlayerId) => {
        const targetPlayer = players.find(player => player.playerId === targetPlayerId);
        if (!targetPlayer) {
            console.error("Player not found");
            return;
        }

        const roleName = targetPlayer.role ? targetPlayer.role.name : 'Unknown';
        setPlayerInfo({ nickname: targetPlayer.nickname, roleName });
        setShowRoleInfo(true);


        // Hide the role information after 10 seconds
        setTimeout(() => {
            setShowRoleInfo(false);
            onDetectiveChoiceMade(); // Close the choice window
        }, 10000);
    };
    
    useEffect(() => {
        
        if (role.name === 'Mafia') {
            const timer = setTimeout(() => {
                setShowMafiaChoice(true); 
            }, 10000); 

            return () => clearTimeout(timer); 
        }
    }, [role.name]);

    useEffect(() => {
       
        if (role.name === 'Doctor') {
            const timer = setTimeout(() => {
                setShowDoctorChoice(true); 
            }, 46000); 

            return () => clearTimeout(timer); 
        }
    }, [role.name]);

    useEffect(() => {
        
        if (role.name === 'Detective') {
            const timer = setTimeout(() => {
                setShowDetectiveChoice(true); 
            }, 82000); 

            return () => clearTimeout(timer); 
        }
    }, [role.name]);
    
    
    console.log(`PlayerStart - role received:`, role);
    const toggleChat = () => {
        setShowChat(!showChat);
    }
    const toggleRoleDescription = () => {
        setShowDescription(!showDescription);
    }



    // Modify the onCheckRole to also set the choice
    if (!role || !role.name || !role.description) {
        console.log("Role data is incomplete or missing:", role);
        return <div>Loading role information...</div>;
    }

    // Modified handleRoleChecked
    
    
    

    

    return (
        <div className={"player-night-container"}>
            <h1>The End Is Nigh</h1>

            {role.name === 'Mafia' && showMafiaChoice && !hasMadeMafiaChoice && (
                <div className={`PlayerNightChoiceWindow ${showMafiaChoice ? 'active' : ''}`}>
                    <h1>Make your choice as {role.name}:</h1>
                    <p>You know what you are capable of! Kill the one you choose.</p>
                    <br/>
                    {players && players.length > 0 ? ( 
                        <MafiaChoice players={players} onKill={onKill} />
                    ) : (
                        <p>Loading players...</p> 
                    )}
                </div>
            )}

            {role.name === 'Doctor' && showDoctorChoice && !hasMadeDoctorChoice && (
                <div className={`PlayerNightChoiceWindow ${showDoctorChoice ? 'active' : ''}`}>
                    <h1>Make your choice as {role.name}:</h1>
                    <p>Someone could die tonight, you can make a difference and save them!</p>
                    <br/>
                    {players && players.length > 0 ? ( 
                        <DoctorChoice players={players} onSave={onSave}/>
                    ) : (
                        <p>Loading players...</p> 
                    )}
                </div>
            )}

            {role.name === 'Detective' && showDetectiveChoice && !hasMadeDetectiveChoice && (
                <div className={`PlayerNightChoiceWindow ${showDetectiveChoice ? 'active' : ''}`}>
                    <h1>Make your choice as {role.name}:</h1>
                    <div className="content">
                        <p>You can make your choice ONCE!, if you aren't sure just skip...</p>
                        {showRoleInfo && (
                            <div className="detected-role-display">
                                {roleInfoText} {/* This shows the text "Player XYZ's role is: ABC" */}
                                <GettingCharacter role={detectedRoleName} />
                            </div>
                        )}
                        {players && players.length > 0 ? (
                            <DetectiveChoice players={players} onCheckRole={handleRoleChecked} />
                        ) : (
                            <p>Loading players...</p>
                        )}
                    </div>
                    <button onClick={handleSkip}>Skip</button>
                </div>
            )}
            

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
}

export default PlayerNight;