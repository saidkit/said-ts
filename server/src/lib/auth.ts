// JWT sign/verify helpers (jose)
import { SignJWT, jwtVerify } from "jose";

export interface TokenPayload {
  sub: string;
  email: string;
  [key: string]: unknown;
}

function getSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signToken(
  payload: TokenPayload,
  secret: string,
  expiresIn = "24h",
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret(secret));
}

export async function verifyToken(token: string, secret: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret(secret));
  return payload as TokenPayload;
}
