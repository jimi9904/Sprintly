const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a workspace name'],
        trim: true,
        maxlength: [100, 'Workspace name cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'member', 'viewer'],
            default: 'member'
        },
        teams: [{
            type: String
        }],
        status: {
            type: String,
            enum: ['pending', 'joined'],
            default: 'pending'
        }
    }],
    departments: [{
        type: String
    }],
    settings: {
        theme: {
            type: String,
            default: 'light'
        },
        color: {
            type: String,
            default: 'blue'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workspace', workspaceSchema);
