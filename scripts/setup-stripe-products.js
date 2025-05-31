// Optional: Script to create products programmatically via Stripe API
// Run with: node scripts/setup-stripe-products.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

async function createStripeProducts() {
  try {
    console.log("Creating Stripe products and prices...")

    // Create Basic product and price
    const basicProduct = await stripe.products.create({
      name: "BibleAF Basic",
      description: "Essential features for daily Bible study",
    })

    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 499, // $4.99
      currency: "usd",
      recurring: { interval: "month" },
    })

    console.log("Basic Plan Price ID:", basicPrice.id)

    // Create Premium product and price
    const premiumProduct = await stripe.products.create({
      name: "BibleAF Premium",
      description: "Advanced features for deeper spiritual growth",
    })

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 999, // $9.99
      currency: "usd",
      recurring: { interval: "month" },
    })

    console.log("Premium Plan Price ID:", premiumPrice.id)

    // Create Annual Premium product and price
    const annualProduct = await stripe.products.create({
      name: "BibleAF Annual Premium",
      description: "Best value with 2 months free",
    })

    const annualPrice = await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 9999, // $99.99
      currency: "usd",
      recurring: { interval: "year" },
    })

    console.log("Annual Plan Price ID:", annualPrice.id)

    console.log("\n=== UPDATE YOUR CODE ===")
    console.log("Replace the stripePriceId values in lib/stripe-config.ts with:")
    console.log(`Basic: "${basicPrice.id}"`)
    console.log(`Premium: "${premiumPrice.id}"`)
    console.log(`Annual: "${annualPrice.id}"`)
  } catch (error) {
    console.error("Error creating Stripe products:", error)
  }
}

createStripeProducts()
