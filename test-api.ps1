Write-Host "Testing Food Ordering System APIs" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3001/api"
$recUrl = "http://localhost:3002/api"

Write-Host "1. Testing Order Service Health..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/" -Method Get
    Write-Host "Order Service is running" -ForegroundColor Green
    Write-Host "  Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "Order Service is not responding" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "2. Testing Recommendation Service Health..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/" -Method Get
    Write-Host "Recommendation Service is running" -ForegroundColor Green
    Write-Host "  Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "Recommendation Service is not responding" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "3. User Signup..." -ForegroundColor Cyan
$signupData = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
    phone = "9876543210"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupData -ContentType "application/json"
    Write-Host "User created successfully" -ForegroundColor Green
    $token = $signupResponse.data.token
    $userId = $signupResponse.data.userId
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "User already exists, trying login..." -ForegroundColor Yellow
    
    $loginData = @{
        email = "test@example.com"
        password = "test123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
        $token = $loginResponse.data.token
        $userId = $loginResponse.data.userId
        Write-Host "Login successful" -ForegroundColor Green
        Write-Host "  User ID: $userId" -ForegroundColor Gray
    } catch {
        Write-Host "Login failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "4. Get Cities..." -ForegroundColor Cyan
try {
    $cities = Invoke-RestMethod -Uri "$baseUrl/cities" -Method Get -Headers $headers
    Write-Host "Retrieved $($cities.data.Count) cities" -ForegroundColor Green
    $cities.data | ForEach-Object { Write-Host "  - $($_.name), $($_.state)" -ForegroundColor Gray }
    $cityId = $cities.data[0]._id
} catch {
    Write-Host "Failed to get cities" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "5. Get Restaurants..." -ForegroundColor Cyan
try {
    $restaurants = Invoke-RestMethod -Uri "$baseUrl/restaurants?cityId=$cityId" -Method Get -Headers $headers
    Write-Host "Retrieved $($restaurants.data.Count) restaurants" -ForegroundColor Green
    $restaurants.data | ForEach-Object { Write-Host "  - $($_.name) ($($_.cuisine -join ', ')) - Rating: $($_.rating)" -ForegroundColor Gray }
    $restaurantId = $restaurants.data[0]._id
} catch {
    Write-Host "Failed to get restaurants" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "6. Get Menu..." -ForegroundColor Cyan
try {
    $menu = Invoke-RestMethod -Uri "$baseUrl/restaurants/$restaurantId/menu" -Method Get -Headers $headers
    Write-Host "Retrieved $($menu.data.Count) menu items" -ForegroundColor Green
    $menu.data | Select-Object -First 3 | ForEach-Object { Write-Host "  - $($_.name) - Rs $($_.price)" -ForegroundColor Gray }
    $foodItemId = $menu.data[0]._id
} catch {
    Write-Host "Failed to get menu" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "7. Add to Cart..." -ForegroundColor Cyan
$cartData = @{
    foodItemId = $foodItemId
    quantity = 2
} | ConvertTo-Json

try {
    $cart = Invoke-RestMethod -Uri "$baseUrl/cart/add" -Method Post -Body $cartData -ContentType "application/json" -Headers $headers
    Write-Host "Item added to cart" -ForegroundColor Green
    Write-Host "  Cart Total: Rs $($cart.data.totalAmount)" -ForegroundColor Gray
} catch {
    Write-Host "Failed to add to cart" -ForegroundColor Red
}
Write-Host ""

Write-Host "8. View Cart..." -ForegroundColor Cyan
try {
    $cart = Invoke-RestMethod -Uri "$baseUrl/cart" -Method Get -Headers $headers
    Write-Host "Cart retrieved" -ForegroundColor Green
    Write-Host "  Items: $($cart.data.items.Count)" -ForegroundColor Gray
    Write-Host "  Total: Rs $($cart.data.totalAmount)" -ForegroundColor Gray
} catch {
    Write-Host "Failed to get cart" -ForegroundColor Red
}
Write-Host ""

Write-Host "9. Place Order..." -ForegroundColor Cyan
$orderData = @{
    deliveryAddress = @{
        street = "123 Test Street"
        city = "Mumbai"
        state = "Maharashtra"
        zipCode = "400001"
    }
    idempotencyKey = "test-order-$(Get-Random)"
} | ConvertTo-Json

try {
    $order = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderData -ContentType "application/json" -Headers $headers
    Write-Host "Order placed successfully" -ForegroundColor Green
    Write-Host "  Order ID: $($order.data._id)" -ForegroundColor Gray
    Write-Host "  Status: $($order.data.status)" -ForegroundColor Gray
    Write-Host "  Total: Rs $($order.data.totalAmount)" -ForegroundColor Gray
    $orderId = $order.data._id
} catch {
    Write-Host "Failed to place order" -ForegroundColor Red
}
Write-Host ""

Write-Host "10. Get Order Details..." -ForegroundColor Cyan
try {
    $orderDetails = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId" -Method Get -Headers $headers
    Write-Host "Order retrieved" -ForegroundColor Green
    Write-Host "  Order ID: $($orderDetails.data._id)" -ForegroundColor Gray
    Write-Host "  Status: $($orderDetails.data.status)" -ForegroundColor Gray
} catch {
    Write-Host "Failed to get order" -ForegroundColor Red
}
Write-Host ""

Write-Host "11. Get Recommendations..." -ForegroundColor Cyan
try {
    $recommendations = Invoke-RestMethod -Uri "$recUrl/recommendations?userId=$userId" -Method Get
    Write-Host "Recommendations retrieved" -ForegroundColor Green
    if ($recommendations.data.Count -gt 0) {
        Write-Host "  Found $($recommendations.data.Count) recommendations" -ForegroundColor Gray
    } else {
        Write-Host "  No recommendations yet (order more to get personalized suggestions)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Failed to get recommendations" -ForegroundColor Red
}
Write-Host ""

Write-Host "=====================================" -ForegroundColor Green
Write-Host "All Tests Completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
