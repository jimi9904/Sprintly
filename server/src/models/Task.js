const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const subtaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const attachmentSchema = new mongoose.Schema({
    url: String,
    public_id: String,
    name: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a task title'],
        trim: true,
        maxlength: [100, 'Task title cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'review', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    // Updated to array of assignees
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: String,
        trim: true
    }],
    attachments: [attachmentSchema],
    comments: [commentSchema],
    subtasks: [subtaskSchema],
    timeTracking: {
        totalTimeSpent: {
            type: Number, // In seconds
            default: 0
        },
        isTimerRunning: {
            type: Boolean,
            default: false
        },
        startTime: {
            type: Date
        }
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Add text index for global search
taskSchema.index({ title: 'text', description: 'text' });
// Add performance indexes for lookups and aggregations
taskSchema.index({ project: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, createdAt: -1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
