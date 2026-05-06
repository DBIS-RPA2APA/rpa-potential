import * as d3 from "d3";
import { RadarGrid, INNER_RADIUS } from "./RadarGrid";

const MARGIN = 40;

export default function Radar({ width, height, data }) {
  const outerRadius = Math.min(width, height) / 2 - MARGIN;

  const axisConfig = data.map((d) => ({
    name: d.name,
    max: 1,
  }));

  const allVariableNames = axisConfig.map((axis) => axis.name);

  // The x scale provides an angle for each variable of the dataset
  const xScale = d3
    .scaleBand()
    .domain(allVariableNames) // domain list of variable names
    .range([0, 2 * Math.PI]);

  // Compute the y scales: 1 scale per variable.
  // Provides the distance to the center.
  const yScales = {};
  axisConfig.forEach((axis) => {
    yScales[axis.name] = d3
      .scaleRadial()
      .domain([0, axis.max]) // value of each data
      .range([INNER_RADIUS, outerRadius]);
  });

  const lineGenerator = d3
    .lineRadial()
    .angle((d) => xScale(d.name) + xScale.bandwidth() / 2 - Math.PI / 2) // ändert die Linien vom "Netz" -> so passts, - Math.PI / 2 -> dreht Kreis um 90
    .radius((d) => yScales[d.name](d.value))
    .curve(d3.curveLinearClosed);

  const radarPath = lineGenerator(data);

  const points = data.map((d) => {
    const angle = xScale(d.name) + xScale.bandwidth() / 2 - (2 * Math.PI) / 2; // ändert Punkt -> Punkte passe aber Bezeichung nicht
    const radius = yScales[d.name](d.value);
    return {
      ...d,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  const shiftedPoints = points.map((point, index) => ({
    ...point,
    value: points[index % points.length].value,
  }));

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        <RadarGrid
          outerRadius={outerRadius}
          xScale={xScale}
          axisConfig={axisConfig}
        />
        <path
          d={radarPath}
          fill="#FF6285"
          fillOpacity={0.25}
          stroke="#FF6285"
          strokeWidth={1}
        />
        {/* key bullet points VALUES FF6285 */}
        {shiftedPoints.map((point, i) => (
          <g key={i}>
            <circle cx={point.x} cy={point.y} r={4} fill="#FF6285" />
            <text
              x={point.x}
              y={point.y - 20}
              textAnchor="middle"
              fontSize={13}
              fill="#000000"
            >
              {(point.value * 100).toFixed(0)}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
