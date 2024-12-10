import React from "react";
import Button from "@mui/material/Button";


const SettingsButton = ({ onSettings }) => {
    return (
        <Button
            variant="outlined"
            onClick={onSettings}
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
            
            Settings
        </Button>
    );
}

export default SettingsButton;