import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import { Provider } from 'react-redux'
//import { store } from './store'
import GameRoom from './Pages/GameRoom';

function App() {
    // Set up routing for the application
    return (
        //<Provider store={store}>
            <Router>
                <Routes>
                    <Route path="*" element={<GameRoom />} /> // Route all paths to the GameRoom component
                </Routes>
            </Router>
        //</Provider>
    );
}

export default App;

/* App Component: The main component of the React application that sets up the router and defines the routing logic. 
Currently, it routes all paths to the GameRoom component. As the application grows, more routes can be added to 
this component to handle different pages and features of the application, making it the central hub for navigation. */
