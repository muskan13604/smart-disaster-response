const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    severity: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Critical'], 
        required: true 
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { 
            type: [Number], // [longitude, latitude]
            required: true 
        }
    },
    affectedRadius: { type: Number, required: true }, // in meters
    description: { type: String, required: true },
    images: [{ type: String }],
    status: {
        type: String,
        enum: ['Upcoming', 'Active', 'Controlled', 'Closed'],
        default: 'Upcoming'
    },
    priority: { type: Number, default: 0 },
    affectedPeopleEstimate: { type: Number, default: 0 }
}, { timestamps: true });

// Create a geospatial index for queries
disasterSchema.index({ location: '2dsphere' });
// Index for search
disasterSchema.index({ title: 'text', description: 'text', type: 'text' });

module.exports = mongoose.model('Disaster', disasterSchema);
