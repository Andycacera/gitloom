import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyGithubSignature(rawBody, secret, signatureHeader) {
  const [algo, signature] = (signatureHeader || "").split("=");
  if (algo !== "sha256" || !signature) return false;

  const hmac = createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");

  const sigBuf = Buffer.from(signature, "hex");
  const digBuf = Buffer.from(digest, "hex");

  if (sigBuf.length !== digBuf.length) return false;

  return timingSafeEqual(sigBuf, digBuf);
}
