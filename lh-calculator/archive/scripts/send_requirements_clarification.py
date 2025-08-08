#!/usr/bin/env python3
"""Send requirements clarification email to stakeholders"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from pathlib import Path

# Email configuration
SENDER_EMAIL = "olegmalkov2023@gmail.com"
RECIPIENT_EMAIL = "a1538800@gmail.com"
CC_EMAIL = "olegmalkov2023@gmail.com"

def get_app_password():
    """Get Gmail app password from environment or .env file"""
    app_password = os.environ.get('GMAIL_APP_PASSWORD')
    
    if not app_password:
        env_path = Path(__file__).parent / '.env'
        if env_path.exists():
            with open(env_path, 'r') as f:
                for line in f:
                    if line.startswith('GMAIL_APP_PASSWORD='):
                        app_password = line.split('=', 1)[1].strip().strip('"\'')
                        break
    
    if not app_password:
        raise ValueError("Gmail app password not found")
    
    return app_password

def send_email():
    """Send requirements clarification email with attachment"""
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    msg['Cc'] = CC_EMAIL
    msg['Subject'] = "🔴 СРОЧНО: Требуется уточнение требований - Обнаружены критические пропуски"
    
    # Email body
    body = """
Уважаемый Алекс,

При анализе обратной связи от пользователей мы обнаружили КРИТИЧЕСКИЕ пропуски в реализации калькулятора:

🔴 КРИТИЧЕСКИЕ НАХОДКИ:
1. Отсутствует 40% полей из вкладки "Технолог"
2. ПОЛНОСТЬЮ отсутствуют поля из вкладки "Снабжение" (0% реализовано)
3. Поля давления и температуры перепутаны местами
4. Расчеты стоимости неточны на 40-80% из-за отсутствующих данных

📊 ТЕКУЩЕЕ ПОКРЫТИЕ:
• Вкладка "Технолог": 60% реализовано
• Вкладка "Снабжение": 0% реализовано
• Общее покрытие: ~30% от требуемой функциональности

ОТСУТСТВУЮЩИЕ КРИТИЧЕСКИЕ ПОЛЯ:
• Номер позиции (для идентификации)
• Номер в ОЛ заказчика (для Bitrix24)
• Тип поставки (влияет на цену)
• Материал корпуса (основная статья расходов)
• Глубина вытяжки (геометрия)
• Толщина плакировки (стоимость материалов)
• ВСЕ цены на материалы (сейчас захардкожены)

📎 ПРИЛОЖЕН ДОКУМЕНТ:
"REQUIREMENTS-CLARIFICATION-NEEDED.md" с детальным анализом и вопросами, требующими ответа.

⚠️ БЛОКИРОВКА РАЗРАБОТКИ:
Мы не можем продолжить Sprint 2 (сохранение, экспорт, Bitrix24) без уточнения этих требований.

НЕОБХОДИМЫЕ РЕШЕНИЯ:
1. Какие поля обязательны для добавления?
2. Кто должен иметь доступ к ценам (роли пользователей)?
3. Должны ли цены синхронизироваться с Bitrix24?
4. Приостановить Sprint 2 для исправления пропусков?

Пожалуйста, ознакомьтесь с приложенным документом и предоставьте ответы как можно скорее.

Текущая демо-версия: http://34.88.248.65:10000/
(Внимание: расчеты неточны из-за отсутствующих полей)

С уважением,
Команда разработки LH Calculator
    """
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # Attach the requirements document
    doc_path = Path(__file__).parent / 'reports' / 'REQUIREMENTS-CLARIFICATION-NEEDED.md'
    if doc_path.exists():
        with open(doc_path, 'rb') as f:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename="REQUIREMENTS-CLARIFICATION-NEEDED.md"'
            )
            msg.attach(part)
    
    # Send email
    try:
        app_password = get_app_password()
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, app_password)
            
            recipients = [RECIPIENT_EMAIL, CC_EMAIL]
            server.send_message(msg, SENDER_EMAIL, recipients)
            
        print(f"✅ Requirements clarification email sent successfully!")
        print(f"   To: {RECIPIENT_EMAIL}")
        print(f"   CC: {CC_EMAIL}")
        print(f"   Subject: 🔴 СРОЧНО: Требуется уточнение требований")
        print(f"   Attachment: REQUIREMENTS-CLARIFICATION-NEEDED.md")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

if __name__ == "__main__":
    send_email()