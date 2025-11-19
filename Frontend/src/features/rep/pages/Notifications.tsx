import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/shared/NotificationItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetchItem from "@/hooks/useFetchItem";
import { useSelector } from "react-redux";
import {
  acceptFromNotification,
  getRepnotifications,
  rejectRepsideConnectionRequest,
} from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import toast from "react-hot-toast";
import { Notification } from "@/components/Dto/Notification";
import { getSocket } from "@/lib/socket";

const Notifications = () => {
  const token = useMemo(() => localStorage.getItem("accessToken"), []);
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

  const ConnectionAccept = async (notificationId: string, roleId: string) => {
    try {
      const res = await acceptFromNotification(notificationId, roleId);
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
      const res = await rejectRepsideConnectionRequest(notificationId, roleId);
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
     
    socket.on("notification:deleted",({id})=>{
      setLocalNotifications((prev)=>prev.filter((n)=>n.id!== id));
    })
    return () => {
      socket.off("notification:new");
      socket.off("notification:deleted");
    };
  }, [token,id]);

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
                postId={notification.postId}
                postImage={notification.postImage}
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
