$API_URL = "http://localhost:5000/api"

function Invoke-API {
    param([string]$Method, [string]$Endpoint, [object]$Body, [string]$Token)
    $headers = @{"Content-Type" = "application/json"}
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }
    $url = "$API_URL$Endpoint"
    try {
        $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $headers -Body ($Body | ConvertTo-Json) -UseBasicParsing
        return $response.Content | ConvertFrom-Json
    } catch {
        Write-Host "Error: $($_.Exception.Message)"
        return $null
    }
}

Write-Host "Creating sample data..."

$clients = @(
    @{ name = "Bob Smith"; email = "bob@example.com"; password = "password123"; role = "client" },
    @{ name = "Carol Davis"; email = "carol@example.com"; password = "password123"; role = "client" }
)

$clientTokens = @()
foreach ($client in $clients) {
    $response = Invoke-API -Method "POST" -Endpoint "/auth/register" -Body $client
    if ($response.success) {
        Write-Host "Created client: $($client.name)"
        $clientTokens += @{ name = $client.name; token = $response.token; userId = $response.user._id }
    } else {
        Write-Host "Skipped $($client.name): $($response.message)"
    }
}

$experts = @(
    @{ name = "David Chen"; email = "david@example.com"; password = "password123"; role = "expert" },
    @{ name = "Emma Wilson"; email = "emma@example.com"; password = "password123"; role = "expert" },
    @{ name = "Frank Martinez"; email = "frank@example.com"; password = "password123"; role = "expert" },
    @{ name = "Grace Lee"; email = "grace@example.com"; password = "password123"; role = "expert" },
    @{ name = "Henry Thompson"; email = "henry@example.com"; password = "password123"; role = "expert" }
)

$expertTokens = @()
foreach ($expert in $experts) {
    $response = Invoke-API -Method "POST" -Endpoint "/auth/register" -Body $expert
    if ($response.success) {
        Write-Host "Created expert: $($expert.name)"
        $expertTokens += @{ name = $expert.name; token = $response.token; userId = $response.user._id }
    } else {
        Write-Host "Skipped $($expert.name): $($response.message)"
    }
}

$expertSkills = @(
    @{ skills = @("React", "Node.js", "MongoDB", "JavaScript"); hourlyRate = 50 },
    @{ skills = @("UI Design", "UX Design", "Figma", "Prototyping"); hourlyRate = 40 },
    @{ skills = @("Python", "Machine Learning", "Data Analysis", "TensorFlow"); hourlyRate = 75 },
    @{ skills = @("React Native", "iOS Development", "Android Development", "Flutter"); hourlyRate = 55 },
    @{ skills = @("AWS", "Docker", "Kubernetes", "CI/CD", "Linux"); hourlyRate = 65 }
)

for ($i = 0; $i -lt $expertTokens.Count; $i++) {
    $updateData = @{
        bio = "Professional with expertise"
        skills = $expertSkills[$i].skills
        hourlyRate = $expertSkills[$i].hourlyRate
        university = "Top University"
        major = "Computer Science"
    }
    $response = Invoke-API -Method "PUT" -Endpoint "/users/$($expertTokens[$i].userId)" -Body $updateData -Token $expertTokens[$i].token
    if ($response.success) {
        Write-Host "Updated skills for: $($expertTokens[$i].name)"
    }
}

$aliceResponse = Invoke-API -Method "POST" -Endpoint "/auth/login" -Body @{ email = "alice@example.com"; password = "password123" }
$aliceToken = $aliceResponse.token
$aliceId = $aliceResponse.user._id

$projects = @(
    @{ title = "E-Commerce Platform MVP"; description = "Modern e-commerce with React and Node.js"; category = "Web Development"; budget = 5000; skillsRequired = @("React", "Node.js") },
    @{ title = "Mobile App UI/UX Design"; description = "Fitness tracking app design"; category = "UI/UX Design"; budget = 2000; skillsRequired = @("UI Design", "UX Design") },
    @{ title = "Data Analysis Dashboard"; description = "Business metrics visualization"; category = "Data Analysis"; budget = 3500; skillsRequired = @("Python", "Data Analysis") },
    @{ title = "Cloud Infrastructure Setup"; description = "AWS migration and setup"; category = "DevOps"; budget = 4000; skillsRequired = @("AWS", "Docker") },
    @{ title = "iOS App Development"; description = "Native iOS social networking app"; category = "Mobile Development"; budget = 6000; skillsRequired = @("iOS Development", "Swift") },
    @{ title = "Website Redesign"; description = "Modern company website redesign"; category = "Web Design"; budget = 2800; skillsRequired = @("UI Design", "Web Development") },
    @{ title = "API Development"; description = "RESTful APIs and documentation"; category = "Web Development"; budget = 3500; skillsRequired = @("Node.js", "REST APIs") }
)

foreach ($project in $projects) {
    $response = Invoke-API -Method "POST" -Endpoint "/projects" -Body $project -Token $aliceToken
    if ($response.success) {
        Write-Host "Created project: $($project.title)"
    }
}

Write-Host "Sample Data Summary:"
Write-Host "- Created $($clientTokens.Count + 1) clients"
Write-Host "- Created $($expertTokens.Count) experts with skills"
Write-Host "- Created $($projects.Count) projects"
Write-Host "Done!"
