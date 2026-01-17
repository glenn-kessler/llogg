/**
 * SVG Chart Components (F-4.8, F-4.9)
 * Simple, lightweight charts - bar, line, pie
 * Enhanced with time-based step sizes and axis orientation
 */

/**
 * Render Bar Chart (F-4.8 - default representation)
 * @param {SVGElement} svg
 * @param {Array} data - [{ label, value, color }] OR [{ label, items: [{ name, value, color }] }] for grouped
 * @param {Object} options - { orientation: 'vertical'|'horizontal', stepLabels: [] }
 */
export function renderBarChart(svg, data, options = {}) {
  const { orientation = 'vertical', stepLabels = null } = options;
  if (!data || data.length === 0) {
    renderEmptyState(svg, 'No data available');
    return;
  }

  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 400;
  const padding = { top: 40, right: 20, bottom: 60, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Clear existing content
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.value), 1);

  // Bar width
  const barWidth = chartWidth / data.length * 0.7;
  const barSpacing = chartWidth / data.length;

  // Draw bars
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = padding.left + (index * barSpacing) + (barSpacing - barWidth) / 2;
    const y = padding.top + (chartHeight - barHeight);

    // Bar
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', item.color || '#3498db');
    rect.setAttribute('rx', 4);
    svg.appendChild(rect);

    // Value label on top of bar
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', x + barWidth / 2);
    valueText.setAttribute('y', y - 5);
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('fill', '#ecf0f1');
    valueText.setAttribute('font-size', '12');
    valueText.textContent = item.value;
    svg.appendChild(valueText);

    // X-axis label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + barWidth / 2);
    label.setAttribute('y', height - padding.bottom + 20);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#bdc3c7');
    label.setAttribute('font-size', '12');
    label.textContent = truncateLabel(item.label, 10);
    svg.appendChild(label);
  });

  // Y-axis
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', padding.left);
  yAxis.setAttribute('y1', padding.top);
  yAxis.setAttribute('x2', padding.left);
  yAxis.setAttribute('y2', height - padding.bottom);
  yAxis.setAttribute('stroke', '#95a5a6');
  yAxis.setAttribute('stroke-width', 2);
  svg.appendChild(yAxis);

  // X-axis
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('y1', height - padding.bottom);
  xAxis.setAttribute('x2', width - padding.right);
  xAxis.setAttribute('y2', height - padding.bottom);
  xAxis.setAttribute('stroke', '#95a5a6');
  xAxis.setAttribute('stroke-width', 2);
  svg.appendChild(xAxis);
}

/**
 * Render Grouped Bar Chart for time-based data
 * @param {SVGElement} svg
 * @param {Array} data - [{label, items: [{name, value, color}]}]
 * @param {Object} options - { orientation: 'vertical'|'horizontal' }
 */
export function renderGroupedBarChart(svg, data, options = {}) {
  const { orientation = 'vertical' } = options;

  if (!data || data.length === 0) {
    renderEmptyState(svg, 'No data available');
    return;
  }

  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 400;
  const padding = { top: 40, right: 20, bottom: 60, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Find max value
  let maxValue = 0;
  data.forEach(step => {
    const stepTotal = step.items.reduce((sum, item) => sum + item.value, 0);
    if (stepTotal > maxValue) maxValue = stepTotal;
  });

  if (maxValue === 0) maxValue = 1;

  // Calculate bar dimensions
  const groupWidth = chartWidth / data.length;
  const barWidth = groupWidth / (Math.max(...data.map(d => d.items.length)) || 1) * 0.8;

  // Draw grouped bars
  data.forEach((step, stepIndex) => {
    const groupX = padding.left + (stepIndex * groupWidth);

    step.items.forEach((item, itemIndex) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = groupX + (itemIndex * barWidth) + (groupWidth - step.items.length * barWidth) / 2;
      const y = padding.top + (chartHeight - barHeight);

      // Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', barHeight);
      rect.setAttribute('fill', item.color);
      rect.setAttribute('rx', 2);
      svg.appendChild(rect);

      // Value label (only if bar is tall enough)
      if (barHeight > 20) {
        const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueText.setAttribute('x', x + barWidth / 2);
        valueText.setAttribute('y', y - 3);
        valueText.setAttribute('text-anchor', 'middle');
        valueText.setAttribute('fill', '#ecf0f1');
        valueText.setAttribute('font-size', '10');
        valueText.textContent = item.value;
        svg.appendChild(valueText);
      }
    });

    // X-axis label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', groupX + groupWidth / 2);
    label.setAttribute('y', height - padding.bottom + 20);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#bdc3c7');
    label.setAttribute('font-size', '11');
    label.textContent = truncateLabel(step.label, 10);
    svg.appendChild(label);
  });

  // Axes
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', padding.left);
  yAxis.setAttribute('y1', padding.top);
  yAxis.setAttribute('x2', padding.left);
  yAxis.setAttribute('y2', height - padding.bottom);
  yAxis.setAttribute('stroke', '#95a5a6');
  yAxis.setAttribute('stroke-width', 2);
  svg.appendChild(yAxis);

  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('y1', height - padding.bottom);
  xAxis.setAttribute('x2', width - padding.right);
  xAxis.setAttribute('y2', height - padding.bottom);
  xAxis.setAttribute('stroke', '#95a5a6');
  xAxis.setAttribute('stroke-width', 2);
  svg.appendChild(xAxis);
}

