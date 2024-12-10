import React from 'react';
import MessageInput from '../Components/MessageInput.js';
import ChatBox from "../Components/ChatBox.js";

function HiddenChatbox({chat, onSendMessage }) {


    return (
        <div className="HiddenChatbox;">
            <p className="chat-title">Chat:</p>
            <div className="Hiddenchat">
                    {<ChatBox chat={chat} />}
            </div>
            <div className="MessageInput">
                {<MessageInput onSendMessage={onSendMessage}/>}
            </div>
        </div>

    );
}
export default HiddenChatbox;