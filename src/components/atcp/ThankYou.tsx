import { useEffect } from "react";

import { Footer, Icon } from "@/components/atcp/Shared";
import { GROUP_URL, NEWS_URL } from "@/lib/event-config";

/**
 * Android outside Facebook's own browser: open the group in the Facebook app instead of a browser
 * where people may not be signed in. Computed after mount so server and browser markup match.
 */
function useGroupLink() {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/FBAN|FBAV|FB_IAB|Instagram/i.test(ua) || !/Android/i.test(ua)) return;
    const app =
      "intent://" +
      GROUP_URL.replace(/^https?:\/\//, "") +
      "#Intent;scheme=https;package=com.facebook.katana;S.browser_fallback_url=" +
      encodeURIComponent(GROUP_URL) +
      ";end";
    document.querySelectorAll<HTMLAnchorElement>("a[data-fb]").forEach((a) => {
      a.href = app;
      a.removeAttribute("target");
    });
  }, []);
}

export function ThankYou() {
  useGroupLink();
  return (
    <div className="ty">
      <section className="hero">
        <div className="wrap">
          <div className="intro">
            <div className="logo-plate">
              <img
                src="/assets/atcp-logo.webp"
                alt="ATCP: Association of Tree Care Professionals"
                width={188}
                height={95}
              />
            </div>
            <span className="pill">Entry Received · 1 Step Left</span>
            <h1 className="h1">You’re Almost Done</h1>
            <p className="p">
              Your entry is saved. The last step to guarantee your seat in the draw: the ATCP
              Facebook group. That’s where we go live, call out the winners and share every update.
              If you’re not in the group, there’s no way to know you’ve won.
            </p>
          </div>

          <div className="steps">
            <div className="step main">
              <div className="num">
                <span className="n">1</span>
                <Icon>
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  <circle cx="17" cy="9" r="2.5" />
                  <path d="M16.5 13.2c2.6.4 4.5 2.7 4.5 5.8" />
                </Icon>
              </div>
              <div className="sbody">
                <span className="tag">Required to win</span>
                <h2 className="h3">Join the ATCP Facebook Group</h2>
                <p className="p">
                  The 4 winners are drawn from group members, live on Friday, November 13 at 5:00 PM
                  ET. Keep your phone close: we call each winner live, and you must answer to win.
                </p>
              </div>
              <div className="act">
                <a
                  className="btn big"
                  data-fb
                  href={GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join the ATCP Facebook Group
                </a>
              </div>
            </div>

            <div className="step">
              <div className="num">
                <span className="n">2</span>
                <Icon>
                  <circle cx="10" cy="8" r="3.5" />
                  <path d="M3 20c0-3.9 3.1-7 7-7 1.5 0 2.9.5 4 1.3" />
                  <path d="M18 14v6M15 17h6" />
                </Icon>
              </div>
              <div className="sbody">
                <span className="tag">No limit</span>
                <h2 className="h3">Get 1 Extra Entry for Every Friend Who Joins</h2>
                <p className="p">
                  Tap “Invite Friends” inside the group. Every friend who joins before Thursday,
                  November 12 at 5:00 PM ET gives you one extra entry.
                </p>
              </div>
              <div className="act">
                <a
                  className="btn"
                  data-fb
                  href={GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Invite Friends in the Group
                </a>
              </div>
            </div>

            <div className="step">
              <div className="num">
                <span className="n">3</span>
                <Icon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </Icon>
              </div>
              <div className="sbody">
                <span className="tag">Stay Informed</span>
                <h2 className="h3">Get ATCP News in Your Inbox</h2>
                <p className="p">
                  New regulations, safety standards and industry updates can affect your business.
                  We’ll send timely, credible news to the email you entered: safety alerts and
                  compliance updates, advocacy news, and policy changes that impact arboriculture.
                </p>
              </div>
              <div className="act">
                <a className="btn" href={NEWS_URL} target="_blank" rel="noopener noreferrer">
                  Read the Latest News
                </a>
                <span className="note">Unsubscribe anytime.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
