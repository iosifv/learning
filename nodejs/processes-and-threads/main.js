// Main entry point
// main.js
const { generateJobs } = require('./jobs');

// Process command line arguments
const processType = process.argv[2] || 'both';

const runBenchmark = async (type, jobs) => {
  console.time(`\n\n ⏰ => ${type} processing time`);
  
  if (type === 'child-process') {
    const { processBatch } = require('./child-process/main');
    await processBatch(jobs);
  } else if (type === 'worker-threads') {
    const { processBatch } = require('./worker-threads/main');
    await processBatch(jobs);
  }
  
  console.timeEnd(`\n\n ⏰ => ${type} processing time`);
};

// Generate sample jobs
const jobs = generateJobs(50);

(async () => {
  
  console.log('Starting job processing benchmark...');

  if (processType === 'both' || processType === 'child-process') {
    console.log('\n=== Using Child Processes ===');
    await runBenchmark('child-process', jobs);
  }
  
  if (processType === 'both' || processType === 'worker-threads') {
    console.log('\n=== Using Worker Threads ===');
    await runBenchmark('worker-threads', jobs);
  }
  
  console.log('\nBenchmark completed!');
})();