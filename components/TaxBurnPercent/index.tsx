import React from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

const data = [
  { name: "Burn", value: 1 },
  { name: "Lottery", value: 1.5 },
  { name: "Refill Liquidity Pool", value: 2 },
  { name: "Flexible Fund", value: 2 },
  { name: "Development", value: 1.5 },
];

const COLORS = ["#8c30fa", "#76FCD3", "#FFC439", "#1177E8", "#3ecf52"];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name,
    id,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#c79300"
        className="text-[12px] md:text-[16px] font-bold"
      >{`${value}%`}</text>
      {name.includes("One third") ? (
        <foreignObject
          x={ex * 0.5}
          y={ey}
          dy={18}
          width="300"
          height="250"
          textAnchor={textAnchor}
          fill="#694d00"
          className="text-[12px] font-normal"
        >
          {name}
        </foreignObject>
      ) : (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          width="300"
          height="250"
          textAnchor={textAnchor}
          fill="#694d00"
          className="text-[12px] w-[300px] h-[250px] font-normal"
        >
          {name}
        </text>
      )}
    </g>
  );
};

const renderCustomizedLabel = ({ value }: { value: number }) => {
  return `${value}%`;
};

const TaxBurnPercent = () => {
  return (
    <div className="grid gap-[16px] justify-center relative">
      <h2 className="text-[16px] font-bold text-white text-center md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        8% tax burn <br /> <span className="text-xs font-normal">of each transaction</span>
      </h2>
      <div className="hidden md:block relative">
        <PieChart width={400} height={250}>
          <Pie
            activeIndex={[0, 1, 2, 3, 4]}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
      <div className="block md:hidden">
        <PieChart width={300} height={250} className="mx-auto">
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="w-full relative px-10">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-[16px] h-[16px] rounded-[4px] `}
                style={{ background: COLORS[index % COLORS.length] }}
              ></div>
              <p className="text-sm font-normal max-w-[78vw] text-[#694d00] ml-[8px]">
                {entry.name}
              </p>
              <p className="text-[#c79300] text-base ml-[8px]">{entry.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxBurnPercent;
