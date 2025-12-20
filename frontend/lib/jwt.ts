// lib/jwt.ts
export interface DecodedToken {
  sub: string
  role: "ADMIN" | "STAFF"
  exp: number
}

export function decodeJwt(token: string): DecodedToken {
  const payload = token.split(".")[1]
  return JSON.parse(Buffer.from(payload, "base64").toString())
}
