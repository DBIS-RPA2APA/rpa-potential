import * as d3 from "d3";
import { useState, useRef, useMemo } from "react";

const colors = ["#6DC800", "#5315B3", "#FFAF00", "#FF5573", "#EFEFEF"];
const margin = 30;

export default function PieChart({ data, width, height }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const radius = Math.min(width, height) / 2 - margin;
  const pie = useMemo(() => {
    const pieGenerator = d3.pie().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  const arcGenerator = useMemo(() => {
    return d3.arc().innerRadius(0).outerRadius(radius);
  }, [radius]);

  const arcs = useMemo(() => {
    return pie.map((p) => ({
      ...p,
      path: arcGenerator(p),
    }));
  }, [pie, arcGenerator]);

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

  return (
    <div style={{ position: "relative", width, height }}>
      <svg
        width={width}
        height={height}
        style={{ display: "inline-block" }}
        ref={svgRef}
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arcData, i) => {
            const [x, y] = arcGenerator.centroid(arcData);

            return (
              <g key={i}>
                {/* Slice */}
                <path
                  d={arcData.path}
                  fill={colors[i]}
                  onMouseMove={(e) => handleMouseMove(e, data[i])}
                  onMouseLeave={handleMouseLeave}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={13}
                  fill="white"
                  pointerEvents="none"
                >
                  {data[i].name} ({data[i].value})
                </text>
              </g>
            );
          })}
        </g>
        ;
      </svg>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            border: "1px solid #383838",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 15,
            pointerEvents: "none",
            boxShadow: "0 2px 2px rgba(0,0,0,0.15)",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontSize: 15, color: "#383838" }}>
            <strong>{tooltip.name}</strong>
          </div>
          <div>Wert: {tooltip.value}</div>
        </div>
      )}
    </div>
  );
}
