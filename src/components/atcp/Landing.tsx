import { Countdown } from "@/components/atcp/Countdown";
import { EntryForm } from "@/components/atcp/EntryForm";
import { Cta, Face, Footer, Icon, Sprite } from "@/components/atcp/Shared";
import { useEntriesClosed } from "@/lib/use-entries-closed";

const COACHES = [
  {
    name: "Joe Withledge",
    spec: "Emergency / Storm Response & Insurance Claims",
    image:
      "https://vibe.filesafe.space/1793888448858773605/attachments/7d7e5e2a-5e7e-4d2a-a2ad-fc1c437ffa67.png",
    brag: (
      <>
        Owner of Withledge Tree Service and founder of Emergency Tree Responders. He has more than{" "}
        <b>20 years of experience in tree service</b>, and his company has handled{" "}
        <b>more than 100 emergency tree-removal claims in a single year</b>.
      </>
    ),
    ask: "Storm response · Emergency work · Insurance claims & billing",
  },
  {
    name: "Stephan LeBlanc",
    spec: "Insurance Billing & Emergency Tree Work",
    image:
      "https://vibe.filesafe.space/1793888448858773605/attachments/938b932b-1faa-45f7-9e79-1abe10b9dbd7.png",
    brag: (
      <>
        Licensed Public Adjuster with Eugene Darby. Expert on{" "}
        <b>storm work and emergency billing involving insurance companies</b>.
      </>
    ),
    ask: "Storm work · Emergency billing · Navigating insurance claims",
  },
  {
    name: "Chad Hansen",
    spec: "Business Management & Finance",
    image:
      "https://vibe.filesafe.space/1793888448858773605/attachments/f6d94a9d-91ad-43d2-b574-aa587cad37b8.png",
    brag: (
      <>
        President of Hansen’s Tree Service & Environmental Resources. Expert on Business Management
        & Financial Operations, especially KPIs, metrics, and using real data to manage a business.{" "}
        <b>Hansen’s has more than 100 employees</b>.
      </>
    ),
    ask: "Pricing · Cash flow · KPIs & data · Managing the business",
  },
  {
    name: "Alex Shy",
    spec: "Plant Health Care (PHC) & Operational Efficiency",
    image:
      "https://vibe.filesafe.space/1793888448858773605/attachments/fb7fae13-a175-49e7-b9f9-276afea702b3.png",
    brag: (
      <>
        Expert on Plant Health Care (PHC) & Operational Efficiency. He has{" "}
        <b>more than a decade of experience in arboriculture/PHC</b>; he founded Shy Tree in 2017
        and later sold it. He also created Mobile Tree Spa and PHC Rx.
      </>
    ),
    ask: "Plant health care services · Systems & tech · Crew efficiency",
  },
];

const TOPICS = [
  {
    title: "Storm & Emergency Response",
    text: "Win more storm work and run emergency jobs safely and profitably.",
    coach: "Joe Withledge, Stephan LeBlanc",
    icon: (
      <>
        <path d="M7 16.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9a3.75 3.75 0 0 1 .5 7.47" />
        <path d="M13 11.5l-3 5h4l-3 5" />
      </>
    ),
  },
  {
    title: "Insurance Billing",
    text: "Get paid faster on insurance jobs and stop leaving money on the table.",
    coach: "Stephan LeBlanc",
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <path d="M14.5 9.6c-.4-.9-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4.1 0 1.1-1.1 2-2.5 2-1.2 0-2.2-.6-2.6-1.5M12 6.9v1.2m0 8v1.2" />
      </>
    ),
  },
  {
    title: "Business Management & Finance",
    text: "Price for profit, manage cash flow and know your numbers.",
    coach: "Chad Hansen",
    icon: (
      <>
        <path d="M4 20h16" />
        <path d="M6.5 16.5v-4M10.5 16.5V9.5M14.5 16.5v-6M18.5 16.5V6" />
      </>
    ),
  },
  {
    title: "PHC & Operational Efficiency",
    text: "Add plant health care services and run your crews with less waste.",
    coach: "Alex Shy",
    icon: (
      <>
        <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" />
        <path d="M5 19c3-4 6-7 10-9" />
      </>
    ),
  },
  {
    title: "Scaling a Tree Care Business",
    text: "Grow from one crew to several without losing control.",
    coach: "All 4 coaches",
    icon: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
  },
  {
    title: "AI & Automation",
    text: "Save hours on quotes, scheduling and follow-ups.",
    coach: "All 4 coaches",
    icon: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M10 10h4v4h-4z" />
        <path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3" />
      </>
    ),
  },
  {
    title: "Managing People & Building a Team",
    text: "Hire, train and keep the right people.",
    coach: "All 4 coaches",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M16.5 13.2c2.6.4 4.5 2.7 4.5 5.8" />
      </>
    ),
  },
  {
    title: "Your Own Question",
    text: "Bring the challenge that keeps you up at night and work through it together.",
    coach: "Any coach",
    icon: (
      <>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M10 9a2 2 0 1 1 3 1.7c-.6.4-1 .8-1 1.5M12 14.2v.1" />
      </>
    ),
  },
];

