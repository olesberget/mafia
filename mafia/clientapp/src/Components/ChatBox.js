import React, { useEffect, useRef, useState } from 'react';

function ChatBox({ chat, className }) {
    const chatBoxRef = useRef(null);
    const messagesEndRef = useRef(null); // Define messagesEndRef here
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [newMessages, setNewMessages] = useState(false);

    const onScroll = () => {
        const isScrolledToBottom = chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop <= chatBoxRef.current.clientHeight;
        setIsAtBottom(isScrolledToBottom);
        if (isScrolledToBottom) {
            setNewMessages(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setNewMessages(false);
    };

    useEffect(() => {
        const chatBoxCurrent = chatBoxRef.current;
        chatBoxCurrent.addEventListener('scroll', onScroll);
        
        return () => {
            chatBoxCurrent.removeEventListener('scroll', onScroll);
        }
    }, []);

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        } else {
            setNewMessages(true);
        }
    }, [chat]);

    return (
        
        <div className={`chat-box ${className || ''}`} ref={chatBoxRef}>
            <ul>
                {chat.map((message, index) => {
                    // Assuming the format is "nickname: message"
                    const [nickname, ...messageParts] = message.split(':');
                    const messageText = messageParts.join(':'); // Re-join in case the message contains more colons
                    return (
                        <li key={index}>
                            <strong>{nickname}:</strong>{messageText}
                        </li>
                    );
                })}
            </ul>
            {newMessages && (
                <div className="new-message-alert show" onClick={scrollToBottom}>
                    New Chat
                </div>
            )}
            <div style={{ float:"left", clear: "both" }} ref={messagesEndRef} />
        </div>
    );
}

export default ChatBox;
