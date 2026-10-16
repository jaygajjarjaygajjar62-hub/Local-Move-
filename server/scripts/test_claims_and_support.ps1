$base = 'http://localhost:5000/api/v1'

Write-Host "1. Testing Claims API..."
$claimPayload = @{
  orderId = "ORD-E2E-TEST"
  customerId = "cust-demo"
  customerName = "Kunal Shah"
  customerPhone = "9879011223"
  category = "packaging_damage"
  description = "Outer box crushed slightly during transit"
  claimedAmountInr = 450
  photos = @("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400")
} | ConvertTo-Json

$claimRes = Invoke-RestMethod -Uri "$base/claims" -Method POST -Body $claimPayload -ContentType 'application/json'
Write-Host "Created Claim ID: $($claimRes.data.claimId)"

Write-Host "2. Resolving Claim with compensation..."
$resolvePayload = @{
  approvedCompensationInr = 450
  resolutionNotes = "Claim approved after photographic inspection. Compensation granted."
} | ConvertTo-Json
$resClaim = Invoke-RestMethod -Uri "$base/claims/$($claimRes.data.claimId)/resolve" -Method PATCH -Body $resolvePayload -ContentType 'application/json'
Write-Host "Claim status: $($resClaim.data.claim.status), Approved Inr: $($resClaim.data.claim.approvedCompensationInr)"

Write-Host "3. Testing Support Tickets API..."
$ticketPayload = @{
  userId = "cust-demo"
  userName = "Kunal Shah"
  userRole = "customer"
  userPhone = "9879011223"
  orderId = "ORD-E2E-TEST"
  subject = "Need GST Invoice for order"
  category = "billing"
  priority = "medium"
  message = "Please email the tax invoice for ORD-E2E-TEST to kunal.shah@example.com"
} | ConvertTo-Json
$ticketRes = Invoke-RestMethod -Uri "$base/support/tickets" -Method POST -Body $ticketPayload -ContentType 'application/json'
Write-Host "Created Ticket ID: $($ticketRes.data.ticketId)"

Write-Host "4. Adding Agent Reply to Ticket..."
$msgPayload = @{
  text = "Hello Kunal, your tax invoice has been generated and dispatched to your email address."
  sender = "agent"
  senderName = "Aera Operations Desk"
} | ConvertTo-Json
$replyRes = Invoke-RestMethod -Uri "$base/support/tickets/$($ticketRes.data.ticketId)/messages" -Method POST -Body $msgPayload -ContentType 'application/json'
Write-Host "Total messages on ticket: $($replyRes.data.ticket.messages.Count)"

Write-Host "5. Testing Saved Addresses API..."
$addrPayload = @{
  title = "Client Site B"
  fullAddress = "Near Iscon Cross Road, SG Highway, Ahmedabad"
  landmark = "Opposite Iscon Mall"
  coords = @{ lat = 23.0280; lng = 72.5070 }
} | ConvertTo-Json
$addrRes = Invoke-RestMethod -Uri "$base/addresses" -Method POST -Body $addrPayload -ContentType 'application/json'
Write-Host "Created Address ID: $($addrRes.data.address.id)"

Write-Host "6. Testing Wallet API..."
$topUpRes = Invoke-RestMethod -Uri "$base/wallet/top-up" -Method POST -Body (@{ amount = 500 } | ConvertTo-Json) -ContentType 'application/json'
Write-Host "New Wallet Balance: ₹$($topUpRes.data.balance)"

Write-Host "All Claims, Support, Address, and Wallet APIs verified!"
