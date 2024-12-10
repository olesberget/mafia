import React, { useState, useEffect } from 'react';

function RoleInfo({ roleName, roleDescription }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        // Here you would fetch the image URL based on the roleName
        // For now, I'll just use a placeholder image
        const fetchImageUrl = async () => {
            // Replace this URL with your actual API endpoint
            const response = await fetch(`/api/getRoleImage?role=${roleName}`);
            const data = await response.json();
            setImageUrl(data.Image);
        };

        fetchImageUrl();
    }, [roleName]);

    return (
        <div>
            <h2>{roleName}</h2>
            <p>{roleDescription}</p>
            {imageUrl && <img src={imageUrl} alt={roleName} />}
        </div>
    );
}

export default RoleInfo;