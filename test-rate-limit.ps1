# Test rate limit functionality

Write-Host "Testing rate limit functionality..." -ForegroundColor Green

$url = "http://localhost:3000/api/auth/login"
$requestData = @{
    email = "test@example.com"
    password = "test123"
}

# Send 15 requests to test rate limiting (limit is 10)
for ($i = 1; $i -le 15; $i++) {
    try {
        $response = Invoke-RestMethod -Uri $url -Method POST -Body ($requestData | ConvertTo-Json) -ContentType "application/json"
        Write-Host "Request $i`: Status code 200, Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Cyan
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.ErrorDetails.Message
        Write-Host "Request $i`: Status code $statusCode, Response: $errorMessage" -ForegroundColor Red
        
        # If status code is 429, rate limit is triggered
        if ($statusCode -eq 429) {
            Write-Host "✓ Rate limit functionality works!" -ForegroundColor Green
            break
        }
    }
    
    # Wait 100ms to avoid sending requests too quickly
    Start-Sleep -Milliseconds 100
}

Write-Host "Test completed" -ForegroundColor Green
