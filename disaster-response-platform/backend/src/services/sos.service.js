const sosRepository = require('../repositories/sos.repository');
const queueService = require('./queue.service');

class SOSService {
    async triggerSOS(data, files, user, io) {
        const { longitude, latitude, severity } = data;
        
        const sosData = {
            citizenId: user.id,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            severity
        };

        if (files) {
            if (files.photo) sosData.photo = `/uploads/${files.photo[0].filename}`;
            if (files.voiceNote) sosData.voiceNote = `/uploads/${files.voiceNote[0].filename}`;
        }

        const sos = await sosRepository.create(sosData);
        
        // Add to priority queue
        await queueService.addSOS(sos);

        // Notify Admin instantly
        if (io) {
            io.to('admin_room').emit('new_sos', sos);
            // Also logic could be added to notify nearby volunteers using Socket.IO specific rooms
        }

        return sos;
    }

    async updateSOSStatus(id, status, assignedTo, io) {
        const data = { status };
        if (assignedTo) data.assignedTo = assignedTo;

        const sos = await sosRepository.update(id, data);
        if (!sos) throw new Error('SOS not found');

        if (io) {
            io.to('admin_room').emit('update_sos', sos);
        }

        return sos;
    }

    async getSOSHistory(query) {
        return await sosRepository.findAll(query);
    }
}

module.exports = new SOSService();
