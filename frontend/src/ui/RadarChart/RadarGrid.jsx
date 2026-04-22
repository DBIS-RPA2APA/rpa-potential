import * as d3 from "d3";

export const INNER_RADIUS = 40;
const GRID_NUMBER = 5;
const GRID_COLOR = "#94a3b8";

function polarToCartesian(angle, radius) {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

/*
  A react component that adds a grid background 
  for a radar chart in polar coordinates
*/
export const RadarGrid = ({ outerRadius, xScale, axisConfig }) => {
  const lineGenerator = d3.lineRadial();

  // Compute Axes = from center to outer
  const allAxes = axisConfig.map((axis, i) => {
    const angle = xScale(axis.name) + xScale.bandwidth() / 2 - Math.PI / 2;

    if (angle === undefined) return null;

    const path = lineGenerator([
      [angle, INNER_RADIUS],
      [angle, outerRadius],
    ]);

    const labelPosition = polarToCartesian(
      angle - Math.PI / 2,
      outerRadius + 10,
    );

    return (
      <g key={i}>
        <path
          d={path}
          stroke={GRID_COLOR}
          strokeWidth={0.5}
          fill="none"
          rx={1}
        />
        <text
          x={labelPosition.x}
          y={labelPosition.y}
          fontSize={13}
          fill="#808080"
          textAnchor={labelPosition.x > 0 ? "start" : "end"}
          dominantBaseline="middle"
          fontWeight={500}
        >
          {axis.name}
        </text>
      </g>
    );
  });

  // Compte grid = concentric circles
  const allCircles = [...Array(GRID_NUMBER).keys()].map((position, i) => {
    return (
      <circle
        key={i}
        cx={0}
        cy={0}
        r={
          INNER_RADIUS +
          (position * (outerRadius - INNER_RADIUS)) / (GRID_NUMBER - 1)
        }
        stroke={GRID_COLOR}
        fill="none"
        opacity={0.6}
      />
    );
  });

  return (
    <g>
      {allAxes}
      {allCircles}
    </g>
  );
};
