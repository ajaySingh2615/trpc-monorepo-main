import type { Request, Response } from "express";

const COOKIE_NAME = "auth_token";

export function setAuthenticationCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

export function getAuthenticationCookie(req: Request) {
  return req.cookies?.[COOKIE_NAME] ?? null;
}

export function clearAuthenticationCookie(res: Response) {
  res.clearCookie(COOKIE_NAME);
}
