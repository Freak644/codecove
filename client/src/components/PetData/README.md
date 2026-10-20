# Biloti for EchoVein — port of the Ubuntu pet behavior

This package fixes the browser version by using the real eye-tracking method from the existing Ubuntu/Tauri Biloti implementation instead of guessed eye positions.

## Diagnosis

The Ubuntu component builds an eye mask for every animation frame by locating the actual bright eye regions in the sprite atlas. It then masks the baked-in pupils and draws new pupils toward the cursor. The earlier browser component instead used two guessed normalized anchors and drew ellipse-shaped overlays over the sprite. Since every atlas frame crops and positions Biloti differently, the overlay did not reliably line up with its actual eyes.

The smaller character in the screenshot was also showing a squinting pose. The previous browser logic entered `sit` after 9 seconds and held that pose until another interaction; the Ubuntu implementation uses `sit` as a short, one-shot idle reaction and returns to the original open-eyed idle frame.

## What this version does

- Detects actual eye regions separately for each frame, using the same mask method as the Ubuntu source.
- Converts browser viewport pointer coordinates to canvas-local coordinates before computing gaze direction.
- Repaints the source frame's pupil region and draws moving pupils with the desktop pet's gaze distance/offset behavior.
- Keeps idle on the original first frame with subtle breathing, random blinking, occasional curiosity/sit/walk/happy idle reactions, keyboard paw taps, and sleep after inactivity.
- Keeps the browser-specific floating drag mode, walk/run while dragging, jump after moving the pet, and adjustable width/height.
- Reads key event metadata for reactions only; it does not store typed text or form values.

## Install

Replace `Biloti.jsx`, `Biloti.css`, and `petFrames.js` in the EchoVein project with the files in this package. Keep the sprite atlas in the current path imported by `Biloti.jsx`:

`../../assets/Images/biloti.png`

The sprite atlas is not included because it was not among the supplied files.

## Usage

Anchored in a page container:

```jsx
<Biloti width={150} height={150} mode="anchored" />
```

Floating and draggable within the browser viewport:

```jsx
<Biloti width={140} height={140} mode="floating" />
```
