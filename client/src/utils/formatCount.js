export const formatCount = (value) => {
            if (value == null || isNaN(value)) return "0";

            const abs = Math.abs(value);
            const units = [
                { limit: 1e9, suffix: "B" },
                { limit: 1e6, suffix: "M" },
                { limit: 1e3, suffix: "K" }
            ];

            for (const { limit, suffix } of units) {
                if (abs >= limit) {
                    // 👇 truncate instead of round
                    const truncated = Math.floor((abs / limit) * 10) / 10;

                    return (value < 0 ? "-" : "") +
                        truncated.toString().replace(/\.0$/, "") +
                        suffix;
                }
            }

            return value.toString();
        }