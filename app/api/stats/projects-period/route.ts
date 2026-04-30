import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/app/lib/api'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams.toString()
  const res    = await fetchWithAuth(`/admin/stats/projects-period?${params}`)
  const json   = await res.json()
  return NextResponse.json(json, { status: res.status })
}
