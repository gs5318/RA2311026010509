import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = request.headers.get("authorization");

  const params = new URLSearchParams();
  if (searchParams.get("limit")) params.set("limit", searchParams.get("limit"));
  if (searchParams.get("notification_type"))
    params.set("notification_type", searchParams.get("notification_type"));

  const url = `http://20.207.122.201/evaluation-service/notifications?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    console.log("API RESPONSE:", JSON.stringify(data));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}