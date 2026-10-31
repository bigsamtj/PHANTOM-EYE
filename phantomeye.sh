#!/bin/bash

# ============================================
# PHANTOM EYE - Professional Launcher
# Author: Samuel Adeyinka (Big Sam)
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Banner
echo -e "${PURPLE}"
cat << "EOF"
██████╗ ██╗  ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ ███╗   ███╗    ███████╗██╗   ██╗███████╗
██╔══██╗██║  ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗████╗ ████║    ██╔════╝╚██╗ ██╔╝██╔════╝
██████╔╝███████║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║    █████╗   ╚████╔╝ █████╗  
██╔═══╝ ██╔══██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║    ██╔══╝    ╚██╔╝  ██╔══╝  
██║     ██║  ██║██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║    ███████╗   ██║   ███████╗
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝    ╚══════╝   ╚═╝   ╚══════╝
EOF
echo -e "${NC}"
echo -e "${CYAN}          👁  Automated Security Assessment Platform  👁${NC}"
echo -e "${GREEN}                    Author: Samuel Adeyinka (Big Sam)${NC}"
echo ""

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}[!] Usage: ./phantomeye.sh <target>${NC}"
    echo -e "${YELLOW}    Example: ./phantomeye.sh example.com${NC}"
    exit 1
fi

TARGET=$1
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SAFE_TARGET=$(echo "$TARGET" | tr -cd '[:alnum:].-')
REPORT_DIR="reports/${SAFE_TARGET}_${TIMESTAMP}"

# Create folders
mkdir -p "$REPORT_DIR"
mkdir -p reports

LOG_FILE="${REPORT_DIR}/full_terminal.log"
TXT_REPORT="${REPORT_DIR}/report.txt"
HTML_REPORT="${REPORT_DIR}/report.html"

echo -e "${CYAN}[*] Target          : ${TARGET}${NC}"
echo -e "${CYAN}[*] Report Folder   : ${REPORT_DIR}${NC}"
echo -e "${CYAN}[*] Starting full assessment...${NC}"
echo ""

# Run the engine
cd engine

python3 phantomeye.py "$TARGET" 2>&1 | tee "../${LOG_FILE}"

# Move generated reports into the dated folder
cd ..

# Find the latest generated reports and move them
LATEST_TXT=$(ls -t reports/phantomeye_*.txt 2>/dev/null | head -n 1)
LATEST_HTML=$(ls -t reports/phantomeye_*.html 2>/dev/null | head -n 1)

if [ -n "$LATEST_TXT" ]; then
    mv "$LATEST_TXT" "$TXT_REPORT"
fi

if [ -n "$LATEST_HTML" ]; then
    mv "$LATEST_HTML" "$HTML_REPORT"
fi

echo ""
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}[+] Assessment Completed Successfully${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${CYAN}📁 Report Folder : ${REPORT_DIR}${NC}"
echo -e "${CYAN}📄 TXT Report    : ${TXT_REPORT}${NC}"
echo -e "${CYAN}🌐 HTML Report   : ${HTML_REPORT}${NC}"
echo -e "${CYAN}📜 Full Log      : ${LOG_FILE}${NC}"
echo ""
echo -e "${YELLOW}[*] Open the HTML report in your browser for the best view.${NC}"
echo ""
