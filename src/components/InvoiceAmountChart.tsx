"use client";

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface InvoiceDataPoint {
  date: string;
  totalAmount: number;
}

interface InvoiceAmountChartProps {
  data: InvoiceDataPoint[];
}

const InvoiceAmountChart: React.FC<InvoiceAmountChartProps> = ({ data }) => {
  // Sort data by date to ensure correct chronological order for the chart
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Faktur per Bulan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), 'MMM yyyy', { locale: id })}
                className="text-sm fill-foreground"
              />
              <YAxis
                tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                className="text-sm fill-foreground"
              />
              <Tooltip
                formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                labelFormatter={(label: string) => format(new Date(label), 'MMMM yyyy', { locale: id })}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalAmount"
                stroke="hsl(var(--primary))"
                activeDot={{ r: 8 }}
                name="Total Faktur"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceAmountChart;