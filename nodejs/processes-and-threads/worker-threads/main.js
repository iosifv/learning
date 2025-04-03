const { Worker } = require('worker_threads');
const path = require('path');
const os = require('os');

// Determine how many workers to spawn (usually based on CPU cores)
const numWorkers = os.cpus().length;

class JobQueue {
  constructor(jobs) {
    this.pendingJobs = [...jobs];
    this.completedJobs = [];
    this.inProgressJobs = new Map();
  }

  hasMoreJobs() {
    return this.pendingJobs.length > 0;
  }

  getNextJob() {
    if (!this.hasMoreJobs()) return null;
    return this.pendingJobs.shift();
  }

  markJobInProgress(jobId, workerId) {
    this.inProgressJobs.set(jobId, workerId);
  }

  markJobCompleted(jobId, result) {
    this.inProgressJobs.delete(jobId);
    this.completedJobs.push({ jobId, result });
  }

  getAllJobsCompleted() {
    return this.pendingJobs.length === 0 && this.inProgressJobs.size === 0;
  }

  getStats() {
    return {
      pending: this.pendingJobs.length,
      inProgress: this.inProgressJobs.size,
      completed: this.completedJobs.length
    };
  }
}

const processBatch = (jobs) => {
  return new Promise((resolve) => {
    const queue = new JobQueue(jobs);
    const workers = [];
    
    console.log(`Starting ${numWorkers} worker threads`);
    
    // Create and track all workers
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(path.join(__dirname, 'worker.js'));
      const workerId = `worker-${i}`;
      
      workers.push({ worker, workerId });
      
      // Handle messages from this worker
      worker.on('message', (message) => {
        if (message.type === 'ready') {
          // Worker is ready for a job
          assignJobToWorker(workerId, worker);
        } else if (message.type === 'completed') {
          // Worker completed a job
          queue.markJobCompleted(message.jobId, message.result);
          
          // Give this worker a new job if available
          assignJobToWorker(workerId, worker);
          
          // Check if all jobs are done
          if (queue.getAllJobsCompleted()) {
            // Clean up all workers
            Promise.all(workers.map(w => w.worker.terminate()))
              .then(() => resolve(queue.completedJobs));
          }
        }
      });
      
      // Handle errors
      worker.on('error', (err) => {
        console.error(`Worker ${workerId} error: ${err}`);
      });
      
      // Handle worker exit
      worker.on('exit', (code) => {
        console.log(`Worker ${workerId} exited with code ${code}`);
      });
    }
    
    // Helper function to assign jobs to workers
    function assignJobToWorker(workerId, worker) {
      if (queue.hasMoreJobs()) {
        const job = queue.getNextJob();
        queue.markJobInProgress(job.id, workerId);
        
        // Send the job to the worker
        worker.postMessage(job);
      } else if (queue.getAllJobsCompleted()) {
        // No more jobs and all are completed
        worker.terminate();
      }
    }
    
    // Log progress periodically
    const progressInterval = setInterval(() => {
      const stats = queue.getStats();
      console.log(`\n\n 👌🏋️‍♀️ =>  Progress: ${stats.completed} completed, ${stats.inProgress} in progress, ${stats.pending} pending`);
      
      if (queue.getAllJobsCompleted()) {
        clearInterval(progressInterval);
      }
    }, 1000);
  });
};

module.exports = { processBatch };