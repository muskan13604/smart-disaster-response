const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
    citizenId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { 
            type: [Number], // [longitude, latitude]
            required: true 
        }
    },
    severity: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Critical'], 
        required: true 
    },
    photo: { type: String },
    voiceNote: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Create a geospatial index
sosSchema.index({ location: '2dsphere' });
// Status index for quick queue checks
sosSchema.index({ status: 1 });

module.exports = mongoose.model('SOS', sosSchema);
