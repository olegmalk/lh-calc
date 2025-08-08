#!/usr/bin/env python3
"""
Send test data collection form to client (Александр)
All content in Russian, no attachments per requirements
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

def send_test_form_email(app_password):
    """Send test data collection form to Александр"""
    
    sender_email = "olegmalkov2023@gmail.com"
    recipient_email = "a1538800@gmail.com"
    cc_email = "olegmalkov2023@gmail.com"
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Cc'] = cc_email
    msg['Subject'] = "Форма сбора тестовых данных для калькулятора"
    
    # Read the form content
    form_path = '/home/vmuser/dev/lh_calc/CLIENT_DATA_COLLECTION_FORM_VERIFIED.md'
    with open(form_path, 'r', encoding='utf-8') as f:
        form_content = f.read()
    
    # Email body - ALL IN RUSSIAN
    body = f"""Уважаемый Александр,

Для проверки точности веб-приложения калькулятора нам необходимо собрать тестовые данные из вашего Excel файла.

Мы подготовили форму, которая использует точно такие же названия полей и структуру, как в вашем Excel файле "Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7".

ЧТО НУЖНО СДЕЛАТЬ:
1. Выберите 3-5 различных конфигураций теплообменников из вашей практики
2. Для каждой конфигурации заполните:
   - Входные данные (лист "технолог") 
   - Параметры снабжения (лист "снабжение")
   - Ожидаемые результаты (лист "результат")
3. Отправьте заполненную форму обратно

ВАЖНЫЕ МОМЕНТЫ:
✅ Все названия полей точно соответствуют Excel
✅ Все ссылки на ячейки указаны (D27, E27 и т.д.)
✅ Добавлена цветовая схема для понимания ролей
✅ Форма проверена на 100% соответствие Excel

Эти данные позволят нам:
- Проверить точность всех расчетов
- Убедиться в правильности формул
- Валидировать граничные случаи
- Гарантировать 100% соответствие Excel

Рекомендуем протестировать:
- Минимальную конфигурацию (К4-150, 10-50 пластин)
- Среднюю конфигурацию (К4-750, 300-500 пластин)
- Максимальную конфигурацию (К4-1200, 800-1000 пластин)
- Специальные случаи (К4-500*250, К4-1200*600)

---
ФОРМА ДЛЯ ЗАПОЛНЕНИЯ:
---

{form_content}

---

С уважением,
Команда разработки LH Calculator

При возникновении вопросов обращайтесь:
Email: olegmalkov2023@gmail.com
"""
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # Send email
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            
            # Send to both recipient and CC
            recipients = [recipient_email, cc_email]
            server.send_message(msg)
            
            print(f"✅ Форма для тестовых данных отправлена успешно")
            print(f"   Кому: {recipient_email}")
            print(f"   Копия: {cc_email}")
            print(f"   Время: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Log to communications folder
            log_path = f"/home/vmuser/dev/lh_calc/communications/{datetime.now().strftime('%Y-%m-%d')}_test_form_sent.md"
            with open(log_path, 'w', encoding='utf-8') as f:
                f.write(f"""# Отправлена форма сбора тестовых данных

**Дата**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Кому**: Александр <{recipient_email}>
**Копия**: {cc_email}
**Тема**: Форма сбора тестовых данных для калькулятора

## Содержание

Отправлена форма CLIENT_DATA_COLLECTION_FORM_VERIFIED.md для сбора тестовых данных из Excel файла клиента.

Форма включает:
- 3 тестовых сценария для заполнения
- Все поля из листов технолог, снабжение, результат
- Точные названия полей и ссылки на ячейки из Excel
- Рекомендации по тестовым конфигурациям

## Статус

✅ Отправлено успешно
""")
            
            return True
    except Exception as e:
        print(f"❌ Ошибка отправки: {e}")
        return False

if __name__ == "__main__":
    print("Отправка формы сбора тестовых данных")
    print("-" * 40)
    
    # Check for .env file
    env_path = '/home/vmuser/dev/lh_calc/lh-calculator/.env'
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('GMAIL_APP_PASSWORD='):
                    app_pwd = line.split('=')[1].strip()
                    if send_test_form_email(app_pwd):
                        print("\n📧 Форма отправлена успешно!")
                        print("Ожидаем заполненные данные от клиента.")
                    else:
                        print("\n⚠️ Не удалось отправить форму.")
                    break
    else:
        app_pwd = input("Введите Gmail app password: ")
        if send_test_form_email(app_pwd):
            print("\n📧 Форма отправлена успешно!")
            print("Ожидаем заполненные данные от клиента.")
        else:
            print("\n⚠️ Не удалось отправить форму.")