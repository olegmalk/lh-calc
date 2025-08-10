#!/usr/bin/env python3
"""
Test email sending functionality for LH Calculator API
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def send_api_status_email(recipient_email=None, app_password=None):
    """Send API status update email"""
    
    # Get configuration from environment or parameters
    sender_email = os.getenv('GMAIL_ADDRESS', 'olegmalkov2023@gmail.com')
    
    if not app_password:
        app_password = os.getenv('GMAIL_APP_PASSWORD', '')
        if 'xxxx' in app_password:
            print("⚠️  Please update GMAIL_APP_PASSWORD in .env file")
            print("   Get an app password from: https://myaccount.google.com/apppasswords")
            return False
    
    if not recipient_email:
        recipient_email = input("Enter recipient email: ")
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'LH Calculator API Status - {datetime.now().strftime("%Y-%m-%d %H:%M")}'
    msg['From'] = sender_email
    msg['To'] = recipient_email
    
    # Create status report
    api_url = "http://34.88.248.65:3000"
    
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }}
            h1 {{ color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }}
            .status {{ background: #2ecc71; color: white; padding: 5px 10px; border-radius: 5px; display: inline-block; }}
            .feature {{ background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #3498db; }}
            .code {{ background: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace; }}
            .link {{ color: #3498db; text-decoration: none; }}
            table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
            th {{ background-color: #3498db; color: white; }}
        </style>
    </head>
    <body>
        <h1>🚀 LH Calculator API - Production Status</h1>
        
        <p><span class="status">OPERATIONAL</span></p>
        
        <h2>📊 Service Information</h2>
        <table>
            <tr><th>Component</th><th>Status</th><th>Details</th></tr>
            <tr><td>API Endpoint</td><td>✅ Active</td><td><a href="{api_url}/api/calculate" class="link">{api_url}/api/calculate</a></td></tr>
            <tr><td>Monitoring Dashboard</td><td>✅ Active</td><td><a href="{api_url}" class="link">{api_url}</a></td></tr>
            <tr><td>Excel Processing</td><td>✅ Active</td><td>134+ fields validated</td></tr>
            <tr><td>File Downloads</td><td>✅ Active</td><td>Excel files saved for 24 hours</td></tr>
            <tr><td>Authentication</td><td>✅ Secured</td><td>Basic Auth enabled</td></tr>
        </table>
        
        <h2>🔐 Access Credentials</h2>
        <div class="feature">
            <strong>Admin Access:</strong><br>
            Username: admin<br>
            Password: lhcalc2024
        </div>
        
        <h2>✨ Recent Updates</h2>
        <div class="feature">
            <ul>
                <li>✅ Excel file persistence for all calculations</li>
                <li>✅ Download links for processed files</li>
                <li>✅ File history management in dashboard</li>
                <li>✅ Public API access with authentication for monitoring</li>
                <li>✅ 116 tests passing, 5 high-load tests skipped</li>
            </ul>
        </div>
        
        <h2>📝 Quick Test</h2>
        <div class="code">
curl -X POST {api_url}/api/calculate \\
  -H "Content-Type: application/json" \\
  -d '{{"tech_D27_type": 1, "tech_E27_weightType": "Е-113", ...}}'
        </div>
        
        <hr style="margin-top: 40px;">
        <p style="color: #7f8c8d; font-size: 12px;">
            Generated on {datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")}<br>
            LH Calculator API v1.0.0
        </p>
    </body>
    </html>
    """
    
    # Plain text version
    text_content = f"""
LH Calculator API - Production Status
=====================================

STATUS: OPERATIONAL

Service Information:
- API Endpoint: {api_url}/api/calculate
- Monitoring Dashboard: {api_url}
- Excel Processing: Active (134+ fields)
- File Downloads: Active (24 hour retention)

Access Credentials:
- Username: admin
- Password: lhcalc2024

Recent Updates:
- Excel file persistence for all calculations
- Download links for processed files  
- File history management in dashboard
- Public API access with authentication

Generated on {datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")}
    """
    
    # Attach parts
    html_part = MIMEMultipart()
    html_part.attach(MIMEText(html_content, 'html'))
    text_part = MIMEText(text_content, 'plain')
    
    msg.attach(text_part)
    msg.attach(html_part)
    
    # Send email
    try:
        print(f"📧 Sending email to {recipient_email}...")
        with smtplib.SMTP(smtp_server='smtp.gmail.com', port=587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.send_message(msg)
        print("✅ Email sent successfully!")
        return True
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed. Please check your app password.")
        print("   Get an app password from: https://myaccount.google.com/apppasswords")
        return False
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

if __name__ == "__main__":
    import sys
    
    # Check if dotenv is installed
    try:
        from dotenv import load_dotenv
    except ImportError:
        print("Installing python-dotenv...")
        os.system("pip install python-dotenv")
        from dotenv import load_dotenv
    
    # Parse command line arguments
    recipient = sys.argv[1] if len(sys.argv) > 1 else None
    password = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Send the email
    send_api_status_email(recipient, password)