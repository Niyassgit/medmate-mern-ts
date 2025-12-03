import { useEffect, useState } from "react";
import { getSubscriptionHistory } from "../api";
import { SubscriptionHistoryDTO } from "../dto/SubscriptionHistoryDTO";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const SubscriptionHistory = () => {
  const [history, setHistory] = useState<SubscriptionHistoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSubscriptionHistory();
        setHistory(data);
      } catch (err) {
        setError("Failed to fetch subscription history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Subscription History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all your past subscription transactions
        </p>
      </div>

      {history.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No subscription history found
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatAmount(item.amount, item.currency)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Start Date:{" "}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDate(item.startDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        End Date:{" "}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDate(item.endDate)}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Transaction ID:{" "}
                      </span>
                      <span className="text-gray-900 dark:text-white font-mono text-xs">
                        {item.sessionId.slice(0, 30)}...
                      </span>
                    </div>
                    {item.paymentIntentId && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">
                          Payment Intent:{" "}
                        </span>
                        <span className="text-gray-900 dark:text-white font-mono text-xs">
                          {item.paymentIntentId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionHistory;

