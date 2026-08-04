const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Ambulance', 'Fire Truck', 'Police', 'Medical Team', 'Helicopter'],
        required: true 
    },
    identifier: { type: String, required: true },
    status: {
        type: String,
        enum: ['Idle', 'Assigned', 'Busy', 'Offline'],
        default: 'Idle'
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [lng, lat]
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Disaster' }
});

resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', resourceSchema);
