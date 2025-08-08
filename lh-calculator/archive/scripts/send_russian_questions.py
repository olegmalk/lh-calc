#!/usr/bin/env python3
"""Отправка вопросов на русском языке"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from pathlib import Path

# Конфигурация email
SENDER_EMAIL = "olegmalkov2023@gmail.com"
RECIPIENT_EMAIL = "a1538800@gmail.com"
CC_EMAIL = "olegmalkov2023@gmail.com"

def get_app_password():
    """Получить пароль приложения Gmail"""
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
        raise ValueError("Пароль приложения Gmail не найден")
    
    return app_password

def send_email():
    """Отправить email с вопросами"""
    
    # Создание сообщения
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    msg['Cc'] = CC_EMAIL
    msg['Subject'] = "Срочные вопросы по калькулятору - требуются ответы для продолжения"
    
    # Тело письма
    body = """Уважаемый Александр,

После детального анализа Excel файла и обратной связи от пользователей, мы обнаружили, что в текущей реализации отсутствует около 70% необходимых полей ввода.

ОБНАРУЖЕННЫЕ ПРОБЛЕМЫ:
• Отсутствует 6 критических полей из вкладки "Технолог"
• ПОЛНОСТЬЮ отсутствуют все поля из вкладки "Снабжение" (цены захардкожены)
• Поля давления и температуры перепутаны местами
• Без этих полей расчёты неточны на 40-80%

Для продолжения разработки нам необходимы ответы на приложенные вопросы.

КРИТИЧЕСКИ ВАЖНО:
1. Какие поля обязательны для добавления?
2. Кто должен иметь доступ к редактированию цен?
3. Какие данные должны синхронизироваться с Битрикс24?
4. Приостановить ли Sprint 2 для исправления недостающих полей?

В приложении документ "ВОПРОСЫ-ТРЕБУЮЩИЕ-ОТВЕТА.md" с конкретными вопросами.
Пожалуйста, отметьте галочками нужные пункты и отправьте обратно.

Разработка приостановлена до получения ваших ответов.

Текущая версия калькулятора: http://34.88.248.65:10000/
(Внимание: расчёты неточны из-за отсутствующих полей)

С уважением,
Команда разработки"""
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # Приложение документа с вопросами
    doc_path = Path(__file__).parent / 'reports' / 'ВОПРОСЫ-ТРЕБУЮЩИЕ-ОТВЕТА.md'
    if doc_path.exists():
        with open(doc_path, 'rb') as f:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename="ВОПРОСЫ-ТРЕБУЮЩИЕ-ОТВЕТА.md"'
            )
            msg.attach(part)
    
    # Отправка email
    try:
        app_password = get_app_password()
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, app_password)
            
            recipients = [RECIPIENT_EMAIL, CC_EMAIL]
            server.send_message(msg, SENDER_EMAIL, recipients)
            
        print(f"✅ Email с вопросами успешно отправлен!")
        print(f"   Кому: {RECIPIENT_EMAIL}")
        print(f"   Копия: {CC_EMAIL}")
        print(f"   Тема: Срочные вопросы по калькулятору")
        print(f"   Приложение: ВОПРОСЫ-ТРЕБУЮЩИЕ-ОТВЕТА.md")
        print(f"   Время: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка отправки: {e}")
        return False

if __name__ == "__main__":
    send_email()