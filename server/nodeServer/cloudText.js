import https from "https";

const url = "https://api.cloudinary.com/v1_1/dcve50avm/image/upload";

https.get(url, res => {
  console.log("STATUS", res.statusCode);
  console.log("HEADERS", res.headers);
  res.on("data", () => {});
  res.on("end", () => console.log("END"));
}).on("error", err => {
  console.log("NODE ERR full:", {
    message: err.message,
    code: err.code,
    errno: err.errno,
    syscall: err.syscall,
    stack: err.stack
  });
});
