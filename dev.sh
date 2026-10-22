#!/usr/bin/env bash
set -euo pipefail

export OLLAMA_API_BASE="http://127.0.0.1:11434"
git init 2>/dev/null || true

echo "=========================================="
echo " Fetching available local Ollama models..."
echo "=========================================="

# Pure bash parser: handles Docker output reliably
MODELS=()
while read -r name _; do
  [[ -z "$name" || "$name" == "NAME" ]] && continue
  MODELS+=("$name")
done < <(docker exec ollama ollama list 2>/dev/null || true)

if [ ${#MODELS[@]} -eq 0 ]; then
  echo "Error: No models found or Ollama container is not running." >&2
  exit 1
fi

echo "Available Local Models:"
for i in "${!MODELS[@]}"; do
  printf "  [%d] %s\n" "$((i + 1))" "${MODELS[$i]}"
done
echo "=========================================="

while true; do
  read -rp "Select model number (1-${#MODELS[@]}): " CHOICE
  if [[ "$CHOICE" =~ ^[0-9]+$ ]] && [ "$CHOICE" -ge 1 ] && [ "$CHOICE" -le "${#MODELS[@]}" ]; then
    SELECTED_MODEL="${MODELS[$((CHOICE - 1))]}"
    break
  else
    echo "Invalid selection. Enter a number between 1 and ${#MODELS[@]}."
  fi
done

echo ""
echo "Starting Aider with: ollama_chat/${SELECTED_MODEL}"
echo "=========================================="

# Aider invocation without the unrecognized --no-thinking flag
exec aider \
  --model "ollama_chat/${SELECTED_MODEL}" \
  --read CONVENTIONS.md \
  --edit-format whole \
  --auto-commits \
  --yes-always \
  --map-tokens 0 \
  --thinking-tokens 0 \
  "$@"
