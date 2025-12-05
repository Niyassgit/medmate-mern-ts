import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserGrowth } from '../dto/AdminDashboardTypes';

interface UserGrowthChartProps {
  data: UserGrowth | null;
  isLoading?: boolean;
}

export function UserGrowthChart({ data, isLoading }: UserGrowthChartProps) {
  const chartData = data ? data.months.map((month, index) => ({
    month,
    doctors: data.doctors[index],
    reps: data.reps[index],
  })) : [];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Monthly User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[320px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="w-full" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span className="text-sm capitalize text-foreground">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="doctors"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--chart-1))' }}
                />
                <Line
                  type="monotone"
                  dataKey="reps"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--chart-2))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
