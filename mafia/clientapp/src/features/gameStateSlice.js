/*import { createSlice } from "@reduxjs/toolkit";

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState: {
        phase: 'lobby', // lobby, inGame, voting, narration, eulogy
        gameId: null,
        isHost: false,
        // Other game state variables
    },
    reducers: {
        setGamePhase: (state, action) => {
            state.phase = action.payload;
        },
        setGameId: (state, action) => {
            state.gameId = action.payload;
        },
        setIsHost: (state, action) => {
            state.isHost = action.payload;
        },
        // other reducers to manipulate game state
    },
});

export const { setGamePhase, setGameId, setIsHost } = gameStateSlice.actions;

export default gameStateSlice.reducer;*/