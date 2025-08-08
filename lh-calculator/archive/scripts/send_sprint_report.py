#!/usr/bin/env python3
"""Send Sprint 1 completion report email."""

import os
import sys
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from datetime import datetime

# Email configuration
SENDER_EMAIL = "olegmalkov2023@gmail.com"
TO_EMAIL = "a1538800@gmail.com"
CC_EMAIL = "olegmalkov2023@gmail.com"

def load_env():
    """Load environment variables from .env file."""
    env_file = Path(__file__).parent / '.env'
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value.strip('"').strip("'")

def send_report():
    """Send the Sprint 1 report email."""
    load_env()
    
    # Get app password from environment
    app_password = os.getenv('GMAIL_APP_PASSWORD')
    if not app_password:
        print("Error: GMAIL_APP_PASSWORD not found in .env file")
        return False
    
    # Read the email content
    email_file = Path(__file__).parent / 'communications' / '2025-08-06_sprint_1_complete.md'
    with open(email_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract subject from content
    subject = "Отчет Sprint 1 завершен - Готов к тестированию"
    
    # Remove metadata lines from content
    lines = content.split('\n')
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith('## Сводка'):
            body_start = i
            break
    
    body = '\n'.join(lines[body_start:])
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['From'] = SENDER_EMAIL
    msg['To'] = TO_EMAIL
    msg['Cc'] = CC_EMAIL
    msg['Subject'] = subject
    msg['Date'] = datetime.now().strftime('%a, %d %b %Y %H:%M:%S %z')
    
    # Add both plain text and HTML versions
    text_part = MIMEText(body, 'plain', 'utf-8')
    
    # Convert markdown to simple HTML
    html_body = body.replace('\n', '<br>\n')
    html_body = html_body.replace('**', '')
    html_body = html_body.replace('✅', '✅ ')
    html_body = html_body.replace('```bash', '<pre>')
    html_body = html_body.replace('```', '</pre>')
    html_body = f"<html><body style='font-family: Arial, sans-serif;'>{html_body}</body></html>"
    html_part = MIMEText(html_body, 'html', 'utf-8')
    
    msg.attach(text_part)
    msg.attach(html_part)
    
    # Send email
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, app_password)
            
            recipients = [TO_EMAIL, CC_EMAIL]
            server.send_message(msg, from_addr=SENDER_EMAIL, to_addrs=recipients)
            
        print(f"✅ Sprint 1 report sent successfully!")
        print(f"   To: {TO_EMAIL}")
        print(f"   CC: {CC_EMAIL}")
        print(f"   Subject: {subject}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

if __name__ == "__main__":
    success = send_report()
    sys.exit(0 if success else 1)