import {completeRequest} from '../Controllers/progressTracker.js'
export const getNews = async (rkv, rspo) => {
  const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
  const crntAPI = rkv.originalUrl.split("?")[0];

  try {
    const response = await fetch(
      "https://www.reddit.com/r/technology/new.json?limit=20",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        }
      }
    );

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const html = await response.text();
      console.log("Reddit HTML block:", html.substring(0, 200));
      return rspo.status(500).json({ error: "Reddit returned HTML instead of JSON" });
    }

    const json = await response.json();
    const posts = json.data.children;

    const formatted = posts
      .map(p => {
        const d = p.data;

        const img =
          d.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") || null;

        return {
          title: d.title,
          author: d.author,
          upvotes: d.ups,
          url: "https://www.reddit.com" + d.permalink,
          image: img,
          created_at: new Date(d.created_utc * 1000),
        };
      })
      .filter(item => item.image);

    rspo.json({formatted});

  } catch (err) {
    console.log("Reddit fetch error:", err.message);
    rspo.status(500).json({ error: "Failed to fetch Reddit data" });
  } finally {
    completeRequest(crntIP, crntAPI);
  }
};
