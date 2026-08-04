const { Queue, Worker } = require('bullmq');
const redisClient = require('../config/redis');

// Define SOS Priority Queue
const sosQueue = new Queue('sos-queue', { connection: redisClient });

// Worker to process SOS requests from the queue
const sosWorker = new Worker('sos-queue', async job => {
    // This worker could handle notifications, auto-assignments, etc.
    console.log(`Processing SOS request ${job.id} with priority ${job.opts.priority}`);
    // Realtime notification logic can be emitted from here if needed
}, { connection: redisClient });

sosWorker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

sosWorker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});

class QueueService {
    async addSOS(sosData) {
        // Higher severity = lower priority number (processed first)
        const priorityMap = {
            'Critical': 1,
            'High': 2,
            'Medium': 3,
            'Low': 4
        };

        const priority = priorityMap[sosData.severity] || 4;

        await sosQueue.add('new-sos', sosData, {
            priority,
            jobId: sosData._id.toString()
        });
    }
}

module.exports = new QueueService();
