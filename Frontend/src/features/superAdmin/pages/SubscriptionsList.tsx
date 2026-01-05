import React, { useCallback, useEffect, useState } from "react";
import { RecentSubscriptionsTable } from "../components/RecentSubscriptionsTable";
import { subscribedUsers } from "../api/superAdminApi";
import toast from "react-hot-toast";

const SubscriptionsList = () => {
  const [page, setPage] = useState(1);
  const [subscriptions, setSubscriptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await subscribedUsers(page, 10);
      setSubscriptions(res.subscriptions);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      const errorMessage = 
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Failed to fetch subscriptions";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div className="p-6">
      <RecentSubscriptionsTable
        data={subscriptions}
        isLoading={loading}
        title="All Subscriptions"
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => setPage(p),
        }}
      />
    </div>
  );
};

export default SubscriptionsList;
