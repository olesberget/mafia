import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook from react-router-dom
import HostView from './HostView'; // Import HostView component
import PlayerView from './PlayerView'; // Import PlayerView component


function useQuery(){
    // Custom hook to parse the query string parameters
    return new URLSearchParams(useLocation().search);
}

function GameRoom() {
    const query = useQuery(); // Use the custom hook to get query parameters
    const gameId = query.get('gameId'); // Get the gameId from the query string
    const isHost = query.get('isHost') === 'true'; // Determine if the current user is the host
    const playerId = query.get('playerId');

    return (
        // Render HostView or PlayerView based on the isHost flag
        <>
            {isHost ? <HostView gameId={gameId} /> : <PlayerView gameId={gameId} playerId={playerId} />}
        </>
    );
}

export default GameRoom; // Export the GameRoom component
