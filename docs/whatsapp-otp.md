# WhatsApp OTP setup (AiSensy) as an add-on to SMS OTP

SMS OTP stays as it is. It is sent by Firebase Phone Auth from:

- Login: `app/account/login/page.tsx`
- Checkout: `components/CheckoutOtpModal.tsx`

WhatsApp OTP is a second way to receive the same 6-digit code. The customer chooses **SMS** or **WhatsApp** on the phone step. Both paths end in the same logged-in session.

AiSensy only delivers the WhatsApp message. This app creates the code, stores it, and checks what the customer types.

## 1. Finish the AiSensy template

The template `fiberise_login_otp` is already submitted. In AiSensy open **Manage → Template Message** and click **Sync Status** until the status is **Approved**. Approval usually takes a few minutes and can take up to 24 hours.

The approved message text is fixed by WhatsApp. It looks like:

```text
123456 is your verification code.
For your security, do not share this code.
This code expires in 5 minutes.
```

Fiberise Fit appears as the WhatsApp business name, not inside that sentence. The **Copy code** button uses the same digits as the message.

If the template is rejected, create it again with:

| Field | Value |
|---|---|
| Category | AUTHENTICATION |
| Language | English |
| Template name | `fiberise_login_otp` |
| Type | TEXT |
| Sample value `{{1}}` | `123456` |
| Expiration warning | `5` |
| Security disclaimer | On |
| Copy code | `123456` |

Do not add a quick reply, URL, or phone button. `123456` is only the sample used for approval.

## 2. Create the live API campaign

1. Go to **Campaigns → +Launch → API Campaign**.
2. Campaign name: `fiberise_login_otp`.
3. Select the approved template `fiberise_login_otp`.
4. Set the campaign to **Live**.
5. Open the campaign and choose **Test Campaign**.
6. Send it to your own WhatsApp number with the sample code `123456`.
7. Confirm the message arrives and the **Copy code** button works.
8. Copy the cURL from that test. It is the exact request this app must send.

The API key in that cURL is a secret. Put it in the server environment only.

## 3. Environment variables

Add these to `.env` locally and to the production host. Do not prefix them with `NEXT_PUBLIC_`.

```bash
AISENSY_API_KEY=the_key_from_the_test_curl
AISENSY_CAMPAIGN_NAME=fiberise_login_otp
AISENSY_API_URL=https://backend.aisensy.com/campaign/t1/api/v2
```

`AISENSY_CAMPAIGN_NAME` must match the live API campaign name, not only the template name, if those names ever differ.

## 4. How a send works

The browser never calls AiSensy. It calls this app.

1. The customer enters a 10-digit mobile number and chooses **WhatsApp**.
2. The page posts `{ phone: "9876543210", channel: "whatsapp" }` to `POST /api/otp/send`.
3. The server checks that the number is 10 digits and starts with 6, 7, 8, or 9.
4. The server creates a 6-digit code and stores a hash of it for `91` plus those digits. The record expires in 5 minutes, the same window as the template.
5. The server calls AiSensy. `destination` is `919876543210`. The same code is sent in both places the test cURL shows:
   - `templateParams` (the message body)
   - the copy-code button parameter
6. A success response only means AiSensy accepted the message. The page then shows the 6-digit step.

Use the button field names from your own test cURL. A typical body looks like this:

```json
{
  "apiKey": "AISENSY_API_KEY",
  "campaignName": "fiberise_login_otp",
  "destination": "919876543210",
  "userName": "Fiberise Fit",
  "templateParams": ["482913"],
  "buttons": [
    {
      "type": "button",
      "sub_type": "url",
      "index": 0,
      "parameters": [{ "type": "text", "text": "482913" }]
    }
  ]
}
```

If the test cURL uses a different button shape, follow the cURL. The code in `templateParams` and the copy-code button must be the same value.

A WhatsApp code stays valid for 5 minutes. Asking again during that time does not send a new message; the customer enters the code already on their phone. A new message is allowed only after that code expires. Each code allows 5 wrong tries, then it stays locked until it expires. A number can receive 3 WhatsApp codes in 30 minutes. The next request is blocked for 30 minutes, then that number gets 3 codes again. Using those up blocks the number for 12 hours. After that, the same cycle starts over.

## 5. How a verify works

1. The page posts `{ phone: "9876543210", otp: "482913", channel: "whatsapp" }` to `POST /api/otp/verify`.
2. The server compares the code with the stored hash for that number.
3. A match deletes the stored code so it cannot be reused.
4. The server returns a Firebase custom token for that phone number.

The page then signs in with that custom token:

```ts
import { getAuth, signInWithCustomToken } from 'firebase/auth'

const { token } = await response.json()
const credential = await signInWithCustomToken(getAuth(), token)
const idToken = await credential.user.getIdToken(true)
```

After that, the existing login and checkout calls stay the same:

- Login posts the ID token to `POST /api/user`, then opens the account.
- Checkout passes the ID token to `POST /api/checkout/create`.

SMS does not use these two routes. SMS still uses `signInWithPhoneNumber` and `confirmationResult.confirm`.

Firebase custom tokens need a service account, which this app already loads from `FIREBASE_SERVICE_ACCOUNT_KEY` in `lib/firebase/admin.ts`. Create the token with the Admin SDK:

```ts
const customToken = await adminAuth.createCustomToken(phone, { phone })
```

Use the E.164 phone number (`+919876543210`) as the Firebase uid only if that is already how phone users are stored. Today the Firestore user id is the phone number from `decoded.phone_number`. A custom-token user does not automatically receive `phone_number` on the ID token. Set the phone on the user with the Admin SDK before returning the token:

```ts
await adminAuth.updateUser(uid, { phoneNumber: '+919876543210' }).catch(async () => {
  await adminAuth.createUser({ uid, phoneNumber: '+919876543210' })
})
const customToken = await adminAuth.createCustomToken(uid)
```

Use one stable uid per phone, such as the E.164 value, so WhatsApp and SMS logins resolve to the same account.

## 6. Where to add the choice in the UI

Add the channel choice on the phone step, before **Send OTP**, in both places:

- `app/account/login/page.tsx`
- `components/CheckoutOtpModal.tsx`

Two actions are enough:

- **Send SMS** keeps the current Firebase `signInWithPhoneNumber` flow.
- **Send on WhatsApp** calls `POST /api/otp/send` with `channel: "whatsapp"`.

The code step stays one form. If the channel is WhatsApp, submit calls `POST /api/otp/verify` and then `signInWithCustomToken`. If the channel is SMS, submit keeps `confirmationResult.confirm`.

Resend uses the same channel the customer already chose.

If WhatsApp sending fails, show a normal message such as “Could not send the WhatsApp code. Try SMS.” Do not show the AiSensy response body. Checkout can still fall through to Shopify when verification itself is down, which is the bypass already in `CheckoutOtpModal`.

## 7. Test before replacing anything

1. Template status is **Approved**.
2. API campaign status is **Live**.
3. The test campaign delivers to your own phone.
4. `POST /api/otp/send` for that number returns success and a WhatsApp message arrives.
5. A wrong code is rejected.
6. The correct code signs the user in and `POST /api/user` succeeds.
7. Checkout with **WhatsApp** reaches Shopify.
8. **Send SMS** still sends a Firebase SMS and still logs in.

Do not remove the Firebase SMS path while checking WhatsApp. It remains the default until WhatsApp delivery is reliable on real Indian numbers.
