import React, { useState } from 'react';
import Input from './Input';
function MessageInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`MessageInput - Submitting message: '${message}'`);
        onSendMessage(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit}>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-label="input"
                    multiline
                    placeholder="Type something…"
                    className="input"
                />
            <button className="SendMessage" type="submit">Send</button>
        </form>
    );
}
export default MessageInput;