/**
 * Render Line Chart (F-4.9)
 * @param {SVGElement} svg
 * @param {Array} data - [{ label, value, color }]
 */
export function renderLineChart(svg, data) {
  if (!data || data.length === 0) {
    renderEmptyState(svg, 'No data available');
    return;
  }

  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 400;
  const padding = { top: 40, right: 20, bottom: 60, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const step = chartWidth / (data.length - 1 || 1);

  // Build path
  let pathD = '';
  const points = [];

  data.forEach((item, index) => {
    const x = padding.left + (index * step);
    const y = padding.top + (chartHeight - (item.value / maxValue) * chartHeight);

    points.push({ x, y, item });

    if (index === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
  });

  // Draw line
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  path.setAttribute('stroke', data[0]?.color || '#3498db');
  path.setAttribute('stroke-width', 3);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);

  // Draw points
  points.forEach(point => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', point.item.color || '#3498db');
    circle.setAttribute('stroke', '#1a1a1a');
    circle.setAttribute('stroke-width', 2);
    svg.appendChild(circle);

    // Value label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', point.x);
    text.setAttribute('y', point.y - 10);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#ecf0f1');
    text.setAttribute('font-size', '12');
    text.textContent = point.item.value;
    svg.appendChild(text);
  });

  // X-axis labels
  data.forEach((item, index) => {
    const x = padding.left + (index * step);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', height - padding.bottom + 20);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#bdc3c7');
    label.setAttribute('font-size', '12');
    label.textContent = truncateLabel(item.label, 8);
    svg.appendChild(label);
  });

  // Axes
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', padding.left);
  yAxis.setAttribute('y1', padding.top);
  yAxis.setAttribute('x2', padding.left);
  yAxis.setAttribute('y2', height - padding.bottom);
  yAxis.setAttribute('stroke', '#95a5a6');
  yAxis.setAttribute('stroke-width', 2);
  svg.appendChild(yAxis);

  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('y1', height - padding.bottom);
  xAxis.setAttribute('x2', width - padding.right);
  xAxis.setAttribute('y2', height - padding.bottom);
  xAxis.setAttribute('stroke', '#95a5a6');
  xAxis.setAttribute('stroke-width', 2);
  svg.appendChild(xAxis);
}

/**
 * Render Multi-Line Chart for time-based data with multiple series
 * @param {SVGElement} svg
 * @param {Array} data - [{label, items: [{name, value, color}]}]
 * @param {Object} options - { orientation: 'vertical'|'horizontal' }
 */
