/**
 * Export all Shopify orders to a multi-sheet Excel workbook.
 * Run: node scripts/export-order-details.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(
  process.env.HOME || '/Users/nadeemakhtar',
  'Desktop/FiberiseFit_Order_Details.xlsx'
)

function loadEnv(key) {
  const text = readFileSync(resolve(ROOT, '.env'), 'utf8')
  const match = text.match(new RegExp(`^${key}=(.*)$`, 'm'))
  if (!match) return ''
  let value = match[1].trim()
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1)
  }
  return value
}

const TOKEN = loadEnv('SHOPIFY_ADMIN_ACCESS_TOKEN')
const DOMAIN = loadEnv('NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN')
const VERSION = loadEnv('NEXT_PUBLIC_SHOPIFY_API_VERSION') || '2024-01'
const GQL_URL = `https://${DOMAIN}/admin/api/${VERSION}/graphql.json`

const PAGE_SIZE = 80
const IST = 'Asia/Kolkata'

const QUERY = `
query OrdersExport($first: Int!, $after: String) {
  orders(first: $first, query: "status:any", sortKey: CREATED_AT, reverse: true, after: $after) {
    edges {
      node {
        id
        name
        createdAt
        cancelledAt
        email
        phone
        sourceName
        displayFinancialStatus
        displayFulfillmentStatus
        tags
        note
        paymentGatewayNames
        fullyPaid
        customAttributes { key value }
        discountCodes
        totalDiscountsSet { shopMoney { amount currencyCode } }
        subtotalPriceSet { shopMoney { amount currencyCode } }
        totalPriceSet { shopMoney { amount currencyCode } }
        currentTotalPriceSet { shopMoney { amount currencyCode } }
        totalShippingPriceSet { shopMoney { amount currencyCode } }
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        shippingAddress {
          firstName
          lastName
          name
          address1
          address2
          city
          province
          provinceCode
          zip
          country
          countryCodeV2
          phone
        }
        billingAddress {
          firstName
          lastName
          name
          city
          province
          zip
          country
          phone
        }
        lineItems(first: 50) {
          edges {
            node {
              title
              sku
              quantity
              variantTitle
              originalUnitPriceSet { shopMoney { amount } }
              discountedUnitPriceSet { shopMoney { amount } }
              originalTotalSet { shopMoney { amount } }
              discountedTotalSet { shopMoney { amount } }
              variant {
                sku
                price
                compareAtPrice
                product { title handle productType }
              }
            }
          }
        }
        transactions {
          gateway
          kind
          status
          formattedGateway
        }
        customerJourneySummary {
          ready
          firstVisit {
            landingPage
            referrerUrl
            source
            sourceType
            occurredAt
            utmParameters { campaign content medium source term }
          }
          lastVisit {
            landingPage
            referrerUrl
            source
            sourceType
            occurredAt
            utmParameters { campaign content medium source term }
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
`

const STATE_ZONE = {
  'andhra pradesh': 'South',
  telangana: 'South',
  karnataka: 'South',
  kerala: 'South',
  'tamil nadu': 'South',
  puducherry: 'South',
  pondicherry: 'South',
  lakshadweep: 'South',
  'andaman and nicobar islands': 'South',
  goa: 'West',
  gujarat: 'West',
  maharashtra: 'West',
  'dadra and nagar haveli': 'West',
  'dadra and nagar haveli and daman and diu': 'West',
  'daman and diu': 'West',
  rajasthan: 'North',
  delhi: 'North',
  'new delhi': 'North',
  haryana: 'North',
  punjab: 'North',
  'himachal pradesh': 'North',
  'jammu and kashmir': 'North',
  ladakh: 'North',
  chandigarh: 'North',
  uttarakhand: 'North',
  'uttar pradesh': 'North',
  'madhya pradesh': 'Central',
  chhattisgarh: 'Central',
  'west bengal': 'East',
  odisha: 'East',
  orissa: 'East',
  bihar: 'East',
  jharkhand: 'East',
  assam: 'Northeast',
  'arunachal pradesh': 'Northeast',
  manipur: 'Northeast',
  meghalaya: 'Northeast',
  mizoram: 'Northeast',
  nagaland: 'Northeast',
  sikkim: 'Northeast',
  tripura: 'Northeast',
}

const NCR_CITIES = new Set(
  [
    'delhi',
    'new delhi',
    'gurgaon',
    'gurugram',
    'noida',
    'greater noida',
    'ghaziabad',
    'faridabad',
    'sonipat',
    'sonepat',
    'meerut',
    'bahadurgarh',
    'greater noida west',
  ].map((s) => s.toLowerCase())
)

const FEMALE_NAMES = new Set(
  `
aadhya aalia aaliya aanya aaradhya aarti aashi aastha aditi aishwarya akanksha
akshara alka amrita ananya anisha anita anjali anjana anju ankita anu anuja
anum anuradha anushka anushri aparna archana arpita aruna asha ashwini avani
bhavana bhavna bhumi bindu chandni charu chetna deepa deepika deepti divya
diya drishti ekta falguni farah fatima gargi gauri gayatri geeta geetha gita
grishma hansika harini harshita heena hema himani hina indira ishita jagruti
janhavi jaya jayashree jyoti kajal kalpana kamala kanchan kanika karishma
kavita kavya khushi kirti komal krishnaa kriti kritika kushi lakshmi lalita
lata lavanya leela lekha madhavi madhu madhuri mahasweta mahima maitri
mallika manasi manisha manju meena meenakshi meera megha meghana minakshi
minal misha mohini monica mounika mousumi mukta namrata nandini nandita
naina nancy naisha nargis naseem neelam neha nidhi nikki nirmala nisha nita
nitya palak pallavi pampa parul payal pooja poonam prachi pranita pratibha
preeti prema priya priyanka puja rachna radha radhika rajani rajeswari rakhi
ramya rani rashmi raveena reena rekha renu reshma revathi richa riddhi rina
ritika ritu riya rohini roshni ruchika ruchita rumana rumani rupa sabiha
sadhna sakshi saloni samiksha sangeeta sania sanjana sapna sarika sarita
savitri seema shalini shamita shanti sharmila shashi sheela shilpa shivani
shraddha shreya shruti shweta simran sindhu smita smriti sneha snehal snigdha
sonia sonali sonam sonia soumya sridevi srishti suchitra sudha sujata sukanya
suman sumitra sunanda sunita surbhi sushma swara swati tanu tanushree tanvi
tapasya taruna tejaswini trisha trupti tulsi uma urvashi usha vaishali
vaishnavi vandana vani varsha vasudha veena vidya vijaya vimala vineeta
vrinda yamini yasmin zoya
`.match(/[a-z]+/g)
)

const MALE_NAMES = new Set(
  `
aarav aashish abhay abhijit abhishek aditya ajay ajit akash akhil akshay
alok amal amar amit amol amrish anand anil anirudh ankit ankush anshul
anuj anup anurag aravind arjun arun ashish ashok ashwani atul avinash
balaji bharat bhaskar bhavin bhushan bilal chandan chetan chirag darshan
deepak dev dhananjay dharmesh dhruv dilip dinesh dipak gaurav gautam
girish gopal gopi govind harish harsh harshad himanshu hitesh imran
indrajit ishaan jagdish jatin javed jay jayant jayesh jeevan jitendra
kailash kalyan kamal karan kartik kaustubh kiran kishore krishna kuldeep
kunal lakshman lalit lokesh mahesh manan manish manoj mayank milind
mohammad mohammed mohit mukesh mukul naman nanda nandan naresh naveen
navin neeraj nikhil nilesh niranjan nirmal nishant nitin omkar pankaj
parag paresh parth pawan piyush pradeep pramod pranav prashant pratap
prateek praveen prem puneet rahul raj rajan rajeev rajesh rakesh ram
ramesh ranjit ravi ravindra rishi ritik rohan rohit ronak sachin sagar
sahil sameer sandeep sanjay sanjeev sarthak satish saurabh savan shahid
shankar shantanu sharad shashank shiv shiva shivam shravan shubham
siddharth somesh sridhar srinivas subhash sudhir sumit suresh sushil
swapnil syed tanmay tarun tej tejas umesh utkarsh vaibhav varun vedant
vijay vikas vikram vinay vinod vipul viraj vishal vishnu vivek yash
yashwant yogesh zahid
`.match(/[a-z]+/g)
)

const FEMALE_PREFIX = /\b(mrs|smt|ms|miss|kumari|madam|begum)\b/i
const MALE_PREFIX = /\b(mr|shri|sri|sir)\b/i

function money(set) {
  const amount = Number(set?.shopMoney?.amount || 0)
  return Number.isFinite(amount) ? amount : 0
}

function num(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function clean(value) {
  if (value == null) return ''
  return String(value).replace(/\s+/g, ' ').trim()
}

function digits(value) {
  return clean(value).replace(/\D/g, '')
}

function toIst(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

function pct(part, whole) {
  if (!whole) return 0
  return Number(((part / whole) * 100).toFixed(2))
}

function inferGender(name) {
  const raw = clean(name)
  if (!raw) return 'Unknown'
  if (FEMALE_PREFIX.test(raw)) return 'Female'
  if (MALE_PREFIX.test(raw)) return 'Male'
  const first = raw
    .split(/[\s.]+/)
    .find((part) => part && !/^(mr|mrs|ms|miss|smt|shri|sri|dr|prof)$/i.test(part))
  if (!first) return 'Unknown'
  const key = first.toLowerCase()
  if (FEMALE_NAMES.has(key)) return 'Female'
  if (MALE_NAMES.has(key)) return 'Male'
  return 'Unknown'
}

function zoneForState(state) {
  const key = clean(state).toLowerCase()
  return STATE_ZONE[key] || (key ? 'Other / International' : 'Unknown')
}

function regionFor(state, city) {
  const stateKey = clean(state).toLowerCase()
  const cityKey = clean(city).toLowerCase()
  if (stateKey === 'delhi' || stateKey === 'new delhi' || NCR_CITIES.has(cityKey)) {
    return 'NCR'
  }
  const zone = zoneForState(state)
  if (zone === 'North') return 'North (ex-NCR)'
  if (zone === 'South') return 'South India'
  if (zone === 'West') return 'West India'
  if (zone === 'East') return 'East India'
  if (zone === 'Central') return 'Central India'
  if (zone === 'Northeast') return 'Northeast India'
  if (zone === 'Other / International') return clean(state) || 'International'
  return 'Unknown'
}

function paymentMethod(gateways) {
  const text = (gateways || []).join(' ').toLowerCase()
  if (!text) return 'Unknown'
  if (text.includes('cash on delivery') || /\bcod\b/.test(text)) return 'COD'
  return 'Prepaid'
}

function utmFromVisit(visit) {
  const params = visit?.utmParameters || {}
  return {
    source: clean(params.source),
    medium: clean(params.medium),
    campaign: clean(params.campaign),
    content: clean(params.content),
    term: clean(params.term),
    landingPage: clean(visit?.landingPage),
    referrerUrl: clean(visit?.referrerUrl),
    journeySource: clean(visit?.source),
  }
}

function utmStatus(utm) {
  if (utm.source || utm.medium || utm.campaign) return 'Has UTM'
  if (utm.referrerUrl || utm.landingPage || utm.journeySource) return 'No UTM (referrer only)'
  return 'No UTM / Unknown'
}

function skuKey(item) {
  return (
    clean(item.sku) ||
    clean(item.variant?.sku) ||
    clean(item.variant?.product?.handle) ||
    clean(item.variant?.product?.title) ||
    clean(item.title) ||
    'unknown'
  )
}

function skuName(item) {
  return clean(item.variant?.product?.title) || clean(item.title) || skuKey(item)
}

function bump(map, key, fields) {
  const current = map.get(key) || { key, orders: 0, qty: 0, revenue: 0, mrp: 0, selling: 0, discount: 0 }
  for (const [field, value] of Object.entries(fields)) {
    current[field] = (current[field] || 0) + value
  }
  map.set(key, current)
}

async function shopifyQuery(variables, attempt = 1) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query: QUERY, variables }),
  })
  const json = await res.json()
  if (res.status === 429 || json.errors?.some((e) => /throttl/i.test(e.message || ''))) {
    if (attempt >= 6) throw new Error('Shopify rate limit persisted')
    const wait = 1500 * attempt
    console.log(`Rate limited, retrying in ${wait}ms...`)
    await new Promise((r) => setTimeout(r, wait))
    return shopifyQuery(variables, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }
  return json.data
}

function autoWidth(rows) {
  if (!rows.length) return []
  const keys = Object.keys(rows[0])
  return keys.map((key) => ({
    wch: Math.min(
      48,
      Math.max(
        key.length + 2,
        ...rows.slice(0, 200).map((row) => String(row[key] ?? '').length + 1)
      )
    ),
  }))
}

function addSheet(wb, name, rows) {
  const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: 'No rows' }])
  sheet['!cols'] = autoWidth(rows.length ? rows : [{ Note: 'No rows' }])
  XLSX.utils.book_append_sheet(wb, sheet, name.slice(0, 31))
}

async function fetchAllOrders() {
  const orders = []
  let after = null
  let page = 0
  while (true) {
    page += 1
    const data = await shopifyQuery({ first: PAGE_SIZE, after })
    const edges = data.orders.edges || []
    orders.push(...edges.map((edge) => edge.node))
    console.log(`Fetched page ${page}: ${edges.length} orders (total ${orders.length})`)
    if (!data.orders.pageInfo.hasNextPage || !data.orders.pageInfo.endCursor || !edges.length) {
      break
    }
    after = data.orders.pageInfo.endCursor
    await new Promise((r) => setTimeout(r, 200))
  }
  return orders
}

function transform(rawOrders) {
  const orderRows = []
  const itemRows = []
  const stateMap = new Map()
  const zoneMap = new Map()
  const regionMap = new Map()
  const pinMap = new Map()
  const payMap = new Map()
  const genderMap = new Map()
  const skuMap = new Map()
  const utmMap = new Map()
  const utmSourceMap = new Map()

  for (const order of rawOrders) {
    const ship = order.shippingAddress || {}
    const bill = order.billingAddress || {}
    const customer = order.customer || {}
    const firstName = clean(customer.firstName || ship.firstName)
    const lastName = clean(customer.lastName || ship.lastName)
    const fullName = clean(ship.name) || [firstName, lastName].filter(Boolean).join(' ')
    const city = clean(ship.city)
    const state = clean(ship.province)
    const pincode = clean(ship.zip)
    const country = clean(ship.country)
    const zone = zoneForState(state)
    const region = regionFor(state, city)
    const method = paymentMethod(order.paymentGatewayNames)
    const gender = inferGender(fullName || firstName)
    const items = (order.lineItems?.edges || []).map((edge) => edge.node)
    const lastUtm = utmFromVisit(order.customerJourneySummary?.lastVisit)
    const firstUtm = utmFromVisit(order.customerJourneySummary?.firstVisit)
    const utm = lastUtm.source || lastUtm.medium || lastUtm.campaign ? lastUtm : firstUtm
    const statusUtm = utmStatus(utm)
    const cancelled = Boolean(order.cancelledAt)
    const subtotal = money(order.subtotalPriceSet)
    const shipping = money(order.totalShippingPriceSet)
    const orderDiscount = money(order.totalDiscountsSet)
    const total = money(order.totalPriceSet)
    const currentTotal = money(order.currentTotalPriceSet)
    const currency = order.totalPriceSet?.shopMoney?.currencyCode || 'INR'

    let mrpTotal = 0
    let sellingTotal = 0
    const skuTitles = []

    for (const item of items) {
      const qty = num(item.quantity)
      const unitSelling = money(item.discountedUnitPriceSet) || money(item.originalUnitPriceSet)
      const unitMrp = num(item.variant?.compareAtPrice) || unitSelling
      const lineSelling = money(item.discountedTotalSet) || unitSelling * qty
      const lineMrp = unitMrp * qty
      const lineDiscount = Math.max(0, lineMrp - lineSelling)
      const sku = skuKey(item)
      const product = skuName(item)
      mrpTotal += lineMrp
      sellingTotal += lineSelling
      skuTitles.push(`${product} x${qty}`)

      itemRows.push({
        'Order Number': order.name,
        'Order Date (IST)': toIst(order.createdAt),
        SKU: sku,
        Product: product,
        'Variant Title': clean(item.variantTitle),
        Quantity: qty,
        'MRP (unit)': unitMrp,
        'Selling Price (unit)': unitSelling,
        'Discount (unit)': Math.max(0, unitMrp - unitSelling),
        'Discount %': pct(Math.max(0, unitMrp - unitSelling), unitMrp),
        'Line MRP': lineMrp,
        'Line Selling': lineSelling,
        'Line Discount': lineDiscount,
        State: state,
        Zone: zone,
        Region: region,
        Pincode: pincode,
        'Payment Method': method,
        'Inferred Gender': gender,
        Cancelled: cancelled ? 'Yes' : 'No',
      })

      bump(skuMap, sku, {
        orders: 1,
        qty,
        revenue: lineSelling,
        mrp: lineMrp,
        selling: lineSelling,
        discount: lineDiscount,
      })
      skuMap.get(sku).product = product
    }

    const listedDiscount = Math.max(0, mrpTotal - sellingTotal)
    orderRows.push({
      'Order Number': order.name,
      'Order Date (IST)': toIst(order.createdAt),
      'Order Date UTC': order.createdAt,
      'Customer Name': fullName,
      'First Name': firstName,
      'Last Name': lastName,
      'Inferred Gender': gender,
      Email: clean(order.email || customer.email),
      Phone: clean(order.phone || ship.phone || customer.phone),
      'Address Line 1': clean(ship.address1),
      'Address Line 2': clean(ship.address2),
      City: city,
      State: state,
      'State Code': clean(ship.provinceCode),
      Zone: zone,
      Region: region,
      Pincode: pincode,
      Country: country,
      'Payment Method': method,
      Gateway: (order.paymentGatewayNames || []).join(', '),
      'Financial Status': clean(order.displayFinancialStatus),
      'Fulfillment Status': clean(order.displayFulfillmentStatus),
      Cancelled: cancelled ? 'Yes' : 'No',
      'Cancelled At (IST)': toIst(order.cancelledAt),
      Currency: currency,
      'Items MRP': Number(mrpTotal.toFixed(2)),
      'Items Selling Price': Number(sellingTotal.toFixed(2)),
      'Listed Discount (MRP - Selling)': Number(listedDiscount.toFixed(2)),
      'Listed Discount %': pct(listedDiscount, mrpTotal),
      'Order Discount Codes': (order.discountCodes || []).join(', '),
      'Checkout Discount Amount': orderDiscount,
      Subtotal: subtotal,
      Shipping: shipping,
      'Order Total': total,
      'Current Total': currentTotal,
      Products: skuTitles.join(' | '),
      'UTM Status': statusUtm,
      'UTM Source': utm.source,
      'UTM Medium': utm.medium,
      'UTM Campaign': utm.campaign,
      'UTM Content': utm.content,
      'UTM Term': utm.term,
      Referrer: utm.referrerUrl,
      'Landing Page': utm.landingPage,
      'Journey Ready': order.customerJourneySummary?.ready ? 'Yes' : 'No',
      Tags: Array.isArray(order.tags) ? order.tags.join(', ') : clean(order.tags),
      Note: clean(order.note),
    })

    const geoFields = {
      orders: 1,
      revenue: total,
      prepaid: method === 'Prepaid' ? 1 : 0,
      cod: method === 'COD' ? 1 : 0,
      female: gender === 'Female' ? 1 : 0,
      male: gender === 'Male' ? 1 : 0,
    }
    bump(stateMap, state || 'Unknown', geoFields)
    bump(zoneMap, zone, geoFields)
    bump(regionMap, region, geoFields)
    bump(pinMap, `${pincode || 'Unknown'}|${city || ''}|${state || ''}`, {
      ...geoFields,
    })
    pinMap.get(`${pincode || 'Unknown'}|${city || ''}|${state || ''}`).pincode = pincode || 'Unknown'
    pinMap.get(`${pincode || 'Unknown'}|${city || ''}|${state || ''}`).city = city
    pinMap.get(`${pincode || 'Unknown'}|${city || ''}|${state || ''}`).state = state

    bump(payMap, method, { orders: 1, revenue: total, qty: items.reduce((s, i) => s + num(i.quantity), 0) })
    bump(genderMap, gender, { orders: 1, revenue: total })
    bump(utmMap, statusUtm, { orders: 1, revenue: total })
    bump(utmSourceMap, utm.source || '(none)', { orders: 1, revenue: total })
  }

  const totalOrders = orderRows.length
  const totalRevenue = orderRows.reduce((sum, row) => sum + Number(row['Order Total'] || 0), 0)
  const totalQty = itemRows.reduce((sum, row) => sum + Number(row.Quantity || 0), 0)

  const summarize = (map, nameKey) =>
    [...map.values()]
      .sort((a, b) => b.orders - a.orders)
      .map((row) => ({
        [nameKey]: row.product || row.pincode || row.key,
        ...(row.city != null ? { City: row.city, State: row.state } : {}),
        Orders: row.orders,
        'Order %': pct(row.orders, totalOrders),
        ...(row.qty != null ? { Quantity: row.qty, 'Qty %': pct(row.qty, totalQty) } : {}),
        Revenue: Number((row.revenue || 0).toFixed(2)),
        'Revenue %': pct(row.revenue || 0, totalRevenue),
        ...(row.prepaid != null
          ? {
              Prepaid: row.prepaid,
              COD: row.cod,
              Male: row.male,
              Female: row.female,
            }
          : {}),
        ...(row.mrp != null
          ? {
              MRP: Number(row.mrp.toFixed(2)),
              Selling: Number(row.selling.toFixed(2)),
              Discount: Number(row.discount.toFixed(2)),
              'Avg Discount %': pct(row.discount, row.mrp),
            }
          : {}),
      }))

  return {
    orderRows: orderRows.sort((a, b) => String(a['Order Date UTC']).localeCompare(String(b['Order Date UTC']))),
    itemRows: itemRows.sort((a, b) => String(a['Order Date (IST)']).localeCompare(String(b['Order Date (IST)']))),
    states: summarize(stateMap, 'State'),
    zones: summarize(zoneMap, 'Zone'),
    regions: summarize(regionMap, 'Region'),
    pincodes: summarize(pinMap, 'Pincode'),
    payments: summarize(payMap, 'Payment Method'),
    genders: summarize(genderMap, 'Inferred Gender'),
    skus: summarize(skuMap, 'SKU'),
    utmStatus: summarize(utmMap, 'UTM Status'),
    utmSources: summarize(utmSourceMap, 'UTM Source'),
    totalOrders,
    totalRevenue,
    totalQty,
  }
}

function summaryRows(data, firstDate, lastDate) {
  const prepaid = data.payments.find((row) => row['Payment Method'] === 'Prepaid')
  const cod = data.payments.find((row) => row['Payment Method'] === 'COD')
  const female = data.genders.find((row) => row['Inferred Gender'] === 'Female')
  const male = data.genders.find((row) => row['Inferred Gender'] === 'Male')
  const unknown = data.genders.find((row) => row['Inferred Gender'] === 'Unknown')
  const hasUtm = data.utmStatus.find((row) => row['UTM Status'] === 'Has UTM')
  return [
    { Metric: 'Source', Value: `Shopify Admin API (${DOMAIN})` },
    { Metric: 'Generated at (IST)', Value: toIst(new Date().toISOString()) },
    { Metric: 'First order (IST)', Value: firstDate },
    { Metric: 'Latest order (IST)', Value: lastDate },
    { Metric: 'Total orders', Value: data.totalOrders },
    { Metric: 'Total order value (INR)', Value: Number(data.totalRevenue.toFixed(2)) },
    { Metric: 'Total item quantity', Value: data.totalQty },
    { Metric: 'Prepaid orders', Value: prepaid?.Orders || 0 },
    { Metric: 'Prepaid %', Value: prepaid?.['Order %'] || 0 },
    { Metric: 'COD orders', Value: cod?.Orders || 0 },
    { Metric: 'COD %', Value: cod?.['Order %'] || 0 },
    { Metric: 'Inferred female orders', Value: female?.Orders || 0 },
    { Metric: 'Inferred female %', Value: female?.['Order %'] || 0 },
    { Metric: 'Inferred male orders', Value: male?.Orders || 0 },
    { Metric: 'Inferred male %', Value: male?.['Order %'] || 0 },
    { Metric: 'Unknown gender orders', Value: unknown?.Orders || 0 },
    { Metric: 'Orders with UTM', Value: hasUtm?.Orders || 0 },
    { Metric: 'Orders with UTM %', Value: hasUtm?.['Order %'] || 0 },
    {
      Metric: 'Notes',
      Value:
        'Gender is inferred from first names (Shopify does not store gender). SKU uses Shopify SKU when present, otherwise product handle. UTM is from Shopify customer journey last visit, falling back to first visit. Includes cancelled orders.',
    },
  ]
}

async function main() {
  if (!TOKEN || !DOMAIN) {
    throw new Error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN or shop domain in .env')
  }
  console.log(`Fetching all orders from ${DOMAIN}...`)
  const raw = await fetchAllOrders()
  console.log(`Transforming ${raw.length} orders...`)
  const data = transform(raw)
  const first = data.orderRows[0]
  const last = data.orderRows[data.orderRows.length - 1]
  const wb = XLSX.utils.book_new()
  addSheet(wb, 'Summary', summaryRows(data, first?.['Order Date (IST)'] || '', last?.['Order Date (IST)'] || ''))
  addSheet(wb, 'Orders', data.orderRows)
  addSheet(wb, 'Line Items', data.itemRows)
  addSheet(wb, 'States', data.states)
  addSheet(wb, 'Zones', data.zones)
  addSheet(wb, 'Regions', data.regions)
  addSheet(wb, 'Pincodes', data.pincodes)
  addSheet(wb, 'Payment Method', data.payments)
  addSheet(wb, 'Audience Gender', data.genders)
  addSheet(wb, 'Product SKU Mix', data.skus)
  addSheet(wb, 'UTM Status', data.utmStatus)
  addSheet(wb, 'UTM Sources', data.utmSources)
  writeFileSync(OUTPUT, XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }))
  console.log(`Wrote ${OUTPUT}`)
  console.log(`Orders: ${data.totalOrders} | Revenue: ${data.totalRevenue.toFixed(2)} | SKUs: ${data.skus.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
