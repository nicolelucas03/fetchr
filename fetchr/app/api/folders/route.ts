import { getServerSession } from 'next-auth'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET() {
  const session = await getServerSession()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: session.accessToken })
  const drive = google.drive({ version: 'v3', auth })

  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields: 'files(id, name, parents)',
    pageSize: 50,
  })

  return NextResponse.json({ folders: res.data.files })
}