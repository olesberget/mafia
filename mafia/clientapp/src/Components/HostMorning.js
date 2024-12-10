import React from 'react';
import '../Components/CSS/Lobby.css';
import '../Components/CSS/Night.css';
import NaratorNight from "./NaratorNight";

function HostMorning({ gameId }) {

    return (
        <div className={"host-morning-container"}>
            <h1>Good Morning, or is it?</h1>
            <NaratorNight gameId={gameId}/>
        </div>


    );
}export default HostMorning;

