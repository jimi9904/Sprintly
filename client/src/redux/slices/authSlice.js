import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

import workspaceService from '../../services/workspaceService';

const token = localStorage.getItem('token');

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: !!token,
    error: null,
    allMembers: [],    // all users across the system — same for everyone
    myTeams: [],       // teams the current user belongs to: [{ teamName, myRole, members[] }]
    teamMembers: [],   // alias for allMembers — used by task/assignee dropdowns
    workspaces: [],
    teams: []
};

// Async Thunks
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        return await authService.register(userData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        return await authService.login(userData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
    return null;
});

export const getMe = createAsyncThunk('auth/getMe', async (arg, thunkAPI) => {
    try {
        return await authService.getMe();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, thunkAPI) => {
    try {
        return await authService.forgotPassword(email);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, thunkAPI) => {
    try {
        return await authService.resetPassword(token, password);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchWorkspaceData = createAsyncThunk('auth/fetchWorkspaceData', async (_, thunkAPI) => {
    try {
        return await workspaceService.fetchWorkspaceMembers();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const inviteMember = createAsyncThunk('auth/invite', async (inviteData, thunkAPI) => {
    try {
        return await workspaceService.inviteMember(inviteData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createTeam = createAsyncThunk('auth/createTeam', async (teamData, thunkAPI) => {
    try {
        return await workspaceService.createDepartment(teamData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Add a member to an existing team tag within the current user's workspace
export const addMemberToTeam = createAsyncThunk('auth/addMemberToTeam', async ({ memberId, teamName }, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        // Use toString() to safely compare ObjectId vs plain string
        const member = state.auth.teamMembers.find(m => m._id?.toString() === memberId?.toString());
        const currentTeams = (member && member.teams) || [];
        if (currentTeams.includes(teamName)) return { memberId, teams: currentTeams }; // no-op
        const updatedTeams = [...currentTeams, teamName];
        await workspaceService.updateMemberDepartment(memberId, { teams: updatedTeams });
        return { memberId, teams: updatedTeams };
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Remove an existing workspace member from a specific team
export const removeMemberFromTeam = createAsyncThunk('auth/removeMemberFromTeam', async ({ memberId, teamName }, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const member = state.auth.teamMembers.find(m => m._id === memberId);
        const currentTeams = (member && member.teams) || [];
        const updatedTeams = currentTeams.filter(t => t !== teamName);
        await workspaceService.updateMemberDepartment(memberId, { teams: updatedTeams });
        return { memberId, teams: updatedTeams };
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const storedUserStr = localStorage.getItem('sprintly_user');
    if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        const updatedUser = { ...storedUser, ...userData };
        localStorage.setItem('sprintly_user', JSON.stringify(updatedUser));
    }
    return userData;
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaceData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkspaceData.fulfilled, (state, action) => {
                state.loading = false;
                const { allMembers, myTeams } = action.payload || {};

                if (allMembers) {
                    state.allMembers = allMembers;
                    state.teamMembers = allMembers; // keep alias for other components
                }
                if (myTeams) {
                    state.myTeams = myTeams;
                    // Collect unique team names for dropdowns
                    state.teams = myTeams.map(t => t.teamName);
                }
            })
            .addCase(fetchWorkspaceData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(inviteMember.pending, (state) => {
                state.loading = true;
            })
            .addCase(inviteMember.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload = the new workspace member entry from backend
                const newMember = {
                    _id: action.payload.user?._id || action.payload._id,
                    name: action.payload.user?.name || action.payload.name,
                    email: action.payload.user?.email || action.payload.email,
                    avatar: action.payload.user?.avatar || action.payload.avatar,
                    role: action.payload.role,
                    teams: action.payload.teams || [],
                    status: action.payload.status,
                };

                // Add to the user's OWN workspace in state (first workspace where myRole is admin or first workspace)
                const ownWsIndex = state.workspaces.findIndex(ws => ws.myRole === 'admin');
                if (ownWsIndex !== -1) {
                    const alreadyIn = state.workspaces[ownWsIndex].members.some(
                        m => m._id?.toString() === newMember._id?.toString()
                    );
                    if (!alreadyIn) state.workspaces[ownWsIndex].members.push(newMember);
                }

                // Also add to flat list if not already there
                const alreadyFlat = state.teamMembers.some(
                    m => m._id?.toString() === newMember._id?.toString()
                );
                if (!alreadyFlat) state.teamMembers.push(newMember);

                // Track any new team names
                const newTeams = newMember.teams.filter(t => !state.teams.includes(t) && t !== 'Unassigned');
                state.teams = [...state.teams, ...newTeams];
            })
            .addCase(inviteMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTeam.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.loading = false;
                const { name, selectedMembers } = action.payload;

                // Add new team to global teams list if it's new
                if (!state.teams.includes(name)) {
                    state.teams.push(name);
                }

                // Additively assign the new team to selected members
                if (selectedMembers && selectedMembers.length > 0) {
                    state.teamMembers = state.teamMembers.map(member => {
                        if (selectedMembers.includes(member._id)) {
                            const currentTeams = member.teams || [];
                            if (!currentTeams.includes(name)) {
                                return { ...member, teams: [...currentTeams, name] };
                            }
                        }
                        return member;
                    });
                }
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addMemberToTeam.fulfilled, (state, action) => {
                const { memberId, teams } = action.payload;
                state.teamMembers = state.teamMembers.map(m =>
                    m._id === memberId ? { ...m, teams } : m
                );
                // Make sure all team names are in the global teams list
                teams.forEach(t => {
                    if (!state.teams.includes(t)) state.teams.push(t);
                });
            })
            .addCase(removeMemberFromTeam.fulfilled, (state, action) => {
                const { memberId, teams } = action.payload;
                state.teamMembers = state.teamMembers.map(m =>
                    m._id === memberId ? { ...m, teams } : m
                );
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Merge existing user data with updates
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
