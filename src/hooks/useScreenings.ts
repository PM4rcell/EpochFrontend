import { useEffect, useState } from "react";
import { fetchScreenings } from "../api/screenings";

export function useScreenings(startDate?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // debug: show when hook runs and what startDate is
    // eslint-disable-next-line no-console
    console.debug("useScreenings -> startDate:", startDate);
    if (!startDate) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchScreenings(startDate)
      .then((d) => setData(Array.isArray(d.data) ? d.data : [d.data]))
      .then(() => {
        // debug: confirm data has been set
        // eslint-disable-next-line no-console
        console.debug("useScreenings -> data loaded:", data);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("useScreenings fetch error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [startDate]);
  return { data, loading };
}
