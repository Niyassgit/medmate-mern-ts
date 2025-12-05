import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserDistribution } from '../dto/AdminDashboardTypes';

interface UserDistributionChartProps {
  data: UserDistribution | null;
  isLoading?: boolean;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

export function UserDistributionChart({ data, isLoading }: UserDistributionChartProps) {
  const chartData = data ? [
    { name: 'Doctors', value: data.doctors },
    { name: 'Reps', value: data.reps },
  ] : [];

  const total = data ? data.doctors + data.reps : 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">User Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="w-full" style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} users`, '']}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-muted-foreground">
              Total Users: <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
