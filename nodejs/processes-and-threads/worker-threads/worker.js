// worker-threads/worker.js
const { parentPort } = require('worker_threads');

// In a real-world scenario, we would use 'sharp' or similar
// for image processing. Here we'll simulate the work.
// const sharp = require('sharp');

// Simulate image processing work
const processImage = (job) => {
  // Simulate CPU-intensive work
  const startTime = Date.now();
  const complexity = job.complexity || 5;
  
  // More complex jobs take longer
  const processingTime = 100 * complexity;
  
  // Simulate CPU-bound work with a busy-wait
  while (Date.now() - startTime < processingTime) {
    // Busy wait to simulate CPU-bound work
    for (let i = 0; i < 1000000; i++) {}
  }
  
  // Return a result
  return {
    processingTime,
    outputSize: `${job.width}x${job.height}`,
    outputPath: job.output
  };
};

// Inform the master thread that this worker is ready
parentPort.postMessage({ type: 'ready' });

// Handle incoming jobs
parentPort.on('message', (job) => {
  try {
    // Process the job
    process.stdout.write(` [ ${job.id} ] `);
    const result = processImage(job);
    
    // Send the result back to the master
    parentPort.postMessage({
      type: 'completed',
      jobId: job.id,
      result
    });
  } catch (err) {
    console.error(`Error processing job: ${err.message}`);
  }
});
