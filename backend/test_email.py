import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

sender_email = os.getenv("SMTP_EMAIL", "dropoffanalytics@gmail.com")
sender_password = os.getenv("SMTP_PASSWORD", "")
smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
smtp_port = int(os.getenv("SMTP_PORT", 587))

print(f"Using email: {sender_email}")
print(f"Password configured: {'Yes' if sender_password else 'No'} (length: {len(sender_password)})")

msg = MIMEMultipart()
msg['From'] = sender_email
msg['To'] = sender_email
msg['Subject'] = "Test Email from Hospital System"

body = "This is a test email to verify SMTP configuration."
msg.attach(MIMEText(body, 'plain'))

try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.set_debuglevel(1)  # Enable debug output
    server.starttls()
    server.login(sender_email, sender_password)
    server.send_message(msg)
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
