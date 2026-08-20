import { Worker } from 'bullmq';

const worker = new Worker('deal-analysis', async job => {
  console.log(`[Worker] Processing deal analysis job: ${job.id}`);
  // Run background tasks like writing audit logs or sync notifications
});
