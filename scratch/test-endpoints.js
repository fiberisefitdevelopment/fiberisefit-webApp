const http = require('http')

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const postData = JSON.stringify(data)

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }

    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        })
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    req.write(postData)
    req.end()
  })
}

async function runTests() {
  console.log('🧪 Starting endpoint verification tests...\n')
  const baseUrl = 'http://localhost:3000'

  // Test 1: Verify /api/analytics/campaign-event
  try {
    console.log('Test 1: Logging campaign visit event...')
    const res = await postJson(`${baseUrl}/api/analytics/campaign-event`, {
      slug: 'june-transform',
      eventType: 'visit',
    })
    console.log(`Response Status: ${res.statusCode}`)
    console.log(`Response Body: ${res.body}`)
    if (res.statusCode === 200) {
      console.log('✅ Test 1 Passed!\n')
    } else {
      console.log('❌ Test 1 Failed!\n')
    }
  } catch (err) {
    console.error('❌ Test 1 Error:', err.message, '\n')
  }

  // Test 2: Verify /api/checkout/create with an expired/invalid campaign
  try {
    console.log('Test 2: Creating checkout with expired campaign...')
    const res = await postJson(`${baseUrl}/api/checkout/create`, {
      items: [{ id: 'gid://shopify/ProductVariant/12345', quantity: 1 }],
      campaignSlug: 'expired-or-invalid-slug',
    })
    console.log(`Response Status: ${res.statusCode}`)
    console.log(`Response Body: ${res.body}`)
    if (res.statusCode === 400 && res.body.includes('expired')) {
      console.log('✅ Test 2 Passed! (Correctly rejected expired campaign)\n')
    } else {
      console.log('❌ Test 2 Failed!\n')
    }
  } catch (err) {
    console.error('❌ Test 2 Error:', err.message, '\n')
  }

  // Test 3: Verify Shopify Order Webhook
  try {
    console.log('Test 3: Sending mock Shopify order webhook...')
    const res = await postJson(`${baseUrl}/api/webhooks/shopify/orders`, {
      id: 99887766,
      subtotal_price: '1999.00',
      note_attributes: [
        {
          name: 'campaign_slug',
          value: 'june-transform',
        },
      ],
    })
    console.log(`Response Status: ${res.statusCode}`)
    console.log(`Response Body: ${res.body}`)
    if (res.statusCode === 200) {
      console.log('✅ Test 3 Passed!\n')
    } else {
      console.log('❌ Test 3 Failed!\n')
    }
  } catch (err) {
    console.error('❌ Test 3 Error:', err.message, '\n')
  }
}

// Wait for a second and start tests
setTimeout(runTests, 1000)
