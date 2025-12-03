import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Subscription } from '../dto/AdminDashboardTypes';
import { cn } from '@/lib/utils';

interface RecentSubscriptionsTableProps {
  data: Subscription[] | null;
  isLoading?: boolean;
}

const statusStyles = {
  success: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  pending: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const tierStyles = {
  Basic: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  Pro: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Premium: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
};

export function RecentSubscriptionsTable({ data, isLoading }: RecentSubscriptionsTableProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Recent Subscription Purchases</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-foreground">User</TableHead>
                  <TableHead className="font-semibold text-foreground">Tier</TableHead>
                  <TableHead className="font-semibold text-foreground">Amount</TableHead>
                  <TableHead className="font-semibold text-foreground">Date</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((subscription, index) => (
                    <TableRow key={`${subscription.userId}-${index}`} className="transition-colors hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{subscription.name}</p>
                          <p className="text-xs text-muted-foreground">{subscription.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn('font-medium', tierStyles[subscription.tier as keyof typeof tierStyles] || 'bg-muted')}
                        >
                          {subscription.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ${subscription.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(subscription.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn('capitalize font-medium', statusStyles[subscription.status])}
                        >
                          {subscription.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No recent subscriptions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
