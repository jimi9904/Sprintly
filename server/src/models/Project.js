const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a project name'],
        trim: true,
        maxlength: [100, 'Project name cannot be more than 100 characters']
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
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space'
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add text index for global search
projectSchema.index({ name: 'text', description: 'text' });
// Add performance indexes for frequent lookups
projectSchema.index({ workspaceId: 1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ workspaceId: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
