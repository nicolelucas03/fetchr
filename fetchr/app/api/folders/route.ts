
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Get the user's session (with access token)
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ folders: [], error: "Not authenticated" }, { status: 401 });
  }

  // Fetch folders from Google Drive API
  try {
    const res = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder'&fields=files(id%2Cname)",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch folders from Google Drive");
    }
    const data = await res.json();
    return NextResponse.json({ folders: data.files || [] });
  } catch (error) {
    return NextResponse.json({ folders: [], error: (error as Error).message }, { status: 500 });
  }
}