#!/usr/bin/env python3
"""
Email sender for Sprint plans and project updates
Configure with your Gmail App Password
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import sys

def send_sprint_email(recipient_email, app_password):
    """Send Sprint 1 plan via Gmail"""
    
    # Gmail configuration
    sender_email = "olegmalkov2023@gmail.com"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    
    # Read the sprint plan
    with open('sprint1_plan_email.md', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Sprint 1 Plan - LH Calculator ({datetime.now().strftime("%Y-%m-%d")})'
    msg['From'] = sender_email
    msg['To'] = recipient_email
    
    # Create plain text version
    text_part = MIMEText(content, 'plain', 'utf-8')
    
    # Create HTML version
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            h1 {{ color: #2c3e50; }}
            h2 {{ color: #34495e; }}
            h3 {{ color: #7f8c8d; }}
            code {{ background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }}
            pre {{ background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }}
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            .russian {{ background-color: #f0f8ff; padding: 10px; margin: 10px 0; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <h1>🚀 LH Calculator - Sprint 1 Development Plan</h1>
        <p><strong>Project:</strong> Heat Exchanger Cost Calculation System</p>
        <p><strong>Duration:</strong> August 6-20, 2025</p>
        <p><strong>Development Server:</strong> <a href="http://34.88.248.65:10000/">http://34.88.248.65:10000/</a></p>
        <hr>
        {content.replace('# ', '<h1>').replace('## ', '<h2>').replace('### ', '<h3>').replace('```', '<pre>').replace('```', '</pre>').replace('✅', '✓')}
    </body>
    </html>
    """
    html_part = MIMEText(html_content, 'html', 'utf-8')
    
    # Attach parts
    msg.attach(text_part)
    msg.attach(html_part)
    
    try:
        # Connect to Gmail
        print(f"Connecting to Gmail SMTP server...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, app_password)
        
        # Send email
        print(f"Sending email to {recipient_email}...")
        server.send_message(msg)
        server.quit()
        
        print(f"✅ Email sent successfully to {recipient_email}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed. Please check your App Password")
        print("   Generate one at: https://myaccount.google.com/apppasswords")
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
    # Load from .env first
    env = load_env()
    
    # Check for app password (command line overrides .env)
    if len(sys.argv) > 1:
        app_password = sys.argv[1].replace(" ", "")
    elif 'GMAIL_APP_PASSWORD' in env:
        app_password = env['GMAIL_APP_PASSWORD'].replace(" ", "")
        print("Using App Password from .env file")
    else:
        print("Usage: python3 send_email.py [app_password]")
        print("\nApp Password can be provided via:")
        print("1. Command line: python3 send_email.py 'xxxx xxxx xxxx xxxx'")
        print("2. .env file: GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx")
        print("\nTo get an App Password:")
        print("  Go to https://myaccount.google.com/apppasswords")
        sys.exit(1)
    
    # Get recipient (default to self)
    recipient = sys.argv[2] if len(sys.argv) > 2 else env.get('GMAIL_ADDRESS', 'olegmalkov2023@gmail.com')
    
    # Send email
    send_sprint_email(recipient, app_password)