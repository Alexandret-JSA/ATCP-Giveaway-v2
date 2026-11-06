import type { ReactNode } from "react";

import { GROUP_URL } from "@/lib/event-config";
import { useEntriesClosed } from "@/lib/use-entries-closed";

/** SVG sprite with the placeholder silhouette used until real coach photos are added. */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="sil" viewBox="0 0 100 100">
        <circle cx="50" cy="36" r="19" />
        <path d="M12 100c0-24 17-38 38-38s38 14 38 38z" />
      </symbol>
    </svg>
  );
}

export function Face({ className = "face" }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 100 100">
        <use href="#sil" />
      </svg>
    </span>
  );
}

/** "Enter the Giveaway" button. After entries close it becomes a link to the Facebook group. */
export function Cta({
  className = "btn",
  target = "#enter",
}: {
  className?: string;
  target?: string;
}) {
  const closed = useEntriesClosed();
  if (closed) {
    return (
      <a className={className} href={GROUP_URL} target="_blank" rel="noopener noreferrer">
        Entries Closed, Join the Facebook Group Now
      </a>
    );
  }
  return (
    <a className={className} href={target}>
      ENTER TO WIN
    </a>
  );
}

export function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="ico" aria-hidden="true">
      <svg viewBox="0 0 24 24">{children}</svg>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap stack c">
        <p className="links">
          <a href="#">Official Rules</a> · <a href="#">Privacy Policy</a> · <a href="#">Terms</a>
        </p>
        <p>
          No purchase necessary. Open to tree care professionals; see the Official Rules for age and
          location requirements. Entries close November 12, 2026 at 5:00 PM ET. One winner will be
          drawn on November 13, 2026.
        </p>
        <p>
          This site is not part of Facebook or Meta Platforms, Inc. and is not endorsed by Facebook
          in any way. This promotion is not sponsored, endorsed or administered by Facebook or
          Instagram.
        </p>
        <p>Sponsored by the Association of Tree Care Professionals (ATCP).</p>
        <p>© 2026 Association of Tree Care Professionals (ATCP). All Rights Reserved.</p>
      </div>
    </footer>
  );
}
