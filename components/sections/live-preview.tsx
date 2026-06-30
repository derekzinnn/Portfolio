"use client";

import { useEffect, useState } from "react";

import { useInView } from "@/hooks/use-in-view";

// The site renders at a desktop logical width, then scales to fit the frame.
const BASE_W = 1280;
const BASE_H = 800; // 16:10, matches the mockup frame

/**
 * Live, scaled embed of a running project. Mounts the iframe only when the card
 * nears the viewport (perf), measures the frame with a ResizeObserver, and
 * scales a 1280×800 desktop render down to fit. Non-interactive (pointer-events
 * off) so it reads as a preview and the page keeps scrolling; the card's link
 * handles opening the real site.
 *
 * Requires the embedded site to allow framing from this origin
 * (`Content-Security-Policy: frame-ancestors …`) — see lib/constants.ts.
 */
export function LivePreview({ url, title }: { url: string; title: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: true,
    rootMargin: "300px 0px",
  });
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? node.clientWidth;
      if (width) setScale(width / BASE_W);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [ref]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {inView && scale > 0 && (
        <iframe
          src={url}
          title={`${title} — live preview`}
          loading="lazy"
          aria-hidden="true"
          tabIndex={-1}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="absolute top-0 left-0 origin-top-left border-0"
          style={{
            width: `${BASE_W}px`,
            height: `${BASE_H}px`,
            transform: `scale(${scale})`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
