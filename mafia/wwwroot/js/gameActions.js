// gameActions.js


function logErrorDetails(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('Request:', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
    }
    console.error('Config:', error.config);
}

function hostGame() {
    axios.post('/api/game/hostgame')
        .then(response => {
            console.log(response.data); // Log to see the response
            const { gameId, isHost } = response.data;
            const path = isHost ? `/host?gameId=${gameId}&isHost=true` : `/player?gameId=${gameId}&isHost=false`;
            window.location.href = path;
        })
        .catch(error => {
            console.error('Error hosting game:', error);
        });
}

function showJoinGameModal() {
    document.getElementById('joinGameModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('joinGameModal').style.display = 'none';
}

function showNicknameModal() {
    document.getElementById('nicknameModal').style.display = 'block';
}

function closeNicknameModal() {
    document.getElementById('nicknameModal').style.display = 'none';
}

// Proceed with nickname, then open game code modal
function proceedWithNickname() {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        showJoinGameModal();
        closeNicknameModal();
    }
}

// Use a function to get the logged-in status and nickname from global variables
function getAuthStatus() {
    return {
        isLoggedIn: window.isLoggedIn || false,
        nickname: window.nickname || ''
    };
}

function displayErrorMessage(message) {
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
        <div class="error-modal-content">
            <span class="close-button">&times;</span>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(errorModal);
    
    const closeButton = errorModal.querySelector('.close-button');
    closeButton.onclick = function () {
        errorModal.remove();
    };
}

function joinGame() {
    const gameId = document.getElementById('gameCode').value;
    const authStatus = getAuthStatus();
    let nickname = document.getElementById('nickname').value;

    if (authStatus.isLoggedIn && !nickname) {
        nickname = authStatus.nickname;
    }

    if (gameId) {
        axios.post('/api/game/joingame', { gameId, nickname })
            .then(response => {
                const { gameId, isHost, playerId } = response.data;
                console.log('API response:', response.data);  // Log the API response
                if (!playerId) {
                    console.error("Error: playerId is missing in the response");
                    return;
                }
                const path = isHost ? `/host?gameId=${gameId}` : `/player?gameId=${gameId}&playerId=${playerId}`;
                console.log(`Redirecting to URL: ${path}`);  // Log the URL
                window.location.href = path;
            })
            .catch(error => {
                console.error('Error joining game:', error);
                const errorMessage = error.response ? error.response.data : ''
                if (errorMessage === "Game room not found or game is already active.") {
                    displayErrorMessage("Game room has already started or does not exist.");
                } else if (errorMessage === "Game room is full.") {
                    displayErrorMessage("Oops! This game lobby is full!");
                } else {
                    logErrorDetails(error);
                }
            });
    }
}

/* ADD LARGER COMMENT HERE */