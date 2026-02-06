#!/bin/bash

echo "=== Peginti GitHub Full Service ==="
echo "Choisis ton mode de lancement :"
echo "1) Docker (toolsets all)"
echo "2) Local (Insiders Mode)"
echo "3) Local (Tools ciblés)"
echo "4) Local (Read-Only)"
echo "5) Local (Lockdown Mode)"
read -p "Option: " choice

case $choice in
  1)
    docker run -it --rm \
      -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_TOKEN \
      -e GITHUB_TOOLSETS="all" \
      ghcr.io/github/github-mcp-server
    ;;
  2)
    GITHUB_INSIDERS=true GITHUB_TOOLSETS="repos,issues,pull_requests,actions,code_security" \
    ./github-mcp-server stdio
    ;;
  3)
    GITHUB_TOOLS="get_file_contents,issue_read,create_pull_request" \
    ./github-mcp-server stdio
    ;;
  4)
    GITHUB_READ_ONLY=1 ./github-mcp-server stdio
    ;;
  5)
    GITHUB_LOCKDOWN_MODE=1 ./github-mcp-server stdio
    ;;
  *)
    echo "Option invalide."
    ;;
esac
