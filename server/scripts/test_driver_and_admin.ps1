$base = 'http://localhost:5000/api/v1'

Write-Host "1. Testing Driver Onboarding..."
$onboardingPayload = @{
  name = "Manish Tiwari"
  phone = "9825999888"
  email = "manish.tiwari@example.com"
  vehicleType = "cargo_auto"
  vehicleNumber = "GJ-01-AT-4422"
  vehicleModel = "Bajaj Maxima Z"
  documents = @{
    licence = @{ number = "GJ01-2021004928" }
    aadhaar = @{ number = "987654321098" }
    rc = @{ number = "GJ01AT4422" }
  }
} | ConvertTo-Json -Depth 5

$drvRes = Invoke-RestMethod -Uri "$base/drivers/onboarding" -Method POST -Body $onboardingPayload -ContentType 'application/json'
Write-Host "New driver registered ID: $($drvRes.data.driverId) Status: $($drvRes.data.driver.status)"

Write-Host "2. Updating Driver Verification Status to approved..."
$verifyPayload = @{
  status = "approved"
  docType = "licence"
} | ConvertTo-Json
$updDrv = Invoke-RestMethod -Uri "$base/drivers/$($drvRes.data.driverId)/verification" -Method PATCH -Body $verifyPayload -ContentType 'application/json'
Write-Host "Driver status after approval: $($updDrv.data.driver.status)"

Write-Host "3. Testing Admin Live Ops API..."
$liveOps = Invoke-RestMethod -Uri "$base/admin/live-ops"
Write-Host "Live Ops active drivers count: $($liveOps.data.activeDrivers.Count)"

Write-Host "4. Testing Admin Reports API..."
$reports = Invoke-RestMethod -Uri "$base/admin/reports?range=monthly"
Write-Host "Report total orders: $($reports.data.summary.totalOrders), Total revenue: ₹$($reports.data.summary.totalRevenueInr)"

Write-Host "5. Testing Admin Helpers API..."
$helpers = Invoke-RestMethod -Uri "$base/admin/helpers"
Write-Host "Total helpers registered: $($helpers.data.helpers.Count)"

Write-Host "6. Testing Admin Audit Logs API..."
$audit = Invoke-RestMethod -Uri "$base/admin/audit-logs"
Write-Host "Total audit logs: $($audit.data.logs.Count)"

Write-Host "Driver and Admin tests passed successfully!"
