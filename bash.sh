#!/bin/bash

# Terminal A: Activate virtual environment and run Python script
osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd); source ./chatbot/bin/activate; python3 server.py"
end tell
EOF

# Terminal B: Change directory to bot-admin-dashboard and run npm start
osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd)/bot-admin-dashboard; npm start"
end tell
EOF
