import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NotificationItem,
  NotificationType,
} from "@/components/shared/NotificationItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetchItem from "@/hooks/useFetchItem";
import { useSelector } from "react-redux";
import { acceptConnection, getRepnotifications, rejectRepsideConnectionRequest } from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: Date;
  roleId: string;
  isConnected: boolean;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

const Notifications = () => {
  const [filter, setFilter] = useState<
    "all" | "unread" | "updates" | "approvals"
  >("all");
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    []
  );

  const id = useSelector((state: any) => state.auth.user?.id);

  const fetchNotifications = useCallback(async () => {
    if (!id) return;
    const res = await getRepnotifications(id);
    return res.data;
  }, [id]);

  const {
    data: notificationsRes,
    error,
    loading,
  } = useFetchItem(fetchNotifications);

  useEffect(() => {
    if (notificationsRes && Array.isArray(notificationsRes)) {
      const normalizedNotifications: Notification[] = notificationsRes.map(
        (n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        })
      );
      setLocalNotifications(normalizedNotifications);
    }
  }, [notificationsRes]);

  const filteredNotifications = localNotifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "updates") return notification.type === "INTEREST";
    if (filter === "approvals")
      return notification.type === "CONNECTION_ACCEPTED";
    return true;
  });

  const markAllAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const markAsRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const ConnectionAccept = async (id: string) => {
    try {
      const res = await acceptConnection(id);
      if (res.success) {
        toast.success(res.message || "Connection request rejected");
      } else {
        toast.error(res.message || "Something has happend!");
      }
    } catch (error: any) {
      toast.error(error.message || "Internal error");
    }
  };
  const ConnectionReject = async (notifactionId:string,id:string) => {
    try {
      const res = await rejectRepsideConnectionRequest(notifactionId,id);

      if (res.success) {
        toast.success(res.message || "Connection request rejected");
      } else {
        toast.error(res.message || "Something has happend!");
      }
    } catch (error: any) {
      toast.error(error.message || "Internal error");
    }
  };

  if (loading) return <SpinnerButton />;
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <Button
            variant="ghost"
            onClick={markAllAsRead}
            className="text-primary hover:text-primary/90"
          >
            Mark All as Read
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
          className="mb-6"
        >
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notification list */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                id={notification.id}
                type={notification.type}
                userName={notification.user.name}
                avatarUrl={notification.user.profileImage}
                content={notification.content}
                roleId={notification.roleId}
                timestamp={notification.createdAt.toLocaleString()}
                isRead={notification.isRead}
                viewerRole="MEDICAL_REP"
                onClick={() => markAsRead(notification.id)}
                onAccept={ConnectionAccept}
                onReject={ConnectionReject}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No notifications to display
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
