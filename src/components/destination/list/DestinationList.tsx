import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Destination } from "@/types/destination";
import styles from "./DestinationList.module.css";

type DestinationListProps = {
  destinations: Destination[];
  error: Error | null;
  isLoading: boolean;
  isRefreshing: boolean;
  onRetry: () => void;
};

export function DestinationList({
  destinations,
  error,
  isLoading,
  isRefreshing,
  onRetry,
}: DestinationListProps) {
  let content;

  if (isLoading) {
    content = <p className={styles.statusText}>Loading destinations...</p>;
  } else if (error) {
    const errorMessage =
      error.message ||
      "Unable to load destinations. Check your Xano URL and try again.";

    content = (
      <div className={styles.errorContent} role="alert">
        <p className={styles.errorText}>{errorMessage}</p>
        <Button type="button" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  } else if (destinations.length === 0) {
    content = (
      <p className={styles.statusText}>
        No destinations yet. Add your first one above!
      </p>
    );
  } else {
    content = (
      <ul className={styles.list}>
        {destinations.map((destination) => (
          <li key={destination.id} className={styles.listItem}>
            <p className="font-semibold">{destination.city}</p>
            <p className="text-sm text-muted-foreground">{destination.country}</p>
            
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className={styles.header}>
          <CardTitle>My Destinations</CardTitle>
          {isRefreshing && !isLoading ? (
            <span className={styles.refreshText} role="status">
              Refreshing...
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
