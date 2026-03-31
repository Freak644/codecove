
export const timeOut = (req, res, next) => {
  const controller = new AbortController();
  req.abortController = controller;

  const TIMEOUT = 60_000; // 60 seconds 

  const timer = setTimeout(() => {
    controller.abort();

    if (!res.headersSent) {
      res.status(408).json({ error: "Request Timeout" });
    }
  }, TIMEOUT);

  // Clear timer when response finishes normally
  res.on("finish", () => {
    clearTimeout(timer);
  });

  // Clear timer if client aborts early
  req.on("aborted", () => {
    controller.abort();
    clearTimeout(timer);
  });

  next();
}