export function renderMultiLineChart(svg, data, options = {}) {
  if (!data || data.length === 0) {
    renderEmptyState(svg, 'No data available');
    return;
  }

  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 400;
  const padding = { top: 40, right: 20, bottom: 60, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Find max value and collect all series
  let maxValue = 0;
  const allSeries = new Map(); // name -> {name, color, points: [{x, y, value}]}

  data.forEach((step, stepIndex) => {
    step.items.forEach(item => {
      if (item.value > maxValue) maxValue = item.value;

      if (!allSeries.has(item.name)) {
        allSeries.set(item.name, {
          name: item.name,
          color: item.color,
          points: []
        });
      }

      const x = padding.left + (stepIndex / (data.length - 1 || 1)) * chartWidth;
      const y = padding.top + (chartHeight - (item.value / (maxValue || 1)) * chartHeight);

      allSeries.get(item.name).points.push({ x, y, value: item.value });
    });
  });

  // Draw each line series
  allSeries.forEach(series => {
    if (series.points.length === 0) return;

    // Build path
    let pathD = '';
    series.points.forEach((point, index) => {
      if (index === 0) {
        pathD += `M ${point.x} ${point.y}`;
      } else {
        pathD += ` L ${point.x} ${point.y}`;
      }
    });

    // Draw line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('stroke', series.color);
    path.setAttribute('stroke-width', 2);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);

    // Draw points
    series.points.forEach(point => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      circle.setAttribute('r', 4);
      circle.setAttribute('fill', series.color);
      circle.setAttribute('stroke', '#1a1a1a');
      circle.setAttribute('stroke-width', 1);
      svg.appendChild(circle);
    });
  });

  // X-axis labels
  data.forEach((step, index) => {
    const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', height - padding.bottom + 20);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#bdc3c7');
    label.setAttribute('font-size', '11');
    label.textContent = truncateLabel(step.label, 8);
    svg.appendChild(label);
  });

  // Axes
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', padding.left);
  yAxis.setAttribute('y1', padding.top);
  yAxis.setAttribute('x2', padding.left);
  yAxis.setAttribute('y2', height - padding.bottom);
  yAxis.setAttribute('stroke', '#95a5a6');
  yAxis.setAttribute('stroke-width', 2);
  svg.appendChild(yAxis);

  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('y1', height - padding.bottom);
  xAxis.setAttribute('x2', width - padding.right);
  xAxis.setAttribute('y2', height - padding.bottom);
  xAxis.setAttribute('stroke', '#95a5a6');
  xAxis.setAttribute('stroke-width', 2);
  svg.appendChild(xAxis);

  // Legend
  const legendX = width - 150;
  let legendY = padding.top;

  allSeries.forEach((series, index) => {
    const y = legendY + (index * 20);

    // Color line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', legendX);
    line.setAttribute('y1', y + 7);
    line.setAttribute('x2', legendX + 20);
    line.setAttribute('y2', y + 7);
    line.setAttribute('stroke', series.color);
    line.setAttribute('stroke-width', 3);
    svg.appendChild(line);

    // Label text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', legendX + 25);
    text.setAttribute('y', y + 12);
    text.setAttribute('fill', '#ecf0f1');
    text.setAttribute('font-size', '11');
    text.textContent = truncateLabel(series.name, 12);
    svg.appendChild(text);
  });
}

/**
 * Render Pie Chart (F-4.9)
 * @param {SVGElement} svg
 * @param {Array} data - [{ label, value, color }]
 */
export function renderPieChart(svg, data) {
  if (!data || data.length === 0) {
    renderEmptyState(svg, 'No data available');
    return;
  }

  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 400;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    renderEmptyState(svg, 'No data available');
    return;
  }

  let currentAngle = -90; // Start at top

  data.forEach((item, index) => {
    const percentage = (item.value / total) * 100;
    const sliceAngle = (item.value / total) * 360;

    // Calculate slice path
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathD = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`);
    path.setAttribute('stroke', '#1a1a1a');
    path.setAttribute('stroke-width', 2);
    svg.appendChild(path);

    // Label
    const labelAngle = startAngle + sliceAngle / 2;
    const labelRad = (labelAngle * Math.PI) / 180;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelRad);
    const labelY = centerY + labelRadius * Math.sin(labelRad);

    if (percentage > 5) { // Only show label if slice is big enough
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX);
      text.setAttribute('y', labelY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#ffffff');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', 'bold');
      text.textContent = `${percentage.toFixed(0)}%`;
      svg.appendChild(text);
    }

    currentAngle = endAngle;
  });

  // Legend
  const legendX = 20;
  let legendY = height - (data.length * 25) - 20;

  data.forEach((item, index) => {
    const y = legendY + (index * 25);

    // Color box
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', legendX);
    rect.setAttribute('y', y);
    rect.setAttribute('width', 15);
    rect.setAttribute('height', 15);
    rect.setAttribute('fill', item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`);
    svg.appendChild(rect);

    // Label text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', legendX + 20);
    text.setAttribute('y', y + 12);
    text.setAttribute('fill', '#ecf0f1');
    text.setAttribute('font-size', '12');
    text.textContent = `${truncateLabel(item.label, 15)} (${item.value})`;
    svg.appendChild(text);
  });
}

