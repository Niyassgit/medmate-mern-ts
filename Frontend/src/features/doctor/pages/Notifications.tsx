import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "../../../components/shared/NotificationItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetchItem from "@/hooks/useFetchItem";
import { useSelector } from "react-redux";
import {
  acceptConnOnNotificationPage,
  getDoctorNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  rejectdocConnectionRequest,
} from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import toast from "react-hot-toast";
import { Notification } from "@/components/Dto/Notification";
import { getSocket } from "@/lib/socket";

const Notifications = () => {
  const [filter, setFilter] = useState<
    "all" | "unread" | "updates" | "approvals"
  >("all");
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    []
  );
  const token = useMemo(() => localStorage.getItem("accessToken"), []);
  const id = useSelector((state: any) => state.auth.user?.id);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchInitial = useCallback(async () => {
    if (!id) return;
    const res = await getDoctorNotifications(id);
    return res.data;
  }, [id]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loadingMore || !id) return;
    setLoadingMore(true);
    try {
      const res = await getDoctorNotifications(id, cursor ?? undefined);
      const { data, nextCursor, hasMore: more } = res.data;
      const normalizedNotifications: Notification[] = data.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      }));
      setLocalNotifications((prev) => [...prev, ...normalizedNotifications]);
      setCursor(nextCursor);
      setHasMore(more);
    } catch (error: any) {
      toast.error(error.message || "Failed to load more notifications");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, id, cursor]);

  const { data: notificationsRes, error, loading } = useFetchItem(fetchInitial);

  useEffect(() => {
    if (notificationsRes && notificationsRes.data && Array.isArray(notificationsRes.data)) {
      const normalizedNotifications: Notification[] = notificationsRes.data.map(
        (n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        })
      );
      setLocalNotifications(normalizedNotifications);
      setCursor(notificationsRes.nextCursor);
      setHasMore(notificationsRes.hasMore);
    }
  }, [notificationsRes]);

  const filteredNotifications = localNotifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "updates") return notification.type === "INTEREST";
    if (filter === "approvals")
      return notification.type === "CONNECTION_ACCEPTED";
    return true;
  });

  const markAllAsRead = async () => {
    setLocalNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    try {
      await markAllNotificationsAsRead(id);
    } catch (error: any) {
      toast.error(error.message || "Internal server Error");
    }
  };

  const markAsRead = async (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );

    try {
      await markNotificationAsRead(id);
    } catch (error: any) {
      toast.error(error.message || "Failed to update notification as read");
    }
  };

  const ConnectionAccept = async (notificationId: string, roleId: string) => {
    try {
      const res = await acceptConnOnNotificationPage(notificationId, roleId);
      if (res.success) {
        toast.success(res.message || "Connection request accepted");

        setLocalNotifications((prev) =>
          prev.map((n) =>
            n.roleId === roleId ? { ...n, type: "CONNECTION_ACCEPTED" } : n
          )
        );
      } else {
        toast.error(res.message || "Something has happened!");
      }
    } catch (error: any) {
      toast.error(error.message || "Internal error");
    }
  };

  const ConnectionReject = async (notificationId: string, roleId: string) => {
    try {
      const res = await rejectdocConnectionRequest(notificationId, roleId);
      if (res.success) {
        toast.success(res.message || "Connection request rejected");

        setLocalNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, type: "CONNECTION_REJECTED" } : n
          )
        );
      } else {
        toast.error(res.message || "Something has happened!");
      }
    } catch (error: any) {
      toast.error(error.message || "Internal error");
    }
  };

  useEffect(() => {
    if (!token || !id) return;
    const socket = getSocket(token);
    socket.on("notification:new", (data) => {
      setLocalNotifications((prev) => [data, ...prev]);
    });

    socket.on("notification:deleted", ({ id }) => {
      setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:deleted");
    };
  }, [token, id]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchMore();
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchMore]);

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

        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
          className="mb-6"
        >
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>

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
                viewerRole="DOCTOR"
                onClick={() => markAsRead(notification.id)}
                onAccept={ConnectionAccept}
                onReject={ConnectionReject}
                markAsRead={markAsRead}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No notifications to display
              </p>
            </div>
          )}

          <div
            ref={loaderRef}
            className="h-10 flex justify-center items-center"
          >
            {loadingMore && <SpinnerButton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
