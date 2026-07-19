"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const ringX = useSpring(mouseX, { damping: 30, stiffness: 250, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 250, mass: 0.5 });

  const dotX = useSpring(mouseX, { damping: 40, stiffness: 700, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 700, mass: 0.2 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverEl = target.closest(
        "a, button, img, input, textarea, select, [data-cursor-hover]",
      );
      setIsHovering(!!hoverEl);

      const textEl = target.closest("[data-cursor-text]");
      setCursorText(textEl ? textEl.getAttribute("data-cursor-text") : null);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseleave", () => setIsVisible(false));

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouch) return null;

  const ringSize = cursorText ? 44 : isHovering ? 40 : 32;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 flex items-center justify-center rounded-full border-2 border-primary"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isVisible ? 1 : 0,
          borderColor:
            isHovering || cursorText
              ? "hsl(var(--secondary))"
              : "hsl(var(--primary))",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="select-none text-[9px] font-semibold uppercase tracking-wide text-secondary"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 rounded-full bg-primary"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: cursorText ? 0 : isHovering ? 7 : 6,
          height: cursorText ? 0 : isHovering ? 7 : 6,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering
            ? "hsl(var(--secondary))"
            : "hsl(var(--primary))",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
