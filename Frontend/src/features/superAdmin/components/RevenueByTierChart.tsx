import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueByTier } from '../dto/AdminDashboardTypes';

interface RevenueByTierChartProps {
  data: RevenueByTier | null;
  isLoading?: boolean;
}

const TIER_COLORS = [
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function RevenueByTierChart({ data, isLoading }: RevenueByTierChartProps) {
  const chartData = data ? data.tiers.map((tier, index) => ({
    tier,
    revenue: data.revenue[index],
  })) : [];

  const totalRevenue = data ? data.revenue.reduce((sum, val) => sum + val, 0) : 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Revenue by Subscription Tier</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="w-full" style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="tier" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-muted-foreground">
              Total Revenue: <span className="font-semibold text-foreground">${totalRevenue.toLocaleString()}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