/**
 * Render empty state
 * @param {SVGElement} svg
 * @param {string} message
 */
function renderEmptyState(svg, message) {
  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 400;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', width / 2);
  text.setAttribute('y', height / 2);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('fill', '#95a5a6');
  text.setAttribute('font-size', '18');
  text.textContent = message;
  svg.appendChild(text);
}

/**
 * Render Horizontal Bar Chart for item-based aggregation (X=counter mode)
 * @param {SVGElement} svg
 * @param {Array} data - [{label, items: [{name, value, color}]}]
 * @param {Object} options
 */
export function renderHorizontalBarChart(svg, data, options = {}) {
  if (!data || data.length === 0 || !data[0] || !data[0].items) {
    renderEmptyState(svg, 'No data available');
    return;
  }

  const items = data[0].items; // X-mode has single group with all items

  const width = svg.clientWidth || 600;
  const height = svg.clientHeight || 400;
  const padding = { top: 40, right: 80, bottom: 40, left: 120 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Find max value
  const maxValue = Math.max(...items.map(item => item.value), 1);

  // Bar height
  const barHeight = chartHeight / items.length * 0.7;
  const barSpacing = chartHeight / items.length;

  // Draw horizontal bars
  items.forEach((item, index) => {
    const barWidth = (item.value / maxValue) * chartWidth;
    const x = padding.left;
    const y = padding.top + (index * barSpacing) + (barSpacing - barHeight) / 2;

    // Bar
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', item.color);
    rect.setAttribute('rx', 2);
    svg.appendChild(rect);

    // Value label at end of bar
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', x + barWidth + 5);
    valueText.setAttribute('y', y + barHeight / 2 + 4);
    valueText.setAttribute('text-anchor', 'start');
    valueText.setAttribute('fill', '#ecf0f1');
    valueText.setAttribute('font-size', '12');
    valueText.textContent = item.value;
    svg.appendChild(valueText);

    // Y-axis label (item name)
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', padding.left - 10);
    label.setAttribute('y', y + barHeight / 2 + 4);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('fill', '#bdc3c7');
    label.setAttribute('font-size', '12');
    label.textContent = truncateLabel(item.name, 15);
    svg.appendChild(label);
  });

  // Y-axis
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', padding.left);
  yAxis.setAttribute('y1', padding.top);
  yAxis.setAttribute('x2', padding.left);
  yAxis.setAttribute('y2', height - padding.bottom);
  yAxis.setAttribute('stroke', '#95a5a6');
  yAxis.setAttribute('stroke-width', 2);
  svg.appendChild(yAxis);

  // X-axis
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding.left);
  xAxis.setAttribute('y1', height - padding.bottom);
  xAxis.setAttribute('x2', width - padding.right);
  xAxis.setAttribute('y2', height - padding.bottom);
  xAxis.setAttribute('stroke', '#95a5a6');
  xAxis.setAttribute('stroke-width', 2);
  svg.appendChild(xAxis);
}

/**
 * Truncate label to max length
 * @param {string} label
 * @param {number} maxLength
 * @returns {string}
 */
function truncateLabel(label, maxLength) {
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 1) + '…';
}

/**
 * Calculate automatic step size based on timespan
 * @param {number} timespanValue
 * @param {string} timespanUnit
 * @returns {string} - 'hour'|'6hours'|'day'|'week'|'month'
 */
