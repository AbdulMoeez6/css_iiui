// components/TimelineSection.jsx
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function TimelineSection({
  title = 'Timeline',
  subtitle = 'Key moments & milestones from our journey.',
  items = [
    { id:1, year:'2024', date:'16 Aug 2024', title:'Department Orientation',
      image:'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1400&auto=format&fit=crop',
      text:'Kickstarting the semester with a full house, onboarding, and project picks.' },
    { id:2, year:'2024', date:'02 Sep 2024', title:'Workshop Highlights',
      image:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop',
      text:'Hands-on session: Git, Next.js basics, and deployment gotchas.' },
    { id:3, year:'2024', date:'18 Sep 2024', title:'Tech Talk',
      image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
      text:'Guest speaker on AI in security — demos, Q&A, and resources.' },
    { id:4, year:'2024', date:'26 Oct 2024', title:'Community Meetup',
      image:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
      text:'Show-and-tell, lightning talks, and networking over snacks.' },
    { id:5, year:'2024', date:'12 Nov 2024', title:'Hack Night',
      image:'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop',
      text:'Rapid prototyping evening — ship a tiny thing by midnight.' },
    { id:6, year:'2024', date:'03 Dec 2024', title:'Open Source Sprint',
      image:'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1400&auto=format&fit=crop',
      text:'Issues triage, docs polish, and first PRs for newcomers.' },
    { id:7, year:'2025', date:'15 Jan 2025', title:'Kickoff & Roadmap',
      image:'https://images.unsplash.com/photo-1537432376769-00a0b1d16bfb?q=80&w=1400&auto=format&fit=crop',
      text:'Goals for the new year, committee updates, and project assignments.' },
    { id:8, year:'2025', date:'28 Feb 2025', title:'DevOps Mini-Camp',
      image:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop',
      text:'CI/CD fundamentals, pipelines, and observability crash course.' },
  ],
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const maxIndex = useMemo(() => Math.max(0, items.length - 1), [items.length]);

  // layout
  const AXIS_TOP = 120;
  const DATE_GAP = 24;
  const DIAMOND = 14;
  const LINE_CARD_GAP = 36;
  const CARD_H = 320;

  // ✅ fixed slide width (entire strip: date + diamond + card)
  const SLIDE_W = 240; // px

  const scrollToCard = (i) => {
    const track = trackRef.current; if (!track) return;
    const el = track.children[i];   if (!el) return;
    track.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
  };

  const getPageStep = () => {
    const track = trackRef.current;
    if (!track || !track.children.length) return 1;
    const a = track.children[0], b = track.children[1];
    let stride = a.getBoundingClientRect().width;
    if (b) stride = Math.max(1, b.offsetLeft - a.offsetLeft); // includes gap
    return Math.max(1, Math.round(track.clientWidth / stride));
  };
  const goPage = (dir) => {
    const step = getPageStep();
    setIndex((v) => Math.min(Math.max(v + dir * step, 0), maxIndex));
  };

  // drag / swipe + snap
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    let down=false, startX=0, startScroll=0;
    const getX = (e) => (e.touches ? e.touches[0] : e).clientX;
    const onDown = (e) => { down=true; startX=getX(e); startScroll=track.scrollLeft; };
    const onMove = (e) => { if(!down) return; track.scrollLeft=startScroll+(startX-getX(e)); };
    const snap = () => {
      if(!down) return; down=false;
      let nearest=0, min=Infinity;
      for (let i=0; i<track.children.length; i++) {
        const c = track.children[i];
        const d = Math.abs(c.offsetLeft - track.scrollLeft);
        if (d < min) { min = d; nearest = i; }
      }
      setIndex(nearest);
    };
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', snap);
    track.addEventListener('pointercancel', snap);
    track.addEventListener('touchstart', onDown, { passive:true });
    track.addEventListener('touchmove', onMove, { passive:true });
    track.addEventListener('touchend', snap);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', snap);
      track.removeEventListener('pointercancel', snap);
      track.removeEventListener('touchstart', onDown);
      track.removeEventListener('touchmove', onMove);
      track.removeEventListener('touchend', snap);
    };
  }, []);

  useEffect(() => { scrollToCard(index); }, [index]);

  return (
    <section id="timeline" className="section py-12 md:py-16 relative mx-auto max-w-6xl px-4" style={{ overflow: 'visible' }}>
      <h2 className="section-title text-center">{title}</h2>
      <p className="mt-2 text-center text-sm opacity-80">{subtitle}</p>

      <div className="relative z-10 mt-8" style={{ overflow: 'visible' }}>
        {/* axis */}
        <div
          className="pointer-events-none absolute left-1/2 z-0 hidden -translate-x-1/2 md:block"
          style={{ top: AXIS_TOP, width: 'min(100%, 64rem)', height: 2, background: 'rgba(255,255,255,0.22)' }}
        />

        {/* arrows */}
        <button
          onClick={() => goPage(-1)}
          className="absolute -left-2 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full transition"
          style={{ top: AXIS_TOP, background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Previous"
        >‹</button>
        <button
          onClick={() => goPage(1)}
          className="absolute -right-2 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full transition"
          style={{ top: AXIS_TOP, background:'rgba(0,0,0,0.50)', border:'1px solid rgba(255,255,255,0.22)' }}
          aria-label="Next"
        >›</button>

        {/* track */}
        <ul
          ref={trackRef}
          className="no-scrollbar mx-auto flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible scroll-smooth"
          style={{ maxWidth: '64rem' }}
        >
          {items.map((it) => (
            <li
              key={it.id}
              className="relative snap-start shrink-0"              // ✅ don't shrink; treat as fixed slide
              style={{
                width: `${SLIDE_W}px`,                               // ✅ whole strip is ~240px wide
                scrollMarginLeft: '16px',
                paddingTop: AXIS_TOP + DIAMOND / 2 + LINE_CARD_GAP,   // date/diamond/card spacing
              }}
            >
              {/* date */}
              <div
                className="absolute left-1/2 text-center"
                style={{ top: AXIS_TOP, transform: `translate(-50%, calc(-100% - ${DATE_GAP}px))` }}
              >
                <span className="rounded bg-white px-3 py-1 text-xs font-semibold text-black shadow">
                  {it.date}
                </span>
              </div>

              {/* diamond marker */}
              <span
                className="absolute block"
                style={{
                  left: '50%',
                  top: AXIS_TOP,
                  width: `${DIAMOND}px`,
                  height: `${DIAMOND}px`,
                  background: '#fff',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
              />

              {/* card fills the slide width */}
              <article
                className="card bg-black/40 rounded-lg p-2 text-center transition flex flex-col hover:-translate-y-0.5"
                style={{ height: `${CARD_H}px`, border: 0 }}
              >
                <div className="overflow-hidden rounded-md">
                  <img
                    src={it.image}
                    alt=""
                    className="h-44 w-full object-cover transition-transform duration-200 ease-out hover:scale-[1.02]"
                    draggable={false}
                  />
                </div>

                <h3 className="mt-3 text-base font-extrabold leading-snug">{it.title}</h3>
                <p
                  className="mt-1 text-sm text-white/80"
                  style={{ display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}
                >
                  {it.text}
                </p>

                <div className="mt-auto pt-2 text-xs text-white/70">Tap for details</div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


