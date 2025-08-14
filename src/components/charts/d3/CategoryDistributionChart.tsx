import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Technology } from '../../../types/types';

interface Props {
  technologies: Technology[];
}

const CategoryDistributionChart: React.FC<Props> = ({ technologies }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!technologies || technologies.length === 0) return;

    // Process data
    const categoryCounts: { [key: string]: number } = technologies.reduce((acc, tech) => {
      acc[tech.category] = (acc[tech.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const data = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

    const width = 450;
    const height = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.schemeDark2);

    const pie = d3.pie<{name: string, value: number}>()
      .value(d => d.value);

    const data_ready = pie(data);

    const arc = d3.arc<d3.PieArcDatum<{name: string, value: number}>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    svg.selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.name))
      .attr("stroke", "#1a1a1a")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

  }, [technologies]);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg ref={ref} />
    </div>
  );
};

export default CategoryDistributionChart;
