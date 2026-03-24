
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: localStorage.getItem('theme') || 'light', // Default to light as per instruction
    sidebarOpen: true,
    isSidebarExpanded: true,
    isLoading: false,
    isPricingModalOpen: false,
    isTaskDrawerOpen: false,
    selectedTaskId: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', state.theme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', state.theme);
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarExpanded: (state, action) => {
            state.sidebarExpanded = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        togglePricingModal: (state, action) => {
            state.isPricingModalOpen = action.payload !== undefined ? action.payload : !state.isPricingModalOpen;
        },
        openTaskDrawer: (state, action) => {
            state.taskDrawerOpen = true;
            state.selectedTaskId = action.payload;
        },
        closeTaskDrawer: (state) => {
            state.taskDrawerOpen = false;
            state.selectedTaskId = null;
        }
    },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarExpanded, setLoading, togglePricingModal, openTaskDrawer, closeTaskDrawer } = uiSlice.actions;
export default uiSlice.reducer;
