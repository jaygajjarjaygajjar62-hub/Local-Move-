$base = 'http://localhost:5000/api/v1'

Write-Host "1. Checking server health..."
$h = Invoke-RestMethod -Uri "$base/health"
Write-Host "Health status: $($h.data.status)"

Write-Host "2. Creating a test booking via API..."
$orderPayload = @{
  id = "ORD-E2E-TEST"
  customerId = "cust-demo"
  sender = @{
    name = "Kunal Shah"
    phone = "9879011223"
  }
  receiver = @{
    name = "Suresh Mehta"
    phone = "9825098765"
  }
  pickupAddress = @{
    title = "Office HQ"
    fullAddress = "Prahlad Nagar, Ahmedabad"
    coords = @{ lat = 23.0125; lng = 72.5050 }
  }
  dropAddress = @{
    title = "Warehouse"
    fullAddress = "Changodar GIDC, Ahmedabad"
    coords = @{ lat = 22.9250; lng = 72.4350 }
  }
  item = @{
    category = "electronics"
    description = "Electronic parts carton"
    quantity = 1
    size = "medium"
    approxWeightKg = 50
    declaredValueInr = 5000
    handlingTags = @("fragile")
    customerPhotos = @()
  }
  vehicleType = "mini_truck"
  fare = @{
    baseFare = 250
    distanceKm = 15
    distanceCharge = 150
    handlingFee = 0
    helperCount = 0
    helperCharge = 0
    packingCharge = 0
    itemProtectionFee = 49
    nightSurgeAdjustment = 0
    subtotal = 449
    taxesGst = 80
    discount = 0
    walletDeduction = 0
    totalCustomerFare = 529
    driverShare = 423
    companyShare = 106
    isEstimate = $false
  }
  paymentMethod = "cash"
  paymentStatus = "pending"
  pickupOtp = "5566"
  dropOtp = "7788"
  trackingToken = "track-e2e-123"
} | ConvertTo-Json -Depth 6

$createRes = Invoke-RestMethod -Uri "$base/orders" -Method POST -Body $orderPayload -ContentType 'application/json'
Write-Host "Created order ID: $($createRes.data.orderId)"

Write-Host "3. Assigning driver drv-2..."
$assignRes = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/assign-driver" -Method POST -Body (@{ driverId = 'drv-2' } | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Order status after assign: $($assignRes.data.order.status) Driver: $($assignRes.data.order.assignedDriver.name)"

Write-Host "4. Confirming pickup sender..."
$pSender = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/pickup/confirm-sender" -Method POST
Write-Host "Pickup sender confirmed: $($pSender.data.confirmed)"

Write-Host "5. Verifying pickup OTP 5566..."
$pOtp = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/pickup/verify-otp" -Method POST -Body (@{ otp = '5566' } | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Pickup OTP success: $($pOtp.data.success)"

Write-Host "6. Adding pickup proof..."
$pProof = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/pickup/proof" -Method POST -Body (@{
  type = 'photo'
  url = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400'
  note = 'Package verified undamaged at pickup'
} | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Pickup proof recorded ID: $($pProof.data.proofId)"

Write-Host "7. Starting trip (in_transit)..."
$startRes = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/pickup/start-trip" -Method POST
Write-Host "Trip started: $($startRes.data.success)"

Write-Host "8. Public tracking access by token..."
$trackRes = Invoke-RestMethod -Uri "$base/orders/track/track-e2e-123"
Write-Host "Track status: $($trackRes.data.order.status), Drop OTP masked: $($trackRes.data.order.dropOtp)"

Write-Host "9. Receiver verifies phone with last 4 digits 8765..."
$verifyRes = Invoke-RestMethod -Uri "$base/orders/track/track-e2e-123/verify" -Method POST -Body (@{ phoneLast4 = '8765' } | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Receiver unlocked OTP: $($verifyRes.data.dropOtp)"

Write-Host "10. Confirming drop receiver..."
$dReceiver = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/drop/confirm-receiver" -Method POST
Write-Host "Drop receiver confirmed: $($dReceiver.data.confirmed)"

Write-Host "11. Verifying drop OTP 7788..."
$dOtp = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/drop/verify-otp" -Method POST -Body (@{ otp = '7788' } | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Drop OTP success: $($dOtp.data.success)"

Write-Host "12. Adding drop proof..."
$dProof = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/drop/proof" -Method POST -Body (@{
  type = 'photo'
  url = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'
  note = 'Handed over to Suresh Mehta'
} | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Drop proof recorded ID: $($dProof.data.proofId)"

Write-Host "13. Confirming cash collection ₹529..."
$cashRes = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/drop/collect-cash" -Method POST -Body (@{ amount = 529 } | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Cash collected confirmed: $($cashRes.data.confirmed)"

Write-Host "14. Closing delivery..."
$completeRes = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/drop/complete" -Method POST
Write-Host "Delivery completed: $($completeRes.data.success)"

Write-Host "15. Rating delivery 5 stars with tip..."
$rateRes = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST/rate" -Method POST -Body (@{
  stars = 5
  comment = 'Outstanding service!'
  tipInr = 50
} | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Rated: $($rateRes.data.rated)"

Write-Host "16. Fetching final order details from database..."
$finalOrder = Invoke-RestMethod -Uri "$base/orders/ORD-E2E-TEST"
Write-Host "Final status: $($finalOrder.data.order.status)"
Write-Host "Final rating stars: $($finalOrder.data.order.driverRating.stars)"
Write-Host "Total timeline events: $($finalOrder.data.order.timeline.Count)"
