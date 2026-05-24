import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb, isAdminInitialized, getInitError } from '@/lib/firebase/admin'
import { shopifyFetch } from '@/lib/shopify/client'
import { CART_CREATE_MUTATION, CART_UPDATE_MUTATION, CART_BUYER_IDENTITY_UPDATE_MUTATION, CART_DISCOUNT_CODES_UPDATE_MUTATION } from '@/lib/shopify/queries'
export const dynamic = 'force-dynamic'

interface CartItem {
  id: string
  quantity: number
}

export async function POST(request: NextRequest) {
  // Check if Firebase Admin is initialized
  if (!isAdminInitialized() || !adminAuth || !adminDb) {
    const error = getInitError()
    console.error('Firebase Admin not initialized:', error)
    return NextResponse.json(
      { 
        error: 'Firebase Admin not configured. Please check FIREBASE_SERVICE_ACCOUNT_KEY in .env.local',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }

  try {
    // Get Authorization header
    const authHeader = request.headers.get('Authorization')
    let phone: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1]

      // Verify Firebase token
      let decodedToken
      try {
        decodedToken = await adminAuth.verifyIdToken(idToken)
      } catch (error: any) {
        console.error('Token verification error:', error)
        return NextResponse.json(
          { error: 'Unauthorized: Invalid token' },
          { status: 401 }
        )
      }

      phone = decodedToken.phone_number as string | undefined
      if (phone) {
        const userDocId = phone
        const userDoc = await adminDb.collection('users').doc(userDocId).get()
        if (!userDoc.exists) {
          return NextResponse.json(
            { error: 'User not found. Please login again.' },
            { status: 404 }
          )
        }
      }
    }

    // Get cart items and optional discount code from request body
    const body = await request.json()
    const { items, discountCode }: { items: CartItem[]; discountCode?: string } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Helper function to convert ID to Shopify GID format
    const toShopifyGID = (id: string): string => {
      // If already in GID format, return as is
      if (id.startsWith('gid://')) {
        return id
      }
      // If it's just a numeric ID, convert to ProductVariant GID
      // Try ProductVariant first (most common)
      if (/^\d+$/.test(id)) {
        return `gid://shopify/ProductVariant/${id}`
      }
      // If it contains a dash or other format, might be product-variant format
      // Return as is and let Shopify validate
      return id
    }

    // Prepare cart lines with proper GID format
    const cartLines = items.map((item) => {
      const merchandiseId = toShopifyGID(item.id)
      console.log(`📦 Cart item ID: ${item.id} -> GID: ${merchandiseId}, Quantity: ${item.quantity}`)
      return {
        merchandiseId,
        quantity: item.quantity,
      }
    })

    // Create cart with items
    const cartInput: any = {
      lines: cartLines,
    }

    if (phone) {
      cartInput.attributes = [
        {
          key: 'user_phone',
          value: phone,
        },
      ]
    }

    console.log('Creating Shopify cart with items:', JSON.stringify(cartLines, null, 2))

    const cartResult = await shopifyFetch<{
      cartCreate: {
        cart: {
          id: string
          checkoutUrl: string
        }
        userErrors: Array<{ field: string[]; message: string }>
      }
    }>({
      query: CART_CREATE_MUTATION,
      variables: { input: cartInput },
    })

    if (cartResult.cartCreate.userErrors?.length > 0) {
      const errors = cartResult.cartCreate.userErrors
        .map((e) => e.message)
        .join(', ')
      console.error('❌ Shopify cart creation errors:', cartResult.cartCreate.userErrors)
      
      // Provide more helpful error message
      let errorMessage = `Cart creation failed: ${errors}`
      if (errors.includes('does not exist')) {
        errorMessage = `One or more products in your cart are no longer available or have invalid variant IDs. Please clear your cart, go to Shop, and add products again. Technical error: ${errors}`
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: cartResult.cartCreate.userErrors,
          suggestion: 'Please clear your cart and add products fresh from the shop page.'
        },
        { status: 400 }
      )
    }

    const cartId = cartResult.cartCreate.cart.id
    let checkoutUrl = cartResult.cartCreate.cart.checkoutUrl

    // Update cart attributes to ensure user_phone is set
    if (phone) {
      try {
        await shopifyFetch<{
          cartAttributesUpdate: {
            cart: {
              id: string
              checkoutUrl: string
            }
            userErrors: Array<{ field: string[]; message: string }>
          }
        }>({
          query: CART_UPDATE_MUTATION,
          variables: {
            cartId,
            attributes: [
              {
                key: 'user_phone',
                value: phone,
              },
            ],
          },
        })
      } catch (error) {
        console.error('Error updating cart attributes:', error)
        // Continue even if attribute update fails
      }
    }

    // Set buyer identity (phone) so checkout Contact field is prefilled automatically
    if (phone && phone.trim()) {
      const digits = phone.replace(/\D/g, '').slice(-10)
      if (digits.length >= 10) {
        const phoneE164 = `+91${digits}`
        try {
          const identityResult = await shopifyFetch<{
            cartBuyerIdentityUpdate: {
              cart: { id: string; checkoutUrl: string } | null
              userErrors: Array<{ field: string[]; message: string }>
            }
          }>({
            query: CART_BUYER_IDENTITY_UPDATE_MUTATION,
            variables: {
              cartId,
              buyerIdentity: {
                phone: phoneE164,
                countryCode: 'IN',
              },
            },
          })
          if (identityResult.cartBuyerIdentityUpdate.userErrors?.length > 0) {
            console.warn('Cart buyer identity update warnings:', identityResult.cartBuyerIdentityUpdate.userErrors)
          }
          if (identityResult.cartBuyerIdentityUpdate.cart?.checkoutUrl) {
            checkoutUrl = identityResult.cartBuyerIdentityUpdate.cart.checkoutUrl
          }
        } catch (err) {
          console.error('Error setting cart buyer identity (phone):', err)
          // Continue with checkout without phone prefill
        }
      }
    }

    // Apply promotion/discount code if provided
    const finalDiscountCode = discountCode?.trim()
    if (finalDiscountCode) {
      const discountCodesToApply = [finalDiscountCode]
      try {
        const discountResult = await shopifyFetch<{
          cartDiscountCodesUpdate: {
            cart: { id: string; checkoutUrl: string }
            userErrors: Array<{ field: string[]; message: string }>
          }
        }>({
          query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
          variables: { cartId, discountCodes: discountCodesToApply },
        })
        if (discountResult.cartDiscountCodesUpdate.cart?.checkoutUrl) {
          checkoutUrl = discountResult.cartDiscountCodesUpdate.cart.checkoutUrl
        }
        if (discountResult.cartDiscountCodesUpdate.userErrors?.length > 0) {
          const errMsg = discountResult.cartDiscountCodesUpdate.userErrors
            .map((e) => e.message)
            .join(', ')
          console.warn('Discount code not applied:', errMsg)
          return NextResponse.json(
            {
              checkoutUrl,
              discountError: errMsg,
            },
            { status: 200 }
          )
        }
      } catch (discountError: any) {
        console.error('Error applying discount code:', discountError)
        // Continue with checkout without discount
      }
    }

    // Pre-fill only phone on checkout — do not send email (user wants mobile number only).
    if (checkoutUrl) {
      try {
        const url = new URL(checkoutUrl)
        if (phone && phone.trim()) {
          const normalizedPhone = phone.replace(/\D/g, '').slice(-10)
          if (normalizedPhone.length >= 10) {
            url.searchParams.set('checkout[shipping_address][phone]', normalizedPhone)
          }
        }
        // Intentionally not setting checkout[email] so the contact field is not prefilled with system email.
        checkoutUrl = url.toString()
      } catch (error) {
        console.error('Error appending prefill params to checkout URL:', error)
      }
    }

    console.log('✅ Checkout created successfully:', checkoutUrl)
    return NextResponse.json({ checkoutUrl })
  } catch (error: any) {
    console.error('❌ Error in /api/checkout/create:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error'
    if (error.message?.includes('Invalid global id')) {
      errorMessage = `Invalid product variant ID. Please ensure products are added from the shop page. Error: ${error.message}`
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
