import { useEffect, useRef, useState } from "react";
import { spriteFrames } from "./petFrames";
import bilotiSheet from "../../assets/Images/biloti.png";
import "./pet.css";

// Frame timings derived from the Ubuntu/Tauri Biloti animation durations.
const FRAME_MS = {
    idle: 150, // idle stays on frame 0; breathing is drawn separately
    blink: 30, // 6 frames / 180ms
    walk: 87.5, // 8 frames / 700ms for idle reactions
    run: 50,
    jump: 70,
    sit: 125, // 4 frames / 500ms
    sleep: 200, // 6 frames / 1200ms
    keyboardLeft: 30, // 6 frames / 180ms
    keyboardRight: 30,
    happy: 75, // 6 frames / 450ms
    curious: 500 / 6,
    extra: 87.5,
};

// Only these poses are persistent loops. Other animations return to idle.
const LOOPING = new Set(["idle", "walk", "run", "sleep"]);
const CLOSED_EYE_POSES = new Set(["blink", "sleep"]);
const KEYBOARD_KEYS = new Set([
    "Enter", "Backspace", "Tab", " ", "ArrowUp", "ArrowDown",
    "ArrowLeft", "ArrowRight", "Delete",
]);

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function setBehavior(behaviorRef, name, options = {}, now = performance.now()) {
    const frames = spriteFrames[name];
    if (!frames?.length) return;

    const loop = options.loop ?? LOOPING.has(name);
    const frameMs = FRAME_MS[name] ?? 120;

    behaviorRef.current = {
        name,
        frameIndex: 0,
        lastFrameAt: now,
        loop,
        returnTo: options.returnTo ?? "idle",
        endAt: loop ? null : now + frames.length * frameMs,
    };
}

function cssLength(value) {
    return typeof value === "number" ? `${value}px` : value;
}


/**
 * Build eye masks from the source atlas the same way as the Ubuntu/Tauri pet.
 * Every animation frame has its own eye coordinates, so no eye anchors are guessed.
 */
function buildEyeData(image, spriteFrames) {
    const map = new Map();

    Object.entries(spriteFrames).forEach(([animationName, frames]) => {
        frames.forEach(([sx, sy, sw, sh], frameIndex) => {
            const temp = document.createElement("canvas");
            temp.width = sw;
            temp.height = sh;

            const tempCtx = temp.getContext("2d", { willReadFrequently: true });
            if (!tempCtx) return;

            tempCtx.imageSmoothingEnabled = false;
            tempCtx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);

            let imageData;
            try {
                imageData = tempCtx.getImageData(0, 0, sw, sh);
            } catch (error) {
                console.error("Biloti could not inspect sprite pixels for eye tracking:", error);
                return;
            }

            const data = imageData.data;
            const visited = new Uint8Array(sw * sh);
            const components = [];

            const isWhite = (x, y) => {
                const i = (y * sw + x) * 4;
                return data[i + 3] > 180 &&
                    data[i] > 220 &&
                    data[i + 1] > 220 &&
                    data[i + 2] > 220;
            };

            for (let y = 0; y < sh; y++) {
                for (let x = 0; x < sw; x++) {
                    const index = y * sw + x;
                    if (visited[index] || !isWhite(x, y)) continue;

                    const queue = [[x, y]];
                    visited[index] = 1;
                    let minX = x;
                    let maxX = x;
                    let minY = y;
                    let maxY = y;

                    while (queue.length) {
                        const [px, py] = queue.pop();
                        minX = Math.min(minX, px);
                        maxX = Math.max(maxX, px);
                        minY = Math.min(minY, py);
                        maxY = Math.max(maxY, py);

                        const neighbors = [
                            [px + 1, py],
                            [px - 1, py],
                            [px, py + 1],
                            [px, py - 1],
                        ];0

                        for (const [nx, ny] of neighbors) {
                            if (nx < 0 || nx >= sw || ny < 0 || ny >= sh) continue;
                            const ni = ny * sw + nx;
                            if (visited[ni] || !isWhite(nx, ny)) continue;
                            visited[ni] = 1;
                            queue.push([nx, ny]);
                        }
                    }

                    const width = maxX - minX + 1;
                    const height = maxY - minY + 1;
                    if (width >= 8 && height >= 8 && width < 40 && height < 40) {
                        components.push({ x: minX, y: minY, width, height });
                    }
                }
            }

            components.sort((a, b) => a.x - b.x);
            const eyes = components.slice(0, 2);
            if (eyes.length !== 2) return;

            const eyeMasks = eyes.map((eye) => {
                const mask = document.createElement("canvas");
                mask.width = eye.width;
                mask.height = eye.height;

                const maskCtx = mask.getContext("2d");
                if (!maskCtx) return null;

                // This is deliberately the same mask style as the desktop pet.
                maskCtx.fillStyle = "white";
                maskCtx.fillRect(0, 0, eye.width, eye.height);

                for (let py = 1; py < eye.height - 1; py++) {
                    for (let px = 1; px < eye.width - 1; px++) {
                        const sourceX = eye.x + px;
                        const sourceY = eye.y + py;
                        const i = (sourceY * sw + sourceX) * 4;

                        if (
                            data[i + 3] > 100 &&
                            data[i] < 100 &&
                            data[i + 1] < 100 &&
                            data[i + 2] < 100
                        ) {
                            maskCtx.fillStyle = "white";
                            maskCtx.fillRect(px, py, 1, 1);
                        }
                    }
                }

                return {
                    x: eye.x,
                    y: eye.y,
                    width: eye.width,
                    height: eye.height,
                    canvas: mask,
                };
            });

            if (eyeMasks.every(Boolean)) {
                map.set(`${animationName}-${frameIndex}`, eyeMasks);
            }
        });
    });

    return map;
}

