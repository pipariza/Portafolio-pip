// Generated from the captures of the real platform (see lib/i18n/app-demos.ts): the frames of each
// step of the "how it works" demos. All sizes are CSS px of a 390 x 800 phone screen; the files in
// public/apps/visual are at 2x. A "still" is held for `hold` seconds; a "tour" is a tall page that
// scrolls slowly under a pinned bar (`top`, `bottom`).
export type DemoFrame =
  | { kind: "still"; src: string; hold: number }
  | {
      kind: "tour";
      src: string;
      /** Height of the scrolling page (px at 1x), without the pinned bars. */
      h: number;
      top?: { src: string; h: number };
      bottom?: { src: string; h: number };
    };

export const SCREEN = { w: 390, h: 800 } as const;

export const VISUAL_FRAMES: Record<string, DemoFrame[]> = {
  "tareas-1": [
    { kind: "still", src: "/apps/visual/tareas-1-f1.jpg", hold: 1.4 },
    { kind: "still", src: "/apps/visual/tareas-1-f2.jpg", hold: 1.3 },
    { kind: "still", src: "/apps/visual/tareas-1-f3.jpg", hold: 1.3 },
    { kind: "still", src: "/apps/visual/tareas-1-f4.jpg", hold: 1.7 },
    { kind: "still", src: "/apps/visual/tareas-1-f5.jpg", hold: 2 },
  ],
  "tareas-2": [
    { kind: "tour", src: "/apps/visual/tareas-2-content.jpg", h: 1574, bottom: { src: "/apps/visual/tareas-2-pin-bottom.jpg", h: 54 } },
  ],
  "tareas-3": [
    { kind: "still", src: "/apps/visual/tareas-3-f1.jpg", hold: 1.7 },
    { kind: "still", src: "/apps/visual/tareas-3-f2.jpg", hold: 1.9 },
    { kind: "still", src: "/apps/visual/tareas-3-f3.jpg", hold: 1.5 },
    { kind: "still", src: "/apps/visual/tareas-3-f4.jpg", hold: 1.7 },
    { kind: "still", src: "/apps/visual/tareas-3-f5.jpg", hold: 2 },
  ],
  "tareas-4": [
    { kind: "tour", src: "/apps/visual/tareas-4-content.jpg", h: 1560, bottom: { src: "/apps/visual/tareas-4-pin-bottom.jpg", h: 54 } },
  ],
  "tareas-5": [
    { kind: "still", src: "/apps/visual/tareas-5-f1.jpg", hold: 1.6 },
    { kind: "still", src: "/apps/visual/tareas-5-f2.jpg", hold: 1.5 },
    { kind: "still", src: "/apps/visual/tareas-5-f3.jpg", hold: 1.5 },
    { kind: "still", src: "/apps/visual/tareas-5-f4.jpg", hold: 2.4 },
    { kind: "still", src: "/apps/visual/tareas-5-f5.jpg", hold: 1.5 },
    { kind: "still", src: "/apps/visual/tareas-5-f6.jpg", hold: 3 },
  ],
  "cronogramas-1": [
    { kind: "tour", src: "/apps/visual/cronogramas-1-content.jpg", h: 1263, bottom: { src: "/apps/visual/cronogramas-1-pin-bottom.jpg", h: 54 } },
    { kind: "still", src: "/apps/visual/cronogramas-1-f2.jpg", hold: 1.2 },
    { kind: "still", src: "/apps/visual/cronogramas-1-f3.jpg", hold: 1.2 },
    { kind: "still", src: "/apps/visual/cronogramas-1-f4.jpg", hold: 1.4 },
    { kind: "still", src: "/apps/visual/cronogramas-1-f5.jpg", hold: 2.2 },
  ],
  "cronogramas-2": [
    { kind: "tour", src: "/apps/visual/cronogramas-2-content.jpg", h: 1283, top: { src: "/apps/visual/cronogramas-2-pin-top.jpg", h: 98 } },
  ],
  "cronogramas-3": [
    { kind: "still", src: "/apps/visual/cronogramas-3-f1.jpg", hold: 1.7 },
    { kind: "still", src: "/apps/visual/cronogramas-3-f2.jpg", hold: 1.7 },
    { kind: "still", src: "/apps/visual/cronogramas-3-f3.jpg", hold: 1.9 },
    { kind: "still", src: "/apps/visual/cronogramas-3-f4.jpg", hold: 2.2 },
  ],
  "cronogramas-4": [
    { kind: "tour", src: "/apps/visual/cronogramas-4-content.jpg", h: 1263, bottom: { src: "/apps/visual/cronogramas-4-pin-bottom.jpg", h: 54 } },
  ],
};
