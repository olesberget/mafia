import React from 'react';
import narator from './pictures/Nar.png';
import '../Components/CSS/Night.css';
import AutoPlayAudio from "./AutoPlayAudio";

console.log(narator);

function Narator(game_id) {
    return (
        <div className="narator">
            <img src={narator} alt="Narator-img" />
            <AutoPlayAudio/>
        </div>
    );
}

export default Narator;