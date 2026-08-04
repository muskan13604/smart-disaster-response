const SOS = require('../models/sos.model');

class SOSRepository {
    async create(data) {
        return await SOS.create(data);
    }

    async findById(id) {
        return await SOS.findById(id).populate('citizenId', 'name email').populate('assignedTo', 'name email');
    }

    async update(id, data) {
        return await SOS.findByIdAndUpdate(id, data, { new: true }).populate('citizenId', 'name email').populate('assignedTo', 'name email');
    }

    async findNearby(longitude, latitude, maxDistanceInMeters) {
        return await SOS.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistanceInMeters
                }
            },
            status: 'Pending'
        }).populate('citizenId', 'name email');
    }

    async findAll(query) {
        return await SOS.find(query).sort({ createdAt: -1 }).populate('citizenId', 'name email');
    }
}
module.exports = new SOSRepository();
