// child-process/worker.js
// This file runs as a separate process

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

// Inform the master process that this worker is ready
process.stdout.write(JSON.stringify({ type: 'ready' }) + '\n');

// Handle incoming jobs
process.stdin.on('data', (data) => {
  try {
    const job = JSON.parse(data.toString());
    
    // Process the job
    // console.log(`Worker processing job: ${job.id}`);
    process.stdout.write(`${job.id}`);
    const result = processImage(job);
    
    // Send the result back to the master
    process.stdout.write(JSON.stringify({
      type: 'completed',
      jobId: job.id,
      result
    }) + '\n');
  } catch (err) {
    process.stderr.write(`Error processing job: ${err.message}\n`);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
   process.stderr.write('received SIGTERM');
  process.exit(0);
});