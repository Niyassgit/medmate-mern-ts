import React from "react";
import Networks from "./Networks";
import { RepCardDetailsDTO } from "../dto/RepCardDetailsDTO";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

export interface NetworkResultsProps {
  reps: RepCardDetailsDTO[];
  loading: boolean;
  hasMore: boolean;
  lastRepRef: (node: HTMLDivElement | null) => void;
  connections: Set<string>;
  onConnect: (userId: string, status: string | null) => void;
}
const NetworkResults: React.FC<NetworkResultsProps> = React.memo(
  ({ reps, loading, hasMore, lastRepRef, connections, onConnect }) => {
    // 🔹 First load / search load
    if (loading && reps.length === 0) {
      return (
        <div className="flex justify-center py-16">
          <SpinnerButton />
        </div>
      );
    }

    if (!loading && reps.length === 0) {
      return (
        <p className="text-center py-12 text-muted-foreground">No reps found</p>
      );
    }

    return (
      <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reps.map((rep, idx) => (
            <div key={rep.id} ref={idx === reps.length - 1 ? lastRepRef : null}>
              <Networks
                user={rep}
                onConnect={onConnect}
                isConnected={connections.has(rep.id)}
              />
            </div>
          ))}
        </div>

        {/* Pagination loader */}
        {loading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {!hasMore && reps.length > 0 && (
          <p className="text-center py-8 text-muted-foreground">
            No more reps to load
          </p>
        )}
      </>
    );
  }
);

export default NetworkResults;