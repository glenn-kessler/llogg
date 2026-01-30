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
  });

  // Calculate label interval to prevent crowding
  const maxLabelLength = 10; // Same as truncation limit
  const labelInterval = calculateLabelInterval(chartWidth, data.length, maxLabelLength, 11);

  // X-axis labels (with intelligent spacing and multi-line support)
  data.forEach((step, stepIndex) => {
    // Only show labels at calculated intervals
    if (stepIndex % labelInterval !== 0) return;

    const groupX = padding.left + (stepIndex * groupWidth);
    const labelObj = typeof step.label === 'object' ? step.label : { line1: step.label, line2: '', showMonthLine2: false };

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', groupX + groupWidth / 2);
    label.setAttribute('y', height - padding.bottom + 15);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#bdc3c7');
    label.setAttribute('font-size', '11');

    // Line 1 (day/week/hour)
    const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan1.setAttribute('x', groupX + groupWidth / 2);
    tspan1.setAttribute('dy', '0');
    tspan1.textContent = truncateLabel(labelObj.line1, maxLabelLength);
    label.appendChild(tspan1);

    // Line 2 (month) - only if provided
    if (labelObj.showMonthLine2 && labelObj.line2) {
      const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan2.setAttribute('x', groupX + groupWidth / 2);
      tspan2.setAttribute('dy', '12');
      tspan2.textContent = labelObj.line2;
      label.appendChild(tspan2);
    }

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

  // Calculate label interval to prevent crowding
  const maxLabelLength = 8; // Same as truncation limit
  const labelInterval = calculateLabelInterval(chartWidth, data.length, maxLabelLength, 11);

  // X-axis labels (with intelligent spacing and multi-line support)
  data.forEach((step, index) => {
    // Only show labels at calculated intervals
    if (index % labelInterval !== 0) return;

    const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
    const labelObj = typeof step.label === 'object' ? step.label : { line1: step.label, line2: '', showMonthLine2: false };

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', height - padding.bottom + 15);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#bdc3c7');
    label.setAttribute('font-size', '11');

    // Line 1 (day/week/hour)
    const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan1.setAttribute('x', x);
    tspan1.setAttribute('dy', '0');
    tspan1.textContent = truncateLabel(labelObj.line1, maxLabelLength);
    label.appendChild(tspan1);

    // Line 2 (month) - only if provided
    if (labelObj.showMonthLine2 && labelObj.line2) {
      const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan2.setAttribute('x', x);
      tspan2.setAttribute('dy', '12');
      tspan2.textContent = labelObj.line2;
      label.appendChild(tspan2);
    }

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
 * Calculate automatic step size based on timespan (F-4.12)
 * @param {number} timespanValue
 * @param {string} timespanUnit
 * @returns {string} - '3hours'|'day'|'week'|'month'
 */
export function calculateAutoStepSize(timespanValue, timespanUnit) {
  // Convert to days for easier comparison
  let totalDays = 0;
  switch (timespanUnit) {
    case 'hours':
      totalDays = timespanValue / 24;
      break;
    case 'days':
      totalDays = timespanValue;
      break;
    case 'weeks':
      totalDays = timespanValue * 7;
      break;
    case 'months':
      totalDays = timespanValue * 30; // approximate
      break;
    case 'years':
      totalDays = timespanValue * 365; // approximate
      break;
  }

  // F-4.12: New step size logic
  // 1 Day → 3h steps
  if (totalDays <= 1) return '3hours';

  // 2-7 Days → 1 Day steps
  // 1 Week (7 days) → 1 Day steps
  if (totalDays <= 7) return 'day';

  // 2-4 Weeks → Calendar weeks (KW1 KW2...)
  // 1 Month (30 days) → Calendar weeks
  if (totalDays <= 30) return 'week';

  // 2-6 Months → Months (Jan Feb Mar...)
  if (totalDays <= 180) return 'month';

  // More than 6 months → Months
  return 'month';
}

/**
 * Calculate label interval to prevent X-axis label crowding
 * @param {number} chartWidth - Available width for labels in pixels
 * @param {number} labelCount - Total number of labels
 * @param {number} maxLabelLength - Maximum length of labels (characters)
 * @param {number} fontSize - Font size in pixels (default: 11)
 * @returns {number} - Interval for showing labels (1 = show all, 2 = show every 2nd, etc.)
 */
export function calculateLabelInterval(chartWidth, labelCount, maxLabelLength, fontSize = 11) {
  if (labelCount === 0) return 1;

  // Estimate label width in pixels
  // Approximate: each character takes ~0.6 * fontSize pixels in monospace/proportional fonts
  const charWidthPixels = fontSize * 0.6;
  const estimatedLabelWidth = maxLabelLength * charWidthPixels;

  // Add minimum spacing between labels (pixels)
  const minSpacing = 15;
  const requiredSpacePerLabel = estimatedLabelWidth + minSpacing;

  // Calculate available space per label
  const availableSpacePerLabel = chartWidth / labelCount;

  // Calculate how many labels we need to skip to fit comfortably
  const interval = Math.ceil(requiredSpacePerLabel / availableSpacePerLabel);

  // Ensure interval is at least 1
  return Math.max(1, interval);
}

/**
 * Aggregate entries by time steps
 * @param {Array} entries
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {string} stepSize - '3hours'|'day'|'week'|'month'
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
      case '3hours':
        stepEnd.setUTCHours(stepEnd.getUTCHours() + 3);
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
      label: null // Will be set below after all steps are generated
    });

    current.setTime(stepEnd.getTime());
  }

  // Now calculate labels with prev/next context
  for (let i = 0; i < steps.length; i++) {
    const prevDate = i > 0 ? steps[i - 1].start : null;
    const nextDate = i < steps.length - 1 ? steps[i + 1].start : null;
    steps[i].label = formatStepLabel(steps[i].start, stepSize, prevDate, nextDate);
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
 * Format step label based on step size (F-4.12)
 * @param {Date} date - Current date
 * @param {string} stepSize - Step size
 * @param {Date} prevDate - Previous date (for month change detection)
 * @param {Date} nextDate - Next date (for month change detection)
 * @returns {Object} - { line1, line2, showMonthLine2 }
 */
function formatStepLabel(date, stepSize, prevDate = null, nextDate = null) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const currentMonth = date.getUTCMonth();
  const currentDay = date.getUTCDate();
  const prevMonth = prevDate ? prevDate.getUTCMonth() : null;
  const nextMonth = nextDate ? nextDate.getUTCMonth() : null;
  const prevDay = prevDate ? prevDate.getUTCDate() : null;

  switch (stepSize) {
    case '3hours':
      // Show time on line 1, date.month on line 2 only when day changes
      const hour = String(date.getUTCHours()).padStart(2, '0');
      const dayChanged = prevDate && prevDay !== currentDay;
      return {
        line1: `${hour}`,
        line2: dayChanged || !prevDate ? `${currentDay}.${months[currentMonth]}` : '',
        showMonthLine2: dayChanged || !prevDate
      };
    case 'day':
      // Show weekday on line 1, month on line 2 only at last day of each month
      const isLastDayOfMonth = !nextDate || nextMonth !== currentMonth;
      return {
        line1: days[date.getUTCDay()],
        line2: isLastDayOfMonth ? months[currentMonth] : '',
        showMonthLine2: isLastDayOfMonth,
        monthValue: currentMonth
      };
    case 'week':
      // Show calendar week on line 1, month on line 2 only at last week of each month
      const weekNumber = getISOWeek(date);
      const isLastWeekOfMonth = !nextDate || nextMonth !== currentMonth;
      return {
        line1: `KW${weekNumber}`,
        line2: isLastWeekOfMonth ? months[currentMonth] : '',
        showMonthLine2: isLastWeekOfMonth,
        monthValue: currentMonth
      };
    case 'month':
      // Show month abbreviation only
      return {
        line1: months[currentMonth],
        line2: '',
        showMonthLine2: false
      };
    default:
      return {
        line1: date.toLocaleDateString(),
        line2: '',
        showMonthLine2: false
      };
  }
}

/**
 * Get ISO week number for a date
 * @param {Date} date
 * @returns {number}
 */
function getISOWeek(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const jan4 = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const dayDiff = (target - jan4) / 86400000;
  return 1 + Math.ceil(dayDiff / 7);
}
