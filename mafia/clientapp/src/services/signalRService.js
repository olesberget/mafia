import * as signalR from "@microsoft/signalr";
export const joinGroup = async (connection, groupName) => {
    if(!connection.hasJoinedGroup) {
        connection.hasJoinedGroup = {};
    }
    
    if (!connection.hasJoinedGroup[groupName]) {
        try {
            await connection.invoke("JoinGroup", groupName);
            console.log(`Joined group: ${groupName}`);
            connection.hasJoinedGroup[groupName] = true;
        } catch (err) {
            console.error(`Error joining group ${groupName}:`, err);
        }
    }
};

export const updatePlayerReadiness = async (connection, groupName, playerId, isReady) => {
    if (connection) {
        try {
            await connection.invoke("UpdatePlayerReadiness", groupName, playerId, isReady);
            console.log(`Player ${playerId} readiness updated to: ${isReady}`);
        } catch (err) {
            console.error(`Error joining group ${groupName}:`, err);
        }
    }
};


export const disconnectFromHub = (connection) => {
    if (connection) {
        connection.stop();
    }
};