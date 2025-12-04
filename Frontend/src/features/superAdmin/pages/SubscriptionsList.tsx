import React, { useEffect, useState } from "react";
import { RecentSubscriptionsTable } from "../components/RecentSubscriptionsTable";
import { subscribedUsers } from "../api/superAdminApi";
import toast from "react-hot-toast";

const SubscriptionsList = () => {
  const [page, setPage] = useState(1);
  const [subscriptions, setSubscriptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await subscribedUsers(page, 10);
      setSubscriptions(res.subscriptions);
      setTotalPages(res.totalPages || 1);
    } catch (err:any) {
      toast.error(err?.response?.data?.message || "Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page]);

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
