// Test script to debug aggregation issue

// Simulate the time calculation from main.js
function calculateTimeRange(timespanValue, timespanUnit) {
  const now = new Date('2026-01-16T18:30:00.000+01:00'); // Simulating current time in CET
  const startTime = new Date(now);
  const endTime = new Date(now);

  switch (timespanUnit) {
    case 'days':
      startTime.setDate(now.getDate() - timespanValue);
      startTime.setHours(0, 0, 0, 0);
      endTime.setHours(23, 59, 59, 999);
      break;
  }

  console.log('Now:', now.toISOString());
  console.log('Start Time:', startTime.toISOString());
  console.log('End Time:', endTime.toISOString());
  console.log('');

  return { startTime, endTime };
}

// Simulate the step generation from charts.js
function generateTimeSteps(startTime, endTime, stepSize) {
  const steps = [];
  const current = new Date(startTime);
  const end = new Date(endTime);

  console.log('Generating steps from', current.toISOString(), 'to', end.toISOString());
  console.log('');

  let count = 0;
  while (current < end && count < 20) { // Safety limit
    const stepStart = new Date(current);
    const stepEnd = new Date(stepStart);

    switch (stepSize) {
      case 'day':
        stepEnd.setDate(stepEnd.getDate() + 1);
        break;
    }

    const label = formatStepLabel(stepStart);
    steps.push({
      start: new Date(stepStart),
      end: new Date(stepEnd),
      label
    });

    console.log(`Step ${count + 1}: ${label}`);
    console.log(`  Start: ${stepStart.toISOString()}`);
    console.log(`  End: ${stepEnd.toISOString()}`);

    current.setTime(stepEnd.getTime());
    count++;
  }

  console.log('');
  console.log(`Total steps generated: ${steps.length}`);
  return steps;
}

function formatStepLabel(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()} ${days[date.getDay()]}`;
}

// Test with 14 days
console.log('=== Testing 14 days timespan ===\n');
const { startTime, endTime } = calculateTimeRange(14, 'days');
const steps = generateTimeSteps(startTime, endTime, 'day');

// Test entry filtering
console.log('\n=== Testing entry filtering ===\n');
const testEntries = [
  { timestamp: '2026-01-02T07:15:00.000Z', detail: 'Tired' },
  { timestamp: '2026-01-03T08:45:00.000Z', detail: 'Neutral' },
  { timestamp: '2026-01-16T08:45:00.000Z', detail: 'Energetic' }
];

steps.forEach((step, index) => {
  const matches = testEntries.filter(e => {
    const entryTime = new Date(e.timestamp);
    return entryTime >= step.start && entryTime < step.end;
  });

  if (matches.length > 0) {
    console.log(`Step ${index + 1} (${step.label}): ${matches.length} entries`);
    matches.forEach(m => console.log(`  - ${m.timestamp} (${m.detail})`));
  }
});
