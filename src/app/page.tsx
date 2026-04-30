'use client'
'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Folder {
  id: string
  name: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    if (session) {
      fetch('/api/folders')
        .then(r => r.json())
        .then((d: { folders?: Folder[] }) => setFolders(d.folders || []))
    }
  }, [session])

  if (status === 'loading') return <p className="p-8">Loading...</p>

  if (!session) return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-2">Image Library</h1>
        <p className="text-gray-500 mb-6">Sign in with Google to connect your Drive folders</p>
        <button
          onClick={() => signIn('google')}
          className="px-6 py-2 bg-black text-white rounded-lg text-sm"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  )

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">Image Library</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{session.user?.email}</span>
          <button onClick={() => signOut()} className="text-sm text-gray-400">Sign out</button>
        </div>
      </div>

      <h2 className="text-sm font-medium text-gray-500 mb-3">Your Drive folders</h2>
      <div className="space-y-2">
        {folders.map(folder => (
          <div key={folder.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm">{folder.name}</span>
            <button className="text-xs text-purple-600 font-medium">Connect →</button>
          </div>
        ))}
      </div>
    </main>
  )
}