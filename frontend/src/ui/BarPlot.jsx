import * as d3 from "d3";
import { useState, useRef } from "react";

export default function BarPlot({ data, width, height }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 40;
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - marginRight - marginLeft;
  const boundsHeight = height - marginTop - marginBottom;
  const xScale = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        data,
        ([d]) => -d.value,
        (d) => d.name,
      ),
    )
    .range([0, boundsWidth])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)]) // data goes from 0 to max(data) -> balken werden angeordnet nach größe
    .range([boundsHeight, 0]); // axis goes from bottom to top

  const handleMouseMove = (event, d) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: event.clientX - rect.left + 10,
      y: event.clientY - rect.top - 10,
      name: d.name,
      value: d.value,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // read the data
  // do some stuff with d3
  // compute all the <rect>
  // Build the shapes
  const allShapes = data.map((d, i) => {
    const x = xScale(d.name);
    if (x === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <rect
          x={x}
          y={yScale(d.value)}
          width={xScale.bandwidth()}
          height={boundsHeight - yScale(d.value)}
          opacity={0.9}
          stroke="#FF0038"
          fill="#FF6285"
          fillOpacity={1}
          strokeWidth={1}
          rx={1}
          onMouseEnter={(event) => handleMouseMove(event, d)}
          onMouseMove={(event) => handleMouseMove(event, d)}
          onMouseLeave={handleMouseLeave}
        />
        <text
          x={x + xScale.bandwidth() / 2}
          y={yScale(0) + 13}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={15}
          fontWeight={500}
        >
          {d.name}
        </text>
      </g>
    );
  });
  const grid = yScale.ticks(5).map((value, i) => (
    <g key={i}>
      <line
        x1={0}
        x2={boundsWidth}
        y1={yScale(value)}
        y2={yScale(value)}
        stroke="#808080"
        opacity={0.3}
      />
      <text
        x={-13}
        y={yScale(value)}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize={13}
        fontWeight={100}
        stroke="#808080"
        opacity={0.7}
      >
        {value}
      </text>
    </g>
  ));

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} ref={svgRef}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[marginLeft, marginTop].join(",")})`}
        >
          {grid}
          {allShapes}
        </g>
      </svg>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            background: "#FFF7F8",
            border: "1px solid #FF9AAC",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 15,
            pointerEvents: "none",
            boxShadow: "0 2px 2px rgba(0,0,0,0.15)",
            whiteSpace: "nowrap",
          }}
        >
          <div>
            <strong>{tooltip.name}</strong>
          </div>
          <div>Wert: {tooltip.value}</div>
        </div>
      )}
    </div>
  );
}