const FAQ_LEFT = [
  ["Is it really free?", "Yes. Entering costs nothing and no purchase is necessary."],
  [
    "Who can enter?",
    "Anyone who works in the tree care industry: business owners, employees, contractors, climbers and other tree care professionals. See the Official Rules for age and location requirements.",
  ],
  [
    "How are the winners chosen?",
    "The winner is drawn at random, live on stream during our Discord town hall on Tuesday, December 15, 2026 at 5:00 PM ET. We call the winner live at the phone number on their entry, up to three times within 10 minutes. You must answer the call live to win; a voicemail or a text back does not count.",
  ],
  [
    "How many winners will there be?",
    "One. The winner gets their own coach and their own 60-minute session.",
  ],
  ["Can I choose my coach?", "Yes. The winner chooses their coach."],
  [
    "When and how does the session happen?",
    "The winner chooses their coach. The winner selects a time based on availability.",
  ],
] as const;

const FAQ_RIGHT = [
  ["Will the session be recorded?", "Yes, every session is recorded."],
  [
    "Do I need to join the Facebook group?",
    "Yes. Joining is free, and the winner is drawn from group members. You’ll get the link right after you enter.",
  ],
  [
    "How do bonus entries work?",
    "Inside the group, use the “Invite Friends” button. Every person you invite who joins before December 14 at 5:00 PM ET gives you one extra entry. There is absolutely no limit on bonus entries.",
  ],
  ["Do I need to be an ATCP member?", "No. Anyone in the tree care industry can enter."],
  [
    "What happens to my information?",
    "We use it only to run this giveaway and to send you ATCP updates. We never sell it.",
  ],
] as const;

function Faq({
  items,
  openFirst,
}: {
  items: readonly (readonly [string, string])[];
  openFirst?: boolean;
}) {
  return (
    <div className="faq-col">
      {items.map(([q, a], i) => (
        <details key={q} open={openFirst && i === 0 ? true : undefined}>
          <summary>{q}</summary>
          <p className="a">{a}</p>
        </details>
      ))}
    </div>
  );
}

