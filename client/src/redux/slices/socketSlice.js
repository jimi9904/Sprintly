import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isConnected: false,
    onlineUsers: [],
    typingUsers: {},  // { [taskId]: [{ userId, name }] }
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addTypingUser: (state, action) => {
            const { taskId, userId, name } = action.payload;
            if (!state.typingUsers[taskId]) state.typingUsers[taskId] = [];
            if (!state.typingUsers[taskId].find(u => u.userId === userId)) {
                state.typingUsers[taskId].push({ userId, name });
            }
        },
        removeTypingUser: (state, action) => {
            const { taskId, userId } = action.payload;
            if (state.typingUsers[taskId]) {
                state.typingUsers[taskId] = state.typingUsers[taskId].filter(u => u.userId !== userId);
            }
        }
    }
});

export const { setConnected, setOnlineUsers, addTypingUser, removeTypingUser } = socketSlice.actions;
export default socketSlice.reducer;
