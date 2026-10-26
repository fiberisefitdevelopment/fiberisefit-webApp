import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type PostOffice = {
  District?: string
  State?: string
  Division?: string
  Region?: string
  Block?: string
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ pin: string }> }
) {
  const { pin } = await context.params
  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: 'Enter a 6-digit PIN code.' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      next: { revalidate: 60 * 60 * 24 },
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Could not look up this PIN code.' }, { status: 502 })
    }
    const payload = (await response.json()) as Array<{
      Status?: string
      PostOffice?: PostOffice[] | null
    }>
    const offices = payload?.[0]?.Status === 'Success' ? payload[0].PostOffice || [] : []
    const office = offices[0]
    if (!office?.State) {
      return NextResponse.json({ error: 'No city found for this PIN code.' }, { status: 404 })
    }

    const district = office.District && office.District !== 'NA' ? office.District : ''
    const division = office.Division && office.Division !== 'NA' ? office.Division : ''
    const region = office.Region && office.Region !== 'NA' ? office.Region : ''

    return NextResponse.json({
      city: district || division || region,
      state: office.State,
      country: 'India',
    })
  } catch {
    return NextResponse.json({ error: 'Could not look up this PIN code.' }, { status: 502 })
  }
}
