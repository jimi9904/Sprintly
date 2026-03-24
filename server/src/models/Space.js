const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a space name'],
        trim: true,
        maxlength: [100, 'Space name cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    color: {
        type: String,
        default: '#3b82f6' // Default blue color
    },
    icon: {
        type: String,
        default: 'LayoutGrid'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Space', spaceSchema);
