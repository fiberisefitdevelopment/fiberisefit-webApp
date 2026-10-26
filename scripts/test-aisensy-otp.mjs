import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
const apiKey = env.match(/^AISENSY_API_KEY=(.+)$/m)?.[1]?.trim()
if (!apiKey) {
  console.error('AISENSY_API_KEY is missing from .env')
  process.exit(1)
}

const destination = (process.argv[2] || '919118885590').replace(/\D/g, '')
if (destination.length < 12) {
  console.error('Pass the destination with country code, for example 919118885590')
  process.exit(1)
}

const code = String(Math.floor(100000 + Math.random() * 900000))

const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey,
    campaignName: 'fiberise_login_otp',
    destination,
    userName: 'Fiberise Fit Private Limited',
    templateParams: [code],
    source: 'otp-test',
    media: {},
    buttons: [
      {
        type: 'button',
        sub_type: 'url',
        index: 0,
        parameters: [{ type: 'text', text: code }],
      },
    ],
    carouselCards: [],
    location: {},
    attributes: {},
    paramsFallbackValue: { FirstName: code },
  }),
})

const body = await response.text()
console.log('OTP sent for comparison:', code)
console.log('HTTP', response.status)
console.log(body)
process.exit(response.ok ? 0 : 1)
