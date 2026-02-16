import express from 'express'
import dns from 'dns/promises'
import https from 'https'
import os from 'os'

const router = express.Router();

router.get("/health", async (req, res) => {
  const report = {
    serverTime: new Date(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    network: {},
    cloudinary: {},
  };

  try {
    // 🔎 1️⃣ DNS Check
    const dnsLookup = await dns.lookup("api.cloudinary.com");
    report.network.dnsResolved = true;
    report.network.cloudinaryIP = dnsLookup.address;
  } catch (err) {
    report.network.dnsResolved = false;
    report.network.dnsError = err.message;
  }

  // 🌍 2️⃣ External Connectivity Check
  await new Promise((resolve) => {
    const req = https.get("https://api.cloudinary.com", (resp) => {
      report.network.internetReachable = true;
      report.network.statusCode = resp.statusCode;
      resolve();
    });

    req.on("error", (err) => {
      report.network.internetReachable = false;
      report.network.internetError = err.message;
      resolve();
    });

    req.setTimeout(5000, () => {
      report.network.internetReachable = false;
      report.network.internetError = "Timeout";
      req.destroy();
      resolve();
    });
  });

  // 🧠 3️⃣ System Info
  report.system = {
    platform: os.platform(),
    cpuCores: os.cpus().length,
    freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
    totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
  };
  console.log(report)
  res.send({report})
});

export default router
