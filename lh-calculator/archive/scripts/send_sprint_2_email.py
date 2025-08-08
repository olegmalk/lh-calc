#!/usr/bin/env python3
"""Send Sprint 2 planning email to stakeholders"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from pathlib import Path

# Email configuration
SENDER_EMAIL = "olegmalkov2023@gmail.com"
RECIPIENT_EMAIL = "a1538800@gmail.com"
CC_EMAIL = "olegmalkov2023@gmail.com"

# Get app password from environment or .env file
def get_app_password():
    # Try environment variable first
    app_password = os.environ.get('GMAIL_APP_PASSWORD')
    
    # Try .env file if not in environment
    if not app_password:
        env_path = Path(__file__).parent / '.env'
        if env_path.exists():
            with open(env_path, 'r') as f:
                for line in f:
                    if line.startswith('GMAIL_APP_PASSWORD='):
                        app_password = line.split('=', 1)[1].strip().strip('"\'')
                        break
    
    if not app_password:
        raise ValueError("Gmail app password not found. Set GMAIL_APP_PASSWORD environment variable or create .env file")
    
    return app_password

def send_email():
    """Send Sprint 2 planning email"""
    
    # Read the email content
    email_file = Path(__file__).parent / 'communications' / '2025-08-07_sprint_2_plan.md'
    with open(email_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the email body (skip the header)
    lines = content.split('\n')
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith('## Резюме'):
            body_start = i
            break
    
    email_body = '\n'.join(lines[body_start:])
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    msg['Cc'] = CC_EMAIL
    msg['Subject'] = "Sprint 2 План: Финальная фаза калькулятора - Упрощенный подход"
    
    # Convert markdown to simple text (keeping structure)
    text_content = email_body.replace('**', '').replace('`', '').replace('###', '\n').replace('##', '\n')
    
    # Create HTML version with better formatting
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            h2 {{ color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }}
            h3 {{ color: #34495e; margin-top: 20px; }}
            code {{ background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }}
            pre {{ background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }}
            ul {{ margin: 10px 0; }}
            li {{ margin: 5px 0; }}
            .warning {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }}
            .success {{ background: #d4edda; border-left: 4px solid #28a745; padding: 10px; margin: 15px 0; }}
            .info {{ background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 10px; margin: 15px 0; }}
            .critical {{ background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 15px 0; }}
        </style>
    </head>
    <body>
        <h2>Резюме</h2>
        <p>После тщательного анализа требований и обнаружения критической необходимости интеграции с Bitrix24 (файл Excel буквально называется "ДЛЯ БИТРИКС"), мы пересмотрели архитектуру и существенно упростили план Sprint 2.</p>
        
        <div class="success">
            <h2>✅ Sprint 1 Завершен</h2>
            <ul>
                <li><strong>Движок расчета</strong>: 962 формулы работают идеально</li>
                <li><strong>Веб-интерфейс</strong>: Чистый, отзывчивый дизайн</li>
                <li><strong>Валидация</strong>: Все параметры проверяются</li>
                <li><strong>Локализация</strong>: Поддержка RU/EN</li>
                <li><strong>Тестирование</strong>: 100% покрытие</li>
            </ul>
            <p><strong>Демо</strong>: <a href="http://34.88.248.65:10000/">http://34.88.248.65:10000/</a></p>
        </div>
        
        <h2>📋 Sprint 2: Что будем делать (10 дней)</h2>
        
        <h3>Упрощенная архитектура (БЕЗ базы данных!)</h3>
        <p>Мы отказались от сложной архитектуры (PostgreSQL, Prisma, tRPC) в пользу простого решения:</p>
        <pre>Только Frontend + localStorage + Bitrix24 API</pre>
        
        <h3>План работ по дням</h3>
        
        <h4>Неделя 1 (5 дней):</h4>
        <ul>
            <li><strong>Дни 1-3: Сохранение/Загрузка</strong>
                <ul>
                    <li>localStorage для хранения расчетов</li>
                    <li>Автосохранение при завершении расчета</li>
                    <li>Сохранение с произвольным именем</li>
                    <li>Страница сохраненных расчетов</li>
                    <li>Поиск и удаление расчетов</li>
                </ul>
            </li>
            <li><strong>Дни 4-5: Экспорт в Excel</strong>
                <ul>
                    <li>Генерация .xlsx файла (3 листа: Технолог, Снабжение, Результат)</li>
                    <li>Формат точно соответствует оригинальному шаблону</li>
                    <li>Прямая загрузка в браузере</li>
                </ul>
            </li>
        </ul>
        
        <h4>Неделя 2 (5 дней):</h4>
        <ul>
            <li><strong>Дни 6-7: Организация проектов</strong>
                <ul>
                    <li>Группировка расчетов по проектам/клиентам</li>
                    <li>Фильтрация по проектам</li>
                    <li>Простое управление проектами</li>
                </ul>
            </li>
            <li><strong>Дни 8-9: Интеграция с Bitrix24</strong> ⚠️
                <ul>
                    <li>Экспорт расчетов в CRM как сделки</li>
                    <li>Маппинг всех полей калькулятора на поля Bitrix24</li>
                    <li>Обработка ошибок и повторные попытки</li>
                </ul>
            </li>
            <li><strong>День 10: Тестирование и развертывание</strong>
                <ul>
                    <li>Финальное тестирование</li>
                    <li>Исправление ошибок</li>
                    <li>Развертывание и обучение</li>
                </ul>
            </li>
        </ul>
        
        <div class="info">
            <h2>🔑 Ключевые преимущества упрощенного подхода</h2>
            <ol>
                <li><strong>Скорость</strong>: 2 недели вместо 2 месяцев</li>
                <li><strong>Простота</strong>: Нет базы данных, нет бэкенда</li>
                <li><strong>Надежность</strong>: Меньше компонентов = меньше проблем</li>
                <li><strong>Стоимость</strong>: Нет затрат на инфраструктуру БД</li>
                <li><strong>Обслуживание</strong>: Минимальная поддержка</li>
            </ol>
        </div>
        
        <div class="warning">
            <h2>⚠️ Что нужно от вас</h2>
            
            <h3>Для интеграции с Bitrix24 (к 8-му дню):</h3>
            <ol>
                <li><strong>Webhook URL</strong> вашего Bitrix24</li>
                <li><strong>Токен доступа</strong> или учетные данные</li>
                <li><strong>ID кастомных полей</strong> (UF_*) для маппинга</li>
                <li><strong>Тип сущности</strong>: Сделка (Deal) или Лид (Lead)?</li>
            </ol>
            
            <h4>Пример конфигурации:</h4>
            <pre>{{
  webhookUrl: "https://company.bitrix24.ru/rest/1/token/",
  entity: "deal",
  fields: {{
    TITLE: "Расчет теплообменника",
    OPPORTUNITY: "Сумма",
    UF_EQUIPMENT_TYPE: "Типоразмер",
    // ... другие поля
  }}
}}</pre>
        </div>
        
        <h2>📊 Метрики успеха</h2>
        <ul>
            <li>Сохранение/загрузка: &lt; 50мс</li>
            <li>Экспорт в Excel: &lt; 2 сек</li>
            <li>Экспорт в Bitrix24: &lt; 5 сек</li>
            <li>Экономия времени: &gt; 50%</li>
        </ul>
        
        <div class="critical">
            <h2>🚨 Важное открытие</h2>
            <p>Мы обнаружили, что изначально планировали сложную архитектуру с базой данных, но <strong>полностью упустили</strong> главное требование из PRD - интеграцию с Bitrix24! Файл Excel буквально называется "ДЛЯ БИТРИКС".</p>
            <p>Теперь это исправлено, и интеграция с CRM является приоритетом.</p>
        </div>
        
        <h2>📅 Следующие шаги</h2>
        <ol>
            <li><strong>Сегодня</strong>: Начинаем разработку функций сохранения</li>
            <li><strong>День 3</strong>: Готова функция сохранения/загрузки для тестирования</li>
            <li><strong>День 5</strong>: Готов экспорт в Excel для тестирования</li>
            <li><strong>День 7</strong>: Нужны учетные данные Bitrix24</li>
            <li><strong>День 10</strong>: Полное решение готово к работе</li>
        </ol>
        
        <h2>Контакты</h2>
        <p>При любых вопросах обращайтесь:</p>
        <ul>
            <li>Email: olegmalkov2023@gmail.com</li>
            <li>Проект: <a href="http://34.88.248.65:10000/">http://34.88.248.65:10000/</a></li>
        </ul>
        
        <hr>
        <p>С уважением,<br>
        Команда разработки LH Calculator</p>
    </body>
    </html>
    """
    
    # Attach parts
    part1 = MIMEText(text_content, 'plain', 'utf-8')
    part2 = MIMEText(html_content, 'html', 'utf-8')
    
    msg.attach(part1)
    msg.attach(part2)
    
    # Send email
    try:
        app_password = get_app_password()
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, app_password)
            
            # Send to both recipient and CC
            recipients = [RECIPIENT_EMAIL, CC_EMAIL]
            server.send_message(msg, SENDER_EMAIL, recipients)
            
        print(f"✅ Email sent successfully!")
        print(f"   To: {RECIPIENT_EMAIL}")
        print(f"   CC: {CC_EMAIL}")
        print(f"   Subject: Sprint 2 План: Финальная фаза калькулятора - Упрощенный подход")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

if __name__ == "__main__":
    send_email()