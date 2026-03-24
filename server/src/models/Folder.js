const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a folder name'],
        trim: true,
        maxlength: [100, 'Folder name cannot be more than 100 characters']
    },
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
        required: true
    },
    color: {
        type: String,
        default: '#9ca3af' // Default gray
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Folder', folderSchema);
