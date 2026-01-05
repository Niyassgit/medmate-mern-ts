import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "../dto/AdminDashboardTypes";
import { cn } from "@/lib/utils";
import AppPagination from "@/components/shared/AppPagination";

interface RecentSubscriptionsTableProps {
  data: Subscription[] | null;
  isLoading?: boolean;
  title?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const statusStyles = {
  paid: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  success: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  pending: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const tierStyles = {
  Basic: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Pro: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Premium: "bg-chart-5/10 text-chart-5 border-chart-5/20",
};

export function RecentSubscriptionsTable({
  data,
  isLoading,
  title = "Recent Subscription Purchases",
  pagination,
}: RecentSubscriptionsTableProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="overflow-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>User</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((subscription, index) => (
                      <TableRow
                        key={`${subscription.userId}-${index}`}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <TableCell>
                          <p className="font-medium">{subscription.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {subscription.userId}
                          </p>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-medium",
                              tierStyles[
                                subscription.tier as keyof typeof tierStyles
                              ]
                            )}
                          >
                            {subscription.tier}
                          </Badge>
                        </TableCell>

                        <TableCell className="font-semibold">
                          ₹{subscription.amount.toLocaleString("en-IN")}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {format(new Date(subscription.date), "MMM dd, yyyy")}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize font-medium",
                              statusStyles[
                                subscription.status as keyof typeof statusStyles
                              ] ||
                                "bg-muted/10 text-muted-foreground border-muted/20"
                            )}
                          >
                            {subscription.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No recent subscriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/** OPTIONAL Pagination */}
            {pagination && (
              <div className="mt-4">
                <AppPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.onPageChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