export function Landing() {
  const closed = useEntriesClosed();
  return (
    <div className="atcp">
      <Sprite />

      {/* Deadline bar */}
      <div className="topbar">
        <div className="wrap">
          {closed ? (
            <p>
              <b>Entries are closed.</b> The winner is drawn live on Tue, Dec 15 at 5:00 PM ET
              during our Discord town hall.
            </p>
          ) : (
            <p>
              <b>Free Giveaway:</b> Win a coaching session with a 7-figure tree service owner
            </p>
          )}
          <Countdown label="Entries close in" />
          <Cta className="btn sm only-d" />
        </div>
      </div>

      {/* Hero + entry form */}
      <section className="hero">
        <div className="wrap split">
          <div className="hero-card">
            <div className="logo-plate">
              <img
                src="/assets/atcp-logo.webp"
                alt="ATCP: Association of Tree Care Professionals"
                width={188}
                height={95}
              />
            </div>
            <span className="pill">ATCP Tree Care MasterClass · Free Giveaway</span>
            <h1 className="h1">Win 1-on-1 Coaching With a 7-Figure Tree Service Owner</h1>
            <p className="p">
              Learn directly from the people who have already built the business you’re trying to
              build. No generic advice. No guessing. One winner, a private session, and $0 to enter.
            </p>
            <div className="coachrow">
              <div className="faces" aria-hidden="true">
                {COACHES.map((c) => (
                  <span className="face" key={c.name}>
                    <img src={c.image} alt={c.name} className="face-img" />
                  </span>
                ))}
              </div>
              <p className="micro">
                Coached by Joe Withledge, Stephan LeBlanc, Chad Hansen and Alex Shy
              </p>
            </div>
            <div className="logi">
              <div>
                <small>Entries close</small>
                <span>Mon, Dec 14 · 5:00 PM ET</span>
              </div>
              <div>
                <small>Winner drawn</small>
                <span>Tue, Dec 15 · 5:00 PM ET</span>
              </div>
              <div>
                <small>Session</small>
                <span>Private 60-min 1-on-1 video call</span>
              </div>
            </div>
          </div>
          <EntryForm anchorId="enter" prefix="f1" />
        </div>
      </section>

      {/* Numbers strip */}
      <section className="band green">
        <div className="wrap grid g4">
          <div className="stat">
            <b>1</b>
            <span>Winner</span>
          </div>
          <div className="stat">
            <b>60 min</b>
            <span>1-on-1 sessions</span>
          </div>
          <div className="stat">
            <b>4</b>
            <span>7-figure coaches</span>
          </div>
          <div className="stat">
            <b>$0</b>
            <span>To enter</span>
          </div>
        </div>
      </section>

      {/* What you can win */}
      <section className="band white-l">
        <div className="wrap split">
          <div className="stack">
            <p className="eb">What You Can Win</p>
            <h2 className="h2">A Private 60-Minute Session Built Around Your Business</h2>
            <p className="p">
              The winner gets their own coach: a tree service owner who has built and run a 7-figure
              business.
            </p>
            <p className="p">
              Bring the question that matters most to you, from growth and sales to operations,
              leadership, hiring and profitability.
            </p>
          </div>
          <div className="prize">
            <p className="prize-head">
              <span>1 Winner</span>
              <span className="sep"> · </span>
              <span>4 Coaches</span>
            </p>
            <h3 className="h3">1-on-1 Tree Care MasterClass Session</h3>
            <ul className="chk">
              <li>
                <b>Length:</b> 60 minutes, one-on-one
              </li>
              <li>
                <b>Format:</b> live video call
              </li>
              <li>
                <b>Your coach:</b> you choose, in draw order
              </li>
              <li>
                <b>Focus:</b> your own business question
              </li>
              <li>
                <b>You leave with:</b> clear action steps (bring a notebook)
              </li>
              <li>
                <b>Recorded:</b> every session is recorded
              </li>
            </ul>
            <div className="price cost">
              <span>Cost to enter</span>
              <b>$0</b>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the coaches */}
      <section className="band green">
        <div className="wrap">
          <div className="stack c">
            <p className="eb">Your Coaches</p>
            <h2 className="h2">Meet ATCP’s Top Board Members and Experts</h2>
            <p className="p">
              Each one has built and operated a 7-figure tree service business. Now one of them
              could be in your corner.
            </p>
          </div>
          <div className="gap" />
          <div className="grid g4 coaches">
            {COACHES.map((c) => (
              <div className="card coach" key={c.name}>
                <div className="photo">
                  <img src={c.image} alt={c.name} className="coach-img" />
                </div>
                <div className="meta">
                  <span className="spec">{c.spec}</span>
                  <h3 className="h3">{c.name}</h3>
                  <p className="micro brag">{c.brag}</p>
                  <p className="micro">
                    <b>Ask me about:</b> {c.ask}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="gap" />
          <div className="cta">
            <Cta className="btn big" />
            <Countdown label="Entries close in" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="band white-r">
        <div className="wrap">
          <div className="stack c">
            <p className="eb">How It Works</p>
            <h2 className="h2">3 Simple Steps to Your 1-on-1 Session</h2>
          </div>
          <div className="gap" />
          <div className="grid g3">
            <div className="step">
              <span className="n">1</span>
              <h3 className="h3">Enter in 2 Minutes</h3>
              <p className="p">
                Fill in the form, tell us what you want help with, then join the free ATCP Facebook
                group (required to win).
              </p>
            </div>
            <div className="step">
              <span className="n">2</span>
              <h3 className="h3">The Live Draw on Dec 15</h3>
              <p className="p">
                The winner is drawn live on stream during our Discord town hall on Tuesday, December
                15 at 5:00 PM ET.
              </p>
            </div>
            <div className="step">
              <span className="n">3</span>
              <h3 className="h3">Pick Your Coach and Meet</h3>
              <p className="p">
                The winner chooses their coach. The winner selects a time based on availability.
              </p>
            </div>
          </div>
          <div className="gap" />
          <div className="draw">
            <h3 className="h3">The Live Draw</h3>
            <p className="p">
              The winner will be drawn live on stream during our Discord town hall taking place
              Tuesday, December 15 at 5:00 PM ET.
            </p>
            <p className="p alert">You Must Answer Your Phone to Win</p>
            <ul className="chk">
              <li>
                We will call each drawn entrant live on stream at the phone number provided on their
                entry.
              </li>
              <li>We will make up to three call attempts within 10 minutes.</li>
              <li>Each attempt will ring until voicemail.</li>
              <li>You must answer the call live; a voicemail or a text back does NOT count.</li>
              <li>
                If there is no answer after the third attempt, that entrant forfeits, and we will
                draw the next name live on the spot.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="band green">
        <div className="wrap">
          <div className="stack c">
            <p className="eb">Bring Your Toughest Question</p>
            <h2 className="h2">What Would You Ask a 7-Figure Owner?</h2>
          </div>
          <div className="gap" />
          <div className="grid g4 topics">
            {TOPICS.map((t) => (
              <div className="card" key={t.title}>
                <Icon>{t.icon}</Icon>
                <h3 className="h3">{t.title}</h3>
                <p className="p">{t.text}</p>
                <p className="micro">
                  <b>Coach:</b> {t.coach}
                </p>
              </div>
            ))}
          </div>
          <div className="gap" />
          <div className="cta">
            <Cta className="btn big" />
          </div>
        </div>
      </section>

      {/* For you / not for you */}
      <section className="band white-l">
        <div className="wrap grid g2">
          <div className="card yes">
            <h3 className="h3">This Is for You If…</h3>
            <ul className="chk">
              <li>You work in tree care: owner, employee, contractor, climber or crew lead.</li>
              <li>You want to grow a tree business, or start your own.</li>
              <li>You want answers from someone who has done it, not theory.</li>
              <li>You can join a 60-minute video call any time after the draw.</li>
            </ul>
          </div>
          <div className="card no">
            <h3 className="h3">This Is Not for You If…</h3>
            <ul className="chk x">
              <li>You’re looking for someone to do the work for you.</li>
              <li>You don’t work in the tree care industry.</li>
              <li>You can’t join a video call after the draw.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why learn from owners */}
      <section className="band green">
        <div className="wrap">
          <div className="stack c">
            <h2 className="h2">Why Advice From an Owner Beats Videos and Forums</h2>
          </div>
          <div className="gap" />
          <div className="grid g2">
            <div className="card night">
              <h3 className="h3">The Usual Way</h3>
              <ul className="chk x">
                <li>Videos and forums made for everyone</li>
                <li>Consultants who never ran a crew</li>
                <li>Tips that may not fit your market</li>
                <li>You guess what applies to you</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="h3">1-on-1 With a 7-Figure Owner</h3>
              <p className="p hl">
                <b>The most important part:</b> personal advice based on your current situation:
                your numbers, your crews, your market.
              </p>
              <ul className="chk">
                <li>Advice built around where your business is today</li>
                <li>They’ve been in your exact situation</li>
                <li>They look at your business and your market</li>
                <li>You leave with clear next steps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing + form */}
      <section className="band closing">
        <div className="wrap split">
          <div className="hero-card">
            <div className="grid g4" aria-hidden="true">
              {COACHES.map((c) => (
                <div className="photo closing-photo" key={c.name}>
                  <img src={c.image} alt={c.name} className="coach-img" />
                </div>
              ))}
            </div>
            <h2 className="h2">Sit Down With a 7-Figure Tree Service Owner</h2>
            <p className="p">
              Entries close Monday, December 14 at 5:00 PM ET. You’ll get a confirmation email right
              away, and the winner is drawn live on December 15. Keep your phone close: you must
              answer to win.
            </p>
          </div>
          <EntryForm anchorId="enter-2" prefix="f2" />
        </div>
      </section>

      {/* FAQ */}
      <section className="band white-r">
        <div className="wrap">
          <div className="stack">
            <p className="eb">FAQ</p>
            <h2 className="h2">Questions? We Have Answers.</h2>
          </div>
          <div className="gap" />
          <div className="faq">
            <Faq items={FAQ_LEFT} openFirst />
            <Faq items={FAQ_RIGHT} />
          </div>
        </div>
      </section>

      <Footer />

      {/* Mobile: button stuck to the bottom of the screen */}
      <div className="mbar">
        <Cta className="btn" />
        <Countdown />
      </div>
    </div>
  );
}
