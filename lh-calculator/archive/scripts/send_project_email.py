#!/usr/bin/env python3
"""
Email sender for project communications
Sends to primary contact with CC
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import sys

def send_project_email(to_email, cc_email, subject, content_file, app_password):
    """Send project email via Gmail with CC"""
    
    # Gmail configuration
    sender_email = "olegmalkov2023@gmail.com"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    
    # Read the content
    with open(content_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Cc'] = cc_email
    
    # Create plain text version
    text_part = MIMEText(content, 'plain', 'utf-8')
    msg.attach(text_part)
    
    try:
        # Connect to Gmail
        print(f"Connecting to Gmail SMTP server...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, app_password)
        
        # Send email to both recipients
        recipients = [to_email, cc_email]
        print(f"Sending email to {to_email} with CC to {cc_email}...")
        server.send_message(msg)
        server.quit()
        
        print(f"✅ Email sent successfully!")
        print(f"   To: {to_email}")
        print(f"   CC: {cc_email}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed. Please check your App Password")
        print("   Current password: " + "*" * len(app_password))
        return False
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

def load_env():
    """Load environment variables from .env file"""
    env_vars = {}
    try:
        with open('.env', 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
    except FileNotFoundError:
        pass
    return env_vars

if __name__ == "__main__":
    # Load from .env
    env = load_env()
    
    # Get app password from .env (remove any spaces)
    app_password = env.get('GMAIL_APP_PASSWORD', '').strip().replace(' ', '')
    
    if not app_password:
        print("❌ No GMAIL_APP_PASSWORD found in .env file")
        sys.exit(1)
    
    # Project contacts
    to_email = "a1538800@gmail.com"  # Alex
    cc_email = "olegmalkov2023@gmail.com"  # Oleg (CC)
    
    # Email details - Critical Fix Complete with unique title
    subject = "🔧 Исправлена ошибка 1.8 млрд → теперь корректные расчеты"
    content_file = "communications/2025-08-07_critical_fix_complete.md"
    
    # Send email
    print(f"Sending Sprint 1 clarification email...")
    success = send_project_email(to_email, cc_email, subject, content_file, app_password)
    
    if success:
        # Log the email
        with open('communications/email_log.md', 'a') as log:
            log.write(f"\n\n## {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
            log.write(f"- **Status**: ✅ Sent via Gmail SMTP\n")
            log.write(f"- **To**: {to_email}\n")
            log.write(f"- **CC**: {cc_email}\n")
            log.write(f"- **Subject**: {subject}\n")