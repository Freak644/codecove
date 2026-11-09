import { useEffect, useRef } from "react";

const SCRIPT_URL =
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise;

function loadTurnstileScript() {
    if (window.turnstile) {
        return Promise.resolve(window.turnstile);
    }

    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const existingScript = document.querySelector(
                `script[src="${SCRIPT_URL}"]`
            );

            if (existingScript) {
                existingScript.addEventListener("load", () =>
                    resolve(window.turnstile)
                );
                existingScript.addEventListener("error", reject);
                return;
            }

            const script = document.createElement("script");
            script.src = SCRIPT_URL;
            script.async = true;
            script.defer = true;

            script.onload = () => resolve(window.turnstile);
            script.onerror = reject;

            document.head.appendChild(script);
        }).catch((error) => {
            scriptPromise = undefined;
            throw error;
        });
    }

    return scriptPromise;
}

export default function Turnstile({
    onVerify,
    onExpire,
    onError,
}) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    const callbacksRef = useRef({ onVerify, onExpire, onError });

    useEffect(() => {
        callbacksRef.current = { onVerify, onExpire, onError };
    }, [onVerify, onExpire, onError]);

    useEffect(() => {
        let mounted = true;

        async function initialize() {
            try {
                const turnstile = await loadTurnstileScript();

                if (!mounted || !containerRef.current) return;

                widgetIdRef.current = turnstile.render(
                    containerRef.current,
                    {
                        sitekey: import.meta.env.VITE_CLOUDFLARE_KEY,
                        theme: "auto",
                        appearance: "always",

                        callback: (token) => {
                            callbacksRef.current.onVerify?.(token);
                        },

                        "expired-callback": () => {
                            callbacksRef.current.onExpire?.();
                        },

                        "error-callback": (errorCode) => {
                            callbacksRef.current.onError?.(errorCode);
                        },
                    }
                );
            } catch (error) {
                console.error("Turnstile initialization failed:", error);
                callbacksRef.current.onError?.(error);
            }
        }

        initialize();

        return () => {
            mounted = false;

            if (widgetIdRef.current !== null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    return <div ref={containerRef} />;
}