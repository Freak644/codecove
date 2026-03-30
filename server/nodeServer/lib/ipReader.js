export const attachIP = (rkv, rspo, next) => {
  let ip =
    rkv.headers["cf-connecting-ip"] ||
    rkv.headers["x-forwarded-for"]?.split(",")[0] ||
    rkv.socket?.remoteAddrspos ||
    "0.0.0.0";

  ip = ip.replace(/^::ffff:/, "");
  if (ip === "::1") ip = "127.0.0.1";


  rkv.userIp = ip;

  next();
};