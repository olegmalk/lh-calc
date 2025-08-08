#!/usr/bin/env python3
"""
Send test data collection form to client
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from datetime import datetime

def send_test_form_email(recipient_email, app_password):
    """Send test data collection form to client"""
    
    sender_email = "olegmalkov2023@gmail.com"
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = "LH Calculator - Форма сбора тестовых данных / Test Data Collection Form"
    
    # Email body
    body = """
Уважаемый клиент,

Для проверки точности веб-приложения LH Calculator нам необходимо собрать тестовые данные из вашего Excel файла.

Мы подготовили специальную форму, которая использует точно такие же названия полей и структуру, как в вашем Excel файле "Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7".

ЧТО НУЖНО СДЕЛАТЬ:
1. Откройте приложенную форму CLIENT_DATA_COLLECTION_FORM_VERIFIED.md
2. Выберите 3-5 различных конфигураций теплообменников из вашей практики
3. Для каждой конфигурации заполните:
   - Входные данные (лист "технолог") 
   - Параметры снабжения (лист "снабжение")
   - Ожидаемые результаты (лист "результат")
4. Сохраните заполненную форму и отправьте нам

ВАЖНЫЕ МОМЕНТЫ:
✅ Все названия полей точно соответствуют Excel
✅ Все ссылки на ячейки указаны (D27, E27 и т.д.)
✅ Форма двуязычная (русский/английский) для удобства
✅ Включены все опции из выпадающих списков
✅ Добавлена цветовая схема для понимания ролей

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

Dear Client,

To verify the accuracy of the LH Calculator web application, we need to collect test data from your Excel file.

We have prepared a special form that uses exactly the same field names and structure as your Excel file "Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7".

WHAT TO DO:
1. Open the attached form CLIENT_DATA_COLLECTION_FORM_VERIFIED.md
2. Select 3-5 different heat exchanger configurations from your practice
3. For each configuration, fill in:
   - Input data (технолог sheet)
   - Supply parameters (снабжение sheet)
   - Expected results (результат sheet)
4. Save the completed form and send it back to us

KEY POINTS:
✅ All field names exactly match Excel
✅ All cell references are indicated (D27, E27, etc.)
✅ Form is bilingual (Russian/English) for convenience
✅ All dropdown options are included
✅ Color scheme added for role understanding

This data will allow us to:
- Verify accuracy of all calculations
- Ensure formula correctness
- Validate edge cases
- Guarantee 100% Excel compliance

We recommend testing:
- Minimum configuration (К4-150, 10-50 plates)
- Medium configuration (К4-750, 300-500 plates)
- Maximum configuration (К4-1200, 800-1000 plates)
- Special cases (К4-500*250, К4-1200*600)

С уважением / Best regards,
Команда разработки LH Calculator
Development Team

При возникновении вопросов / For questions:
Email: olegmalkov2023@gmail.com
    """
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # Attach the form file
    form_path = '/home/vmuser/dev/lh_calc/CLIENT_DATA_COLLECTION_FORM_VERIFIED.md'
    if os.path.exists(form_path):
        with open(form_path, 'rb') as file:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(file.read())
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename="CLIENT_DATA_COLLECTION_FORM_VERIFIED.md"'
            )
            msg.attach(part)
    
    # Send email
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.send_message(msg)
            print(f"✅ Test form email sent successfully to {recipient_email}")
            print(f"   Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

if __name__ == "__main__":
    # For testing - replace with actual values
    print("Test Data Collection Form Email Sender")
    print("-" * 40)
    recipient = input("Enter recipient email: ")
    app_pwd = input("Enter Gmail app password: ")
    
    if send_test_form_email(recipient, app_pwd):
        print("\n📧 Form sent successfully!")
        print("Please ask the client to fill and return the form with test data.")
    else:
        print("\n⚠️ Failed to send form. Please check credentials and try again.")