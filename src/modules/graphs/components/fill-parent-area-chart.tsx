"use client";
import { Area, AreaChart } from "recharts";
import { useEffect, useRef, useState } from "react";

export const FillParentAreaChart = ({
  data,
  stroke = "#8884d8",
  fill = "#8884d8",
  margin = {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
}: {
  data?: any[];
  stroke?: string;
  fill?: string;
  margin?: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  };
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<
    undefined | { width: number; height: number }
  >(undefined);
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const size = ref.current.getBoundingClientRect();
    setSize({
      width: size.width,
      height: size.height,
    });
  }, [ref]);
  return (
    <div className="absolute inset-0 opacity-80" ref={ref}>
      {size && (
        <AreaChart
          width={size.width}
          height={size.height}
          data={data}
          margin={margin}
        >
          <Area
            type="monotone"
            dataKey="duration"
            stroke={stroke}
            fill={fill}
          />
        </AreaChart>
      )}
    </div>
  );
};
