import React, { useRef, useState, useCallback } from "react";

/**
 * SwipeReveal — drag the card left to reveal contextual actions.
 * Native-feeling rubber-band resistance, snap-to-reveal threshold,
 * pointer events for true touch + mouse + pen support.
 */
export default function SwipeReveal({ children, actions, maxReveal = 132, testid }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const baseOffset = useRef(0);

  const onPointerDown = useCallback((e) => {
    startX.current = e.clientX;
    baseOffset.current = offset;
    setDragging(true);
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, [offset]);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    let next = baseOffset.current + dx;
    if (next > 0) next = next * 0.18;
    if (next < -maxReveal) next = -maxReveal + (next + maxReveal) * 0.25;
    setOffset(next);
  }, [dragging, maxReveal]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    setOffset((cur) => (cur < -maxReveal / 2 ? -maxReveal : 0));
  }, [dragging, maxReveal]);

  return (
    <div
      className="swipe-wrap"
      data-testid={testid}
      data-open={offset < -2 ? "true" : "false"}
    >
      <div className="swipe-actions" style={{ width: maxReveal }}>
        {actions}
      </div>
      <div
        className="swipe-content"
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
          transition: dragging
            ? "none"
            : "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {children}
      </div>
    </div>
  );
}
