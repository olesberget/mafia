import React from 'react';
import "../Components/CSS/Start.css";
import MobsterImage from './pictures/Mobster2.png';
import CitzImage from './pictures/Citz.png';
import DocImage from './pictures/Doc.png';
import DecImage from './pictures/Dec.png';

const roleDetails = {
    Mafia: {
        image: MobsterImage,
        description: 'Kills you in your sleep!'
    },
    Citizen: {
        image: CitzImage,
        description: 'Do not do much, just live.'
    },
    Doctor: {
        image: DocImage,
        description: 'Can fix all of your booboo.'
    },
    Detective: {
        image: DecImage,
        description: 'Knows more than you think he knows'
    }
};

function GettingCharacter({ role }) {
    if (!role) {
        return <div>Loading character...</div>; 
    }

    const characterData = roleDetails[role] || roleDetails.default;

    return (
        <div className="character-container">
            <h2>{role}</h2>
            <div className={'role-display'}>
                <div className={'role-img'}>
                    <img src={characterData.image} alt={role} />
                </div>
                <div className={'description'}>
                    <p>{characterData.description}</p>
                </div>
                
        </div>
        </div>
    );
}

export default GettingCharacter;