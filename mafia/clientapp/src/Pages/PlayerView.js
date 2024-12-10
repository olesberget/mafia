import React, { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import PlayerLobby from '../Components/PlayerLobby';
import PlayerStart from '../Components/PlayerStart';
import PlayerNight from "../Components/PlayerNight";
import { getSignalRConnection } from '../services/signalRManager';
import { joinGroup } from '../services/signalRService';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function PlayerView() {
    const query = useQuery();
    const gameId = query.get('gameId');
    const playerId = query.get('playerId');
    const [gameStarted, setGameStarted] = useState(false);
    const [gamePhase, setGamePhase] = useState('lobby');
    const [playerNickname, setPlayerNickname] = useState('');
    const [role, setRole] = useState({ name: '', description: '' });
    const [chat, setChat] = useState([]);
    const [connection, setConnection] = useState(null);
    const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
    const [players, setPlayers] = useState([]);
    const [mafiaHasChosen, setMafiaHasChosen] = useState(false);
    const [doctorHasSaved, setDoctorHasSaved] = useState(false);
    const [detectiveHasChecked, setDetectiveHasChecked] = useState(false);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(`/api/game/getplayers?gameId=${gameId}&playerId=${playerId}`);
            console.log("Fetched players:", response.data); // Debug log
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const handleKill = async (targetPlayerId) => {
        try {
            await axios.post('/api/game/killplayer', { gameId, targetPlayerId });
            setMafiaHasChosen(true);
        } catch (error) {
            console.error('Error during kill action:', error);
        }
    };
    const handleSendMessage = (message) => {
        if (connection && message.trim()) {
            connection.invoke("SendMessageToGroup", gameId, playerNickname, message);
        }
    };

    const receiveMessageHandler = (message) => {
        console.log("Message received:", message);
        setChat(prevChat => [...prevChat, message]);
    }

    const handleGameStarted = () => {
        console.log("GameStarted event received.");
        setGameStarted(true);
        setGamePhase('start');
        fetchPlayerRole();
        if (connection) {
            connection.invoke("ConfirmGameStart", gameId)
                .catch(err => console.error("Error sending GameStart confirmation:", err));
        }
    };

    const handleNightPhaseStarted = () => {
        console.log("Night phase event received for gameId:", gameId);
        setGamePhase('night');
    };

    const fetchPlayerNickname = async () => {
        if (playerId) {
            try {
                const response = await axios.get('/api/Game/getplayerinfo', {
                    params: { gameId, playerId },
                });
                if (response.data && response.data.nickname) {
                    setPlayerNickname(response.data.nickname);
                } else {
                    console.error('Nickname not found in response:', response.data);
                }
            } catch (error) {
                console.error('Error fetching player nickname:', error);
            }
        }
    };

    const fetchPlayerRole = async () => {
        try {
            const response = await axios.get(`/api/Game/getplayerrole?gameId=${gameId}&playerId=${playerId}`);
            if (response.data && response.data.role && response.data.description) {
                setRole({ name: response.data.role, description: response.data.description });
            } else {
                console.error('Invalid role data in response:', response.data);
            }
        } catch (error) {
            console.error('Error fetching player role:', error);
        }
    };

    const handleReadyChange = async (newReadyState) => {
        try {
            const response = await axios.post(`/api/Game/updatePlayerReadyStatus?gameId=${gameId}&playerId=${playerId}`, newReadyState, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Ready state updated to:", newReadyState, "Response:", response.data);
        } catch (error) {
            console.error('Error updating player ready status:', error);
        }
    };

    const joinGroupWithCheck = async (conn, gameId, retryCount = 0) => {
        if (!conn.hasJoinedGroup) {
            try {
                await joinGroup(conn, gameId);
                console.log(`Successfully joined group: ${gameId}`);
                conn.hasJoinedGroup = true;
                setHasJoinedGroup(true);
            } catch (err) {
                console.error(`Error joining group ${gameId}:`, err);
                if (retryCount < 3) {
                    setTimeout(() => joinGroupWithCheck(conn, gameId, retryCount + 1), 2000);
                }
            }
        }
    };

    const handlePlayerKilled = killedPlayerId => {
        setPlayers(prevPlayers => prevPlayers.map(player => {
            if (player.playerId === killedPlayerId) {
                return { ...player, isKilled: true }; // Mark the player as killed
            }
            return player;
        }));
    };

    const handleSave = async (targetPlayerId) => {
        try {
            await axios.post('/api/game/saveplayer', { gameId, targetPlayerId });
            setDoctorHasSaved(true); // Update state to indicate the doctor has made their choice
        } catch (error) {
            console.error('Error during save action:', error);
        }
    };

    const handleCheckRole = async (targetPlayerId) => {
        try {
            const response = await axios.get(`/api/game/checkrole`, {
                params: { gameId, targetPlayerId }
            });
            // Handle the response as needed
            console.log(response.data);
            setDetectiveHasChecked(true);
        } catch (error) {
            console.error('Error during role check action:', error);
        }
    };

    const handlePlayerSaved = (savedPlayerId) => {
        console.log("Player saved:", savedPlayerId);
        setPlayers(prevPlayers => prevPlayers.map(player => {
            if (player.playerId === savedPlayerId) {
                return { ...player, isAlive: true };
            }
            return player;
        }));
    };

    const handleRoleChecked = (targetPlayerId, role) => {
        console.log(`Role of player ${targetPlayerId}:`, role);
        alert(`Player ${targetPlayerId}'s role is: ${role}`);
    };

    const setupSignalR = async () => {
        let conn = connection;
        if (!conn) {
            conn = await getSignalRConnection();
            setConnection(conn);
        }

        if (!conn.hasSubscribed) {
            conn.on('GameStarted', handleGameStarted);
            conn.on('ReceiveMessage', receiveMessageHandler);
            conn.on('NightPhaseStarted', handleNightPhaseStarted);
            conn.on('PlayerListUpdated', fetchPlayers);
            conn.on('PlayerKilled', handlePlayerKilled);
            conn.on('PlayerSaved', handlePlayerSaved);
            conn.on('RoleChecked', handleRoleChecked);
            conn.hasSubscribed = true;
        }

        if (!conn.hasJoinedGroup) {
            await joinGroupWithCheck(conn, gameId);
            conn.hasJoinedGroup = true;
        }
    };

    const handleDetectiveChoiceMade = () => {
        setDetectiveHasChecked(true); // Updates the state in PlayerView
    };
    
    useEffect(() => {
        console.log('useEffect run with dependencies:', { gameId, playerId, playerNickname, connection });
        fetchPlayers();
        if (!playerNickname && playerId) {
            fetchPlayerNickname();
        }

        if (gameId && playerNickname && !gameStarted) {
            setupSignalR();
        }

        /*if (gameId && !gameStarted) {
            setupSignalR();
        }
        /*
         */

        /*if (!connection || connection.state !== "Connected") {
            setupSignalR();
        }*/

        // Log state values before rendering
        console.log(
            'State values before rendering - gameStarted:',
            gameStarted,
            'playerId:',
            playerId,
            'playerNickname:',
            playerNickname,
            'role.name:',
            role?.name
        );

        console.log(`PlayerView - gameId: ${gameId}, playerNickname: ${playerNickname}`);

        return () => {
            if (connection) {
                connection.off('GameStarted', handleGameStarted);
                connection.off('ReceiveMessage', receiveMessageHandler);
                connection.off('NightPhaseStarted', handleNightPhaseStarted);
            }
        };
    }, [gameId, playerId, playerNickname, connection]);

    let renderComponent;

    console.log(`Rendering - gameStarted: ${gameStarted}, gamePhase: ${gamePhase}`);
    if (!gameStarted) {
        renderComponent = <PlayerLobby gameId={gameId} playerNickname={playerNickname} chat={chat} onSendMessage={handleSendMessage} />;
    } else {
        switch (gamePhase) {
            case 'start':
                renderComponent = <PlayerStart gameId={gameId} playerNickname={playerNickname} role={role} chat={chat} 
                                               onSendMessage={handleSendMessage} onReadyChange={handleReadyChange} />;
                break;
            case 'night':
                renderComponent = <PlayerNight gameId={gameId} playerNickname={playerNickname} role={role} chat={chat} 
                                               onSendMessage={handleSendMessage} onReadyChange={handleReadyChange} 
                                               players={players} onKill={handleKill} hasMadeMafiaChoice={mafiaHasChosen}
                                               hasMadeDoctorChoice={doctorHasSaved} hasMadeDetectiveChoice={detectiveHasChecked}
                                               onSave={handleSave} onCheckRole={handleCheckRole} onDetectiveChoiceMade={handleDetectiveChoiceMade}/>;
                break;
            default:
                break;
        }
    }

    return renderComponent;
}

export default PlayerView;
