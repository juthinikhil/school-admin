#!/usr/bin/env bash
set -u

echo "=========================================================="
echo " Running Automated Tests across School-Admin Services"
echo "=========================================================="

test_endpoint() {
  local name="$1"
  local url="$2"
  local expected="$3"

  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "FAIL")

  if [ "$status" = "$expected" ]; then
    printf "  ✔ [%-20s] HTTP %s (Passed)\n" "$name" "$status"
  else
    printf "  ✖ [%-20s] HTTP %s (Expected %s)\n" "$name" "$status" "$expected"
  fi
}

echo "1. Checking Core Microservice Health:"
test_endpoint "Auth Service"        "http://localhost:4000/health" "200"
test_endpoint "Academic Service"    "http://localhost:4001/health" "200"
test_endpoint "Attendance Service"  "http://localhost:4002/health" "200"
test_endpoint "Billing Service"     "http://localhost:4003/health" "200"
test_endpoint "Comms Service"       "http://localhost:4004/health" "200"
test_endpoint "AI Gateway (7B)"     "http://localhost:5002/health" "200"

echo ""
echo "2. Checking Domain Endpoints & Data Payloads:"
test_endpoint "Courses List"        "http://localhost:4001/courses" "200"
test_endpoint "Assignments List"    "http://localhost:4001/assignments" "200"
test_endpoint "Attendance By Class" "http://localhost:4002/attendance/cs101" "200"
test_endpoint "Billing Invoices"    "http://localhost:4003/invoices" "200"
test_endpoint "Comms Notices"       "http://localhost:4004/notices" "200"

echo ""
echo "3. Checking Swagger & Frontend UI:"
test_endpoint "Swagger UI"          "http://localhost:8081" "200"
test_endpoint "Web Dashboard UI"    "http://localhost:3000" "200"

echo ""
echo "4. Testing AI Inference with qwen2.5-coder:7b:"
AI_TEST=$(curl -s -X POST http://localhost:5002/generate \
  -H "Content-Type: application/json" \
  -d '{"role":"Student","prompt":"Explain Newton second law in one sentence"}' || echo '{"reply":"FAILED"}')

echo "AI Response: $(echo "$AI_TEST" | grep -o '"reply":"[^"]*' | cut -d'"' -f4 | head -c 120)..."
echo "=========================================================="
