const fs = require('fs');
const path = require('path');

// This would generate sample image processing jobs
// In a real application, you would have actual image files
const generateJobs = (count = 100) => {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    jobs.push({
      id: `job-${i < 10 ? '0' + i : i}`,
      type: 'resize',
      input: `image-${i}.jpg`,
      width: 800,
      height: 600,
      output: `resized-${i}.jpg`,
      // In a real scenario, we might add more complexity
      // or different types of image operations
      complexity: Math.floor(Math.random() * 10) + 1 // 1-10 complexity factor
    });
  }
  return jobs;
};

module.exports = { generateJobs };

