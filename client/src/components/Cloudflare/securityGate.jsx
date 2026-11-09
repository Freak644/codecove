
import { useEffect, useState } from "react";
import Turnstile from "./Turntile";
// import Turnstile from "./Turnstile";

export default function SecurityGate({ children }) {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [isTimeOut, setTime] = useState(false);

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

    const handleVerify = (newToken) => {
        setToken(newToken);
        setError("");
    };

    const handleExpire = () => {
        setToken("");
        setVerified(false);
        setError("Verification expired. Please try again.");
    };

    const handleError = () => {
        setToken("");
        setVerified(false);
        setError("Verification failed. Please try again.");
    };

    const handleContinue = () => {
        if (!token) return;

        setVerified(true);
    };

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

                <p>
                    Complete the security verification
                    before entering the website.
                </p>

                <div className="turnstile-container">
                    <Turnstile
                        onVerify={handleVerify}
                        onExpire={handleExpire}
                        onError={handleError}
                    />
                </div>

                {error && (
                    <p className="security-error">
                        {error}
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
                    </div>
                )}
                

                <small>
                    Protected by Cloudflare Turnstile
                </small>
            </div>
        </div>
    );
}