export function calculateAutoStepSize(timespanValue, timespanUnit) {
  // Convert to hours for comparison
  let totalHours = 0;
  switch (timespanUnit) {
    case 'hours':
      totalHours = timespanValue;
      break;
    case 'days':
      totalHours = timespanValue * 24;
      break;
    case 'weeks':
      totalHours = timespanValue * 24 * 7;
      break;
    case 'months':
      totalHours = timespanValue * 24 * 30; // approximate
      break;
  }

  // Decide step size
  if (totalHours <= 24) return 'hour';           // 1 day or less → 1h steps
  if (totalHours <= 72) return '6hours';          // 2-3 days → 6h steps
  if (totalHours <= 30 * 24) return 'day';        // Up to 30 days → 1 day steps
  if (totalHours <= 90 * 24) return 'week';       // Up to 3 months → 1 week steps
  return 'month';                                  // More than 3 months → 1 month steps
}

/**
 * Aggregate entries by time steps
 * @param {Array} entries
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {string} stepSize - 'hour'|'6hours'|'day'|'week'|'month'
 * @param {string} aggLevel - 'type'|'detail'
 * @param {Array} selectedIds
 * @param {Array} types
 * @param {Function} getDetailFn
 * @returns {Promise<Array>} - [{label, items: [{name, value, color}]}]
 */
export async function aggregateByTimeSteps(entries, startTime, endTime, stepSize, aggLevel, selectedIds, types, getDetailFn) {
  const steps = [];
  const current = new Date(startTime);
  const end = new Date(endTime);

  // Generate time steps using UTC to match ISO timestamp format in database
  while (current < end) {
    const stepStart = new Date(current);
    const stepEnd = new Date(stepStart);

    switch (stepSize) {
      case 'hour':
        stepEnd.setUTCHours(stepEnd.getUTCHours() + 1);
        break;
      case '6hours':
        stepEnd.setUTCHours(stepEnd.getUTCHours() + 6);
        break;
      case 'day':
        stepEnd.setUTCDate(stepEnd.getUTCDate() + 1);
        break;
      case 'week':
        stepEnd.setUTCDate(stepEnd.getUTCDate() + 7);
        break;
      case 'month':
        stepEnd.setUTCMonth(stepEnd.getUTCMonth() + 1);
        break;
    }

    steps.push({
      start: new Date(stepStart),
      end: new Date(stepEnd),
      label: formatStepLabel(stepStart, stepSize)
    });

    current.setTime(stepEnd.getTime());
  }

  // Aggregate entries into steps
  const result = [];

  for (const step of steps) {
    const stepEntries = entries.filter(e => {
      const entryTime = new Date(e.timestamp);
      return entryTime >= step.start && entryTime < step.end;
    });

    const items = {};

    if (aggLevel === 'type') {
      for (const entry of stepEntries) {
        if (!items[entry.typeId]) {
          const type = types.find(t => t.id === entry.typeId);
          items[entry.typeId] = {
            name: type?.name || 'Unknown',
            value: 0,
            color: type?.color || '#95a5a6'
          };
        }
        items[entry.typeId].value += entry.count;
      }
    } else {
      for (const entry of stepEntries) {
        if (!items[entry.detailId]) {
          const detail = await getDetailFn(entry.detailId);
          items[entry.detailId] = {
            name: detail?.name || 'Unknown',
            value: 0,
            color: detail?.color || '#95a5a6'
          };
        }
        items[entry.detailId].value += entry.count;
      }
    }

    result.push({
      label: step.label,
      items: Object.values(items)
    });
  }

  return result;
}

/**
 * Format step label based on step size
 * @param {Date} date
 * @param {string} stepSize
 * @returns {string}
 */
function formatStepLabel(date, stepSize) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  switch (stepSize) {
    case 'hour':
      return `${date.getUTCHours()}:00`;
    case '6hours':
      return `${date.getUTCHours()}:00`;
    case 'day':
      // Show date and weekday for clarity (e.g., "Jan 2 Mon")
      return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${days[date.getUTCDay()]}`;
    case 'week':
      return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
    case 'month':
      return months[date.getUTCMonth()];
    default:
      return date.toLocaleDateString();
  }
}
