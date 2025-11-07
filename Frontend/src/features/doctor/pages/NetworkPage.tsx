import { useCallback, useState } from "react";
import Networks from "./Networks";
import { RepCardDetailsDTO } from "../dto/RepCardDetailsDTO";
import { useSelector } from "react-redux";
import { getNetworks } from "../api";
import useFetchItem from "@/hooks/useFetchItem";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

export default function NetworkPage() {
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const id = useSelector((state: any) => state.auth.user?.id);

  const fetchReps = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return getNetworks(id);
  }, [id]);

  const {
    data: reps,
    loading,
    error,
  } = useFetchItem<RepCardDetailsDTO[] | null>(fetchReps);

  if (loading) return (<SpinnerButton />);
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const handleConnect = (userId: string, status: string | null) => {
  setConnections((prev) => {
    const newSet = new Set(prev);
    if (status === "ACCEPTED") {
      newSet.add(userId);
    } else {
      newSet.delete(userId);
    }
    return newSet;
  });
};


  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Discover Connections
            </h1>
            <p className="text-muted-foreground mt-1">
              Find and connect with professionals in your network
            </p>
          </div>
          {/* <p className="text-sm text-muted-foreground">
            Connected:{" "}
            <span className="font-semibold text-foreground">
              {connections.size}
            </span>
          </p> */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reps?.map((user) => (
          <Networks
            key={user.id}
            user={user}
            onConnect={handleConnect}
            isConnected={connections.has(user.id)}
          />
        ))}
      </div>
    </main>
  );
}
