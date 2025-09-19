"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type PayslipsGraphData = {
  month: string;
  currentYear: number;
  previousYear: number;
  currentYearEstimate: number;
};

interface PubblicaWebPayslipsGraphProps {
  data: PayslipsGraphData[];
}

export function PubblicaWebPayslipsGraph({
  data = [],
}: PubblicaWebPayslipsGraphProps) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>Payslips Trend: Current Year vs Previous Year</h3>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="currentYear"
            name="Current Year"
            stroke="#8884d8"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="currentYearEstimate"
            name="Current Year Estimate"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="previousYear"
            name="Previous Year"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
