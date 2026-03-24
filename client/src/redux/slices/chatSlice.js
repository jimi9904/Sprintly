import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    messages: [
        {
            id: 1,
            text: "Hey! 👋 Need help with anything?",
            sender: "Alex Johnson",
            senderId: 1,
            isMe: false,
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
    ],
    unreadCount: 0,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
            if (state.isOpen) state.unreadCount = 0;
        },
        sendMessage: (state, action) => {
            state.messages.push({
                id: Date.now(),
                text: action.payload,
                sender: 'You',
                senderId: 'me',
                isMe: true,
                timestamp: new Date().toISOString()
            });
        },
        receiveMessage: (state, action) => {
            state.messages.push({
                id: Date.now(),
                text: action.payload.text,
                sender: action.payload.sender,
                senderId: action.payload.senderId,
                isMe: false,
                timestamp: new Date().toISOString()
            });
            if (!state.isOpen) state.unreadCount += 1;
        }
    }
});

export const { toggleChat, sendMessage, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