/**
 * Browser Biloti.
 * mode="anchored": stays in the layout where it is rendered.
 * mode="floating": fixed to the viewport and draggable by default.
 *
 * Width and height accept numbers (pixels) or CSS lengths, including clamp().
 */
export default function Biloti({
    width = 200,
    height = 200,
    mode = "anchored",
    draggable,
    isDrag,
    initialPosition,
    sleepAfterMs = 30000,
    eyeTracking = true,
    className = "",
    zIndex = 1000,
}) {
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const eyeDataRef = useRef(new Map());
    const behaviorRef = useRef({
        name: "idle",
        frameIndex: 0,
        lastFrameAt: 0,
        loop: true,
        returnTo: "idle",
        endAt: null,
    });
    const settingsRef = useRef(null);
    const lastActivityRef = useRef(0);
    const nextBlinkAtRef = useRef(0);
    const pointerRef = useRef({ x: 0, y: 0, known: false });
    const dragRef = useRef({
        active: false,
        pointerId: null,
        offsetX: 0,
        offsetY: 0,
        previousX: 0,
        previousY: 0,
        previousAt: 0,
        distance: 0,
    });
    const keyboardSideRef = useRef("keyboardRight");
    const lastKeyboardAnimationAtRef = useRef(0);
    const [floatingPosition, setFloatingPosition] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Preserve the old isDrag prop as a compatibility alias, but a pet can only
    // move when it is in floating mode. Anchored pets never leave their container.
    const canDrag = mode === "floating" && (draggable ?? isDrag ?? true);
    settingsRef.current = {
        width,
        height,
        mode,
        canDrag,
        sleepAfterMs,
        eyeTracking,
    };

    const play = (name, options = {}) => {
        const now = performance.now();
        setBehavior(behaviorRef, name, options, now);
    };

    const markActivity = (source = "pointer") => {
        const now = performance.now();
        lastActivityRef.current = now;

        const current = behaviorRef.current.name;
        if (current === "sleep") {
            // The desktop Biloti wakes with a blink. Drag release may still
            // use the jump animation as a browser-specific interaction.
            setBehavior(behaviorRef, "blink", { returnTo: "idle" }, now);
        }
    };

    // Load the actual atlas. No generated or invented animation frames are used.
    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            imageRef.current = image;
            eyeDataRef.current = buildEyeData(image, spriteFrames);
        };
        image.onerror = () => {
            console.error("Biloti sprite atlas could not be loaded:", bilotiSheet);
        };
        image.src = bilotiSheet;

        return () => {
            image.onload = null;
            image.onerror = null;
            imageRef.current = null;
            eyeDataRef.current = new Map();
        };
    }, []);

    // Start the floating pet near the bottom-right and keep it inside the viewport.
    useEffect(() => {
        if (mode !== "floating") return undefined;

        const placeOrClamp = () => {
            const rect = rootRef.current?.getBoundingClientRect();
            const petWidth = rect?.width || (typeof width === "number" ? width : 200);
            const petHeight = rect?.height || (typeof height === "number" ? height : 200);
            setFloatingPosition((current) => {
                const proposed = current ?? initialPosition ?? {
                    x: window.innerWidth - petWidth - 20,
                    y: window.innerHeight - petHeight - 20,
                };
                return {
                    x: clamp(proposed.x, 0, Math.max(0, window.innerWidth - petWidth)),
                    y: clamp(proposed.y, 0, Math.max(0, window.innerHeight - petHeight)),
                };
            });
        };

        placeOrClamp();
        window.addEventListener("resize", placeOrClamp);
        return () => window.removeEventListener("resize", placeOrClamp);
    }, [mode, width, height, initialPosition]);

    // Global events are scoped to this browser page/tab. Like the desktop app,
    // Biloti reacts to cursor proximity, pointer interaction, and key presses;
    // the actual typed text is never read or stored.
    useEffect(() => {
        const onPointerMove = (event) => {
            const previous = pointerRef.current;
            pointerRef.current = {
                x: event.clientX,
                y: event.clientY,
                known: true,
            };

            const movedEnough = !previous.known ||
                Math.hypot(event.clientX - previous.x, event.clientY - previous.y) >= 4;

            if (movedEnough && behaviorRef.current.name !== "sleep") {
                lastActivityRef.current = performance.now();
            }

            if (behaviorRef.current.name === "sit" && !dragRef.current.active) {
                setBehavior(behaviorRef, "idle", { loop: true });
            }
        };

        const onPointerDown = () => {
            lastActivityRef.current = performance.now();
            if (behaviorRef.current.name === "sleep") {
                setBehavior(behaviorRef, "blink", { returnTo: "idle" });
            } else if (behaviorRef.current.name === "sit") {
                setBehavior(behaviorRef, "idle", { loop: true });
            }
        };

        const onKeyDown = (event) => {
            if (document.hidden || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
            if (event.key.length !== 1 && !KEYBOARD_KEYS.has(event.key)) return;

            const now = performance.now();
            lastActivityRef.current = now;

            // The desktop pet wakes from sleep with a blink, then resumes
            // keyboard paw reactions on subsequent key presses.
            if (behaviorRef.current.name === "sleep") {
                setBehavior(behaviorRef, "blink", { returnTo: "idle" }, now);
                return;
            }

            if (now - lastKeyboardAnimationAtRef.current < 180) return;
            lastKeyboardAnimationAtRef.current = now;
            keyboardSideRef.current = keyboardSideRef.current === "keyboardLeft"
                ? "keyboardRight"
                : "keyboardLeft";
            setBehavior(behaviorRef, keyboardSideRef.current, { returnTo: "idle" }, now);
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerdown", onPointerDown, true);
        window.addEventListener("keydown", onKeyDown, true);
        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerdown", onPointerDown, true);
            window.removeEventListener("keydown", onKeyDown, true);
        };
    }, []);

    // The animation loop keeps idle on its original first frame, breathes subtly,
    // blinks occasionally, and enters sleep after prolonged inactivity. Brief idle
    // reactions and cursor-proximity curiosity are scheduled separately below.
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return undefined;

        let rafId = 0;
        let lastVisibleTime = performance.now();
        lastActivityRef.current = lastActivityRef.current || lastVisibleTime;
        nextBlinkAtRef.current = nextBlinkAtRef.current || lastVisibleTime + randomBetween(3000, 8000);
        behaviorRef.current.lastFrameAt = lastVisibleTime;

        const onVisibilityChange = () => {
            lastVisibleTime = performance.now();
            behaviorRef.current.lastFrameAt = lastVisibleTime;
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        const render = (now) => {
            rafId = requestAnimationFrame(render);
            if (document.hidden) return;

            const rect = canvas.getBoundingClientRect();
            const cssWidth = rect.width;
            const cssHeight = rect.height;
            if (!cssWidth || !cssHeight) return;

            const dpr = Math.max(1, window.devicePixelRatio || 1);
            const pixelWidth = Math.round(cssWidth * dpr);
            const pixelHeight = Math.round(cssHeight * dpr);
            if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
                canvas.width = pixelWidth;
                canvas.height = pixelHeight;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cssWidth, cssHeight);

            const drag = dragRef.current;
            let state = behaviorRef.current;
            const idleFor = now - lastActivityRef.current;

            if (drag.active) {
                // The browser's draggable pet walks/runs while the user moves it.
                if (state.name !== "walk" && state.name !== "run") {
                    setBehavior(behaviorRef, "walk", { loop: true }, now);
                }
            } else {
                state = behaviorRef.current;
                if (!state.loop && state.endAt !== null && now >= state.endAt) {
                    const next = state.returnTo || "idle";
                    setBehavior(behaviorRef, next, { loop: LOOPING.has(next) }, now);
                    if (next === "idle") {
                        nextBlinkAtRef.current = now + randomBetween(3000, 8000);
                    }
                }

                state = behaviorRef.current;
                const current = state.name;
                const config = settingsRef.current;

                // Match the desktop pet: it stays in open-eyed idle, briefly
                // performs occasional reactions, and sleeps after prolonged inactivity.
                if (idleFor >= config.sleepAfterMs && current !== "sleep" && current === "idle") {
                    setBehavior(behaviorRef, "sleep", { loop: true }, now);
                } else if (now >= nextBlinkAtRef.current) {
                    if (current === "idle") {
                        setBehavior(behaviorRef, "blink", { returnTo: "idle" }, now);
                    }
                    nextBlinkAtRef.current = now + randomBetween(3000, 8000);
                }
            }

            state = behaviorRef.current;
            const frames = spriteFrames[state.name] || spriteFrames.idle;
            const frameMs = FRAME_MS[state.name] || 120;

            // The Ubuntu pet holds idle frame 0 and animates a subtle breath;
            // non-idle animations advance through their actual source frames.
            if (state.name !== "idle" && now - state.lastFrameAt >= frameMs) {
                const elapsedFrames = Math.max(1, Math.floor((now - state.lastFrameAt) / frameMs));
                state.lastFrameAt += elapsedFrames * frameMs;
                if (state.loop) {
                    state.frameIndex = (state.frameIndex + elapsedFrames) % frames.length;
                } else {
                    state.frameIndex = Math.min(frames.length - 1, state.frameIndex + elapsedFrames);
                }
            }

            const image = imageRef.current;
            const frame = frames[state.frameIndex] || frames[0];
            if (!image || !image.complete || !image.naturalWidth || !frame) return;

            const [sx, sy, sw, sh] = frame;

            // At 200×200, match the desktop pet's original 1.25× sprite scale.
            // Other sizes scale uniformly, preserving the original proportions.
            const baseScale = Math.min(cssWidth / 200, cssHeight / 200);
            const breathing = state.name === "idle"
                ? Math.sin(now * 0.003) * 0.5 + 0.5
                : 0;
            const breathScaleY = state.name === "idle" ? 1 + breathing * 0.018 : 1;
            const breathScaleX = state.name === "idle" ? 1 - breathing * 0.006 : 1;
            const breathY = state.name === "idle" ? Math.round(breathing * 1.2 * baseScale) : 0;
            const scale = 1.25 * baseScale;
            const drawWidth = Math.round(sw * scale * breathScaleX);
            const drawHeight = Math.round(sh * scale * breathScaleY);
            const drawX = Math.round((cssWidth - drawWidth) / 2);
            const drawY = Math.round(cssHeight - drawHeight - 8 * baseScale - breathY);

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, sx, sy, sw, sh, drawX, drawY, drawWidth, drawHeight);

            // Use the desktop pet's real per-frame eye masks. The browser pointer
            // is in viewport coordinates, so convert it into canvas-local CSS pixels.
            const config = settingsRef.current;
            if (config.eyeTracking && !CLOSED_EYE_POSES.has(state.name) && pointerRef.current.known) {
                const eyeMasks = eyeDataRef.current.get(`${state.name}-${state.frameIndex}`);
                if (eyeMasks?.length === 2) {
                    const canvasRect = canvas.getBoundingClientRect();
                    const localCursorX = pointerRef.current.x - canvasRect.left;
                    const localCursorY = pointerRef.current.y - canvasRect.top;

                    const dx = localCursorX - cssWidth / 2;
                    const dy = localCursorY - cssHeight / 2;
                    const distance = Math.hypot(dx, dy);

                    // Same gaze range as the Ubuntu implementation, scaled with widget size.
                    const isClose = distance < 500;
                    const maxPupilX = (isClose ? 5.5 : 3.5) * baseScale;
                    const maxPupilY = (isClose ? 4.5 : 3.0) * baseScale;
                    const directionLength = distance || 1;
                    const directionX = dx / directionLength;
                    const directionY = dy / directionLength;

                    eyeMasks.forEach((eye) => {
                        const eyeX = drawX + eye.x * (drawWidth / sw);
                        const eyeY = drawY + eye.y * (drawHeight / sh);
                        const eyeWidth = eye.width * (drawWidth / sw);
                        const eyeHeight = eye.height * (drawHeight / sh);

                        // Hide the pupil baked into this exact sprite frame.
                        ctx.drawImage(eye.canvas, eyeX, eyeY, eyeWidth, eyeHeight);

                        const pupilSize = Math.max(3 * baseScale, Math.min(eyeWidth, eyeHeight) * 0.38);
                        const pupilX = eyeX + eyeWidth / 2 - pupilSize / 2 + directionX * maxPupilX;
                        const pupilY = eyeY + eyeHeight / 2 - pupilSize / 2 + directionY * maxPupilY;

                        ctx.fillStyle = "#000";
                        ctx.fillRect(
                            Math.round(pupilX),
                            Math.round(pupilY),
                            Math.round(pupilSize),
                            Math.round(pupilSize)
                        );
                    });
                }
            }
        };

        rafId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    // Cursor proximity occasionally triggers a curious pose, just like the
    // desktop pet. It is a probability-based reaction, not an animation playlist.
    useEffect(() => {
        let timer = 0;
        let cancelled = false;

        const checkCursor = () => {
            if (cancelled) return;

            const pointer = pointerRef.current;
            const rect = rootRef.current?.getBoundingClientRect();
            if (
                pointer.known &&
                rect &&
                !document.hidden &&
                !dragRef.current.active &&
                behaviorRef.current.name === "idle"
            ) {
                const dx = pointer.x - (rect.left + rect.width / 2);
                const dy = pointer.y - (rect.top + rect.height / 2);
                if (Math.hypot(dx, dy) < 500 && Math.random() < 0.25) {
                    setBehavior(behaviorRef, "curious", { loop: false, returnTo: "idle" });
                }
            }

            timer = window.setTimeout(checkCursor, 1200);
        };

        checkCursor();
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, []);

    // The desktop pet occasionally performs one short idle action when nothing
    // else is happening. Every choice is a complete pose animation returning to idle.
    useEffect(() => {
        let timer = 0;
        let cancelled = false;

        const scheduleIdle = () => {
            timer = window.setTimeout(() => {
                if (cancelled) return;

                if (
                    !document.hidden &&
                    !dragRef.current.active &&
                    behaviorRef.current.name === "idle"
                ) {
                    const random = Math.random();
                    if (random < 0.40) {
                        setBehavior(behaviorRef, "curious", { loop: false, returnTo: "idle" });
                    } else if (random < 0.70) {
                        setBehavior(behaviorRef, "sit", { loop: false, returnTo: "idle" });
                    } else if (random < 0.90) {
                        setBehavior(behaviorRef, "walk", { loop: false, returnTo: "idle" });
                    } else {
                        setBehavior(behaviorRef, "happy", { loop: false, returnTo: "idle" });
                    }
                }

                scheduleIdle();
            }, randomBetween(7000, 16000));
        };

        scheduleIdle();
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, []);

    const handlePointerDown = (event) => {
        if (event.button !== 0) return;
        lastActivityRef.current = performance.now();

        if (!canDrag) return;
        event.preventDefault();
        const rect = rootRef.current.getBoundingClientRect();
        dragRef.current = {
            active: true,
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            previousX: event.clientX,
            previousY: event.clientY,
            previousAt: performance.now(),
            distance: 0,
        };
        setIsDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
        play("walk", { loop: true });
    };

    const handlePointerMove = (event) => {
        const drag = dragRef.current;
        if (!canDrag || !drag.active || event.pointerId !== drag.pointerId) return;

        const now = performance.now();
        const dx = event.clientX - drag.previousX;
        const dy = event.clientY - drag.previousY;
        const distance = Math.hypot(dx, dy);
        const elapsed = Math.max(1, now - drag.previousAt);
        const speed = distance / elapsed;
        drag.distance += distance;
        drag.previousX = event.clientX;
        drag.previousY = event.clientY;
        drag.previousAt = now;

        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) return;
        setFloatingPosition({
            x: clamp(event.clientX - drag.offsetX, 0, Math.max(0, window.innerWidth - rect.width)),
            y: clamp(event.clientY - drag.offsetY, 0, Math.max(0, window.innerHeight - rect.height)),
        });

        const next = speed > 0.9 ? "run" : "walk";
        if (behaviorRef.current.name !== next) play(next, { loop: true });
    };

    const handlePointerUp = (event) => {
        const drag = dragRef.current;
        if (drag.active && event.pointerId === drag.pointerId) {
            const moved = drag.distance;
            dragRef.current.active = false;
            dragRef.current.pointerId = null;
            setIsDragging(false);
            lastActivityRef.current = performance.now();
            if (moved >= 7) {
                play("jump", { returnTo: "idle" });
            } else {
                play("blink", { returnTo: "idle" });
            }
            return;
        }

        // An anchored pet stays put but still reacts to being clicked.
        if (event.button === 0 && (mode === "anchored" || !canDrag)) {
            markActivity("pointer");
            play("blink", { returnTo: "idle" });
        }
    };

    const handleLostPointerCapture = (event) => {
        const drag = dragRef.current;
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        dragRef.current.active = false;
        dragRef.current.pointerId = null;
        setIsDragging(false);
        lastActivityRef.current = performance.now();
        play("jump", { returnTo: "idle" });
    };

    const style = {
        width: cssLength(width),
        height: cssLength(height),
        zIndex: mode === "floating" ? zIndex : undefined,
    };
    if (mode === "floating") {
        style.position = "fixed";
        if (floatingPosition) {
            style.left = `${floatingPosition.x}px`;
            style.top = `${floatingPosition.y}px`;
            style.right = "auto";
            style.bottom = "auto";
        } else {
            style.right = "20px";
            style.bottom = "20px";
        }
    }

    return (
        <div
            ref={rootRef}
            className={`biloti-widget ${mode === "floating" ? "biloti-widget--floating" : "biloti-widget--anchored"} ${canDrag ? "biloti-widget--draggable" : ""} ${isDragging ? "biloti-widget--dragging" : ""} ${className}`.trim()}
            style={style}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handleLostPointerCapture}
            onLostPointerCapture={handleLostPointerCapture}
            role="img"
            aria-label="Biloti animated pet"
        >
            <canvas ref={canvasRef} className="biloti-canvas" aria-hidden="true" />
        </div>
    );
}
