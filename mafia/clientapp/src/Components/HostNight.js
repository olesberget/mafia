import React from 'react';
import '../Components/CSS/Lobby.css';
import '../Components/CSS/Night.css';
import NaratorNight from "./NaratorNight";

function HostNight({ gameId }) {

    return (
        <div className={"host-night-container"}>
            <h1>The Dark Night Has Come</h1>
            <NaratorNight gameId={gameId}/>
        </div>


    );
} 

export default HostNight;