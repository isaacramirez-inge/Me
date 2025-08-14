import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Technology } from '../../../types/types';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  technologies: Technology[];
  timeline: { jobs_history: MainCardData[] };
}

const TechnologyProficiencyChart: React.FC<Props> = ({ technologies, timeline }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!technologies || technologies.length === 0 || !timeline) return;

    // Process data
    const techProficiency: { [key: number]: number } = {};
    timeline.jobs_history.forEach(job => {
      job.projects.forEach(project => {
        project.technologies.forEach(techId => {
          techProficiency[techId] = (techProficiency[techId] || 0) + 1;
        });
      });
    });

    const chartData = Object.entries(techProficiency)
      .map(([id, count]) => {
        const techInfo = technologies.find(t => t.id === parseInt(id));
        return {
          name: techInfo?.name || `Unknown (${id})`,
          value: count,
        };
      })
      .sort((a, b) => a.value - b.value);

    const margin = { top: 20, right: 30, bottom: 40, left: 150 };
    const width = 960 - margin.left - margin.right;
    const height = chartData.length * 25;

    const svg = d3.select(ref.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand()
      .range([0, height])
      .domain(chartData.map(d => d.name))
      .padding(0.1);

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#fff");

    const x = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 0])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "#fff");

    svg.selectAll("myRect")
      .data(chartData)
      .join("rect")
      .attr("y", d => y(d.name)!)
      .attr("x", x(0) )
      .attr("width", d => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", "#2962FF");

  }, [technologies, timeline]);

  return <svg ref={ref} />;
};

export default TechnologyProficiencyChart;
