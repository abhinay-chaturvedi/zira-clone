import { AUTH_COOKIE } from "@/features/auth/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const json = await req.json();
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE,
    value: json.secret,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 30,
    secure: true,
  });
  console.log(json);
  return NextResponse.json(json, { status: 200 });
};
export const DELETE = async () => {
  await cookies().delete(AUTH_COOKIE);
  return NextResponse.json({ message: "deleted cookie" }, { status: 200 });
};
