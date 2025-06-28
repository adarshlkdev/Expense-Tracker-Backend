import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }
  } catch (err) {
    console.error("Rate limiter error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
  next();
};

export default rateLimiter;
