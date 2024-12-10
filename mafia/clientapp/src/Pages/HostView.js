import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HostLobby from '../Components/HostLobby';
import HostStart from '../Components/HostStart';
import HostNight from "../Components/HostNight";
import { getSignalRConnection } from '../services/signalRManager';
import { joinGroup } from '../services/signalRService';

function HostView({ gameId }) {
    const [gameStarted, setGameStarted] = useState(false);
    const [gamePhase, setGamePhase] = useState('lobby');
    const [players, setPlayers] = useState([]);
    const [chat, setChat] = useState([]);
    const [readyCount, setReadyCount] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        setupSignalR();
        fetchPlayers();

        return () => {
            if (connection) {
                connection.off('GameStarted');
                connection.off('PlayerJoined');
                connection.off('ReceiveMessage');
                connection.off('NightPhaseStarted');
                connection.off('PlayerReadyStatusChanged');
            }
        };
    }, [gameId]);

    const setupSignalR = async () => {
        const conn = await getSignalRConnection();
        setConnection(conn);

        if (conn && (conn.state === 'Connected' || conn.state === 'Reconnecting')) {
            subscribeToEvents(conn);
            await joinGroup(conn, gameId);
        }

        conn.onclose(e => {
            console.log('Connection closed', e);
            // Implement reconnection logic if necessary
        });
    };

    const subscribeToEvents = (conn) => {
        conn.on('GameStarted', () => setGameStarted(true));
        conn.on('PlayerJoined', fetchPlayers);
        conn.on('ReceiveMessage', message => setChat(prev => [...prev, message]));
        conn.on('PlayerReadyStatusChanged', (playerId, isReady, count, total) => {
            setReadyCount(count);
            setTotalPlayers(total);
        });
        conn.on('NightPhaseStarted', () => setGamePhase('night'));
    };

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(`/api/game/getplayers?gameId=${gameId}`);
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const handleContinueGame = async () => {
        console.log("Continue game button clicked, gameId:", gameId);
        if (connection && connection.state === "Connected") {
            try {
                await connection.invoke("StartNightPhase", gameId);
                setGamePhase('night');
            } catch (error) {
                console.error('Error starting night phase:', error);
            }
        } else {
            console.error("SignalR connection not established.");
        }
    };

    const handleStartGame = async () => {
        await axios.post('/api/Game/startgame', { gameId });
        setGameStarted(true);
        setGamePhase('start');
    };

    let renderComponent = <HostLobby gameId={gameId} players={players} chat={chat} onStart={handleStartGame} />;
    if (gameStarted) {
        switch (gamePhase) {
            case 'start':
                renderComponent = <HostStart gameId={gameId} connection={connection} onContinue={handleContinueGame} readyCount={readyCount} totalPlayers={totalPlayers} />;
                break;
            case 'night':
                renderComponent = <HostNight gameId={gameId} />;
                break;
            default:
                break;
        }
    }

    return renderComponent;
}

export default HostView;
