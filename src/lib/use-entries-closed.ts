import { useEffect, useState } from "react";

import { ENTRIES_CLOSE } from "@/lib/event-config";

/** false on the server and on first paint (so markup matches), then true once entries have closed. */
export function useEntriesClosed() {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const check = () => setClosed(Date.now() >= ENTRIES_CLOSE);
    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return closed;
}
