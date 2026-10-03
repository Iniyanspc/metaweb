"use client";

/** One shared IntersectionObserver for every reveal on the page. */
type Callback = () => void;
const callbacks = new WeakMap<Element, Callback>();
let io: IntersectionObserver | null = null;

export function observeOnce(el: Element, onEnter: Callback) {
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {};
  }
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        callbacks.get(e.target)?.();
        callbacks.delete(e.target);
        io?.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  callbacks.set(el, onEnter);
  io.observe(el);
  return () => {
    callbacks.delete(el);
    io?.unobserve(el);
  };
}
