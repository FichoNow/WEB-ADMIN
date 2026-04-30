import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/app/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params
  const qs   = request.nextUrl.searchParams.toString()
  const res  = await fetchWithAuth(`/admin/stats/user/${userId}?${qs}`)
  const json = await res.json()
  return NextResponse.json(json, { status: res.status })
}
