
import { useEffect, useState, useRef } from "react";
import { Turnstile } from '@marsidev/react-turnstile';
// import Turnstile from "./Turnstile";

export default function SecurityGate({ children }) {
    // const [token, setToken] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [error, setError] = useState("");
    const [isTimeOut, setTime] = useState(false);
    const turnstileRef = useRef(null);
    const verificationLock = useRef(false);
    useEffect(() => {
        let timeOut;

        const handleTimeout = () => {
            setTime(true);
            clearTimeout(timeOut);
        };

        timeOut = setTimeout(handleTimeout, 10000);

        // Cleanup on unmount
        return () => clearTimeout(timeOut);
    }, []);


    
    const handleVerify = async (newToken) => {
        if (!newToken || verificationLock.current) return;

        setIsVerifying(true);
        verificationLock.current = true;
        setError("");

        try {
            const response = await fetch("/myServer/auth/verifyTurnstile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    token: newToken,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok || data?.success !== true) {
                throw new Error(
                    data?.err || data?.message || "Verification failed."
                );
            }

            if (data.success) {
                setVerified(true);
            }

        } catch (error) {
            console.error("Verification error:", error.message);

            setError(
                error.message || "Verification failed. Please try again."
            );

            // Get a fresh token for the next attempt.
            turnstileRef.current?.reset();

        } finally {
            verificationLock.current = false;
            setIsVerifying(false);
        }
    };

    const handleExpire = () => {
        setError("Verification expired. Please try again.");
    };

    const handleError = () => {
        setError("Verification encountered an error. Please try again.");
    };




    // const handleContinue = () => {
    //     if (!token) return;

    //     setVerified(true);
    // };

    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {
            try {
                const response = await fetch(
                    "/myServer/auth/turnstile-status",
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store"
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to check verification session");
                }

                const data = await response.json();

                if (mounted) {
                    setVerified(data.verified === true);
                }

            } catch (error) {
                console.error("Session check failed:", error.message);

                if (mounted) {
                    setVerified(false);
                }

            } finally {
                if (mounted) {
                    setCheckingSession(false);
                }
            }
        };

        checkSession();

        return () => {
            mounted = false;
        };
    }, []);

    if (checkingSession) {
        return (
            <div className="security-gate">
                <div className="security-card">
                    <h2>Welcome to ECHO Nexy</h2>
                    <p>Checking your verification session...</p>
                </div>
            </div>
        );
}

    if (verified) {
        return children;
    }

    return (
        <div className="security-gate">
            <div className="security-card">
                <h1>🛡️ Welcome to <div className="nameHoler gap-1 flex items-center flex-row">
                <h2 className='font-bold text-3xl transition-all duration-300 ease-in-out
                bg-linear-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent'>ECHO</h2>
                <h2 className={`font-bold text-3xl transition-all duration-500 ease-in-out 
                bg-linear-to-b from-yellow-300 from-25%  via-pink-500 via-60% to-purple-500 to-75%
                bg-clip-text text-transparent`}>Nexy</h2>
            </div></h1>

                <p className="text-gray-600 text-sm">
                    This website is uses a security service to protecty against malicious bots. This page is displayed while the website verifies you are not a bot.
                </p>

                <div className="turnstile-container">
                    <Turnstile
                    ref={turnstileRef}
                        siteKey={import.meta.env.VITE_CLOUDFLARE_KEY}
                        options={{
                            theme: "auto",
                            appearance: "always",
                        }}
                        onSuccess={handleVerify}
                        onExpire={handleExpire}
                        onError={handleError}
                    />
                </div>

                {error && (
                    <p className="security-error">
                        {error}
                    </p>
                )}
                {isVerifying && (
                    <p className="text-sm text-blue-500 mt-3">
                        Verifying your request...
                    </p>
                )}

                {isTimeOut && (
                    <div className="mt-3 flex flex-col gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-gray-400">

                        <p className="flex items-center gap-2">
                            <span className="text-yellow-500">⚠</span>
                            If the CAPTCHA is not rendered, please reload the site.
                        </p>

                        <p className="flex flex-wrap items-center gap-1.5">
                            If it gets stuck, press

                            <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-gray-200 shadow-[0_2px_0_rgba(0,0,0,0.3)]">
                                Ctrl
                            </kbd>

                            <span>+</span>

                            <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-gray-200 shadow-[0_2px_0_rgba(0,0,0,0.3)]">
                                Shift
                            </kbd>

                            <span>+</span>

                            <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-gray-200 shadow-[0_2px_0_rgba(0,0,0,0.3)]">
                                R
                            </kbd>
                        </p>
                        <p className="flex items-center gap-1.5">Or just Click on<button className="flex p-px rounded-md text-blue-600 underline hover:text-blue-400 cursor-pointer hover:scale-95" onClick={()=>window.location.reload()}>Reload</button></p>
                    </div>
                )}
                

                <small>
                    Protected by Cloudflare Turnstile
                </small>
            </div>
        </div>
    );
}
