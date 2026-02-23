import nodemailer from 'nodemailer';

class EmailService {
    private static instance: EmailService;
    private transporter: nodemailer.Transporter | null = null; // initialized later or on demand

    private constructor() {
        // Initialize with default or env vars
        this.init();
    }

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    private init() {
        // In a real app, use environment variables for SMTP config
        // For development/demo without env vars, we can use Ethereal or just log
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            console.log('EmailService: SMTP Transporter initialized');
        } else {
            console.log('EmailService: No SMTP config found. Emails will be logged to console only.');
        }
    }

    public async sendAlertEmail(monitorName: string, monitorUrl: string, status: string, incidentId?: string): Promise<void> {
        const subject = `[Alert] Monitor ${monitorName} is ${status}`;
        const html = `
            <h2>Monitor Alert: ${monitorName}</h2>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>URL:</strong> ${monitorUrl}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            ${incidentId ? `<p><strong>Incident ID:</strong> ${incidentId}</p>` : ''}
            <br/>
            <p>Please check the dashboard for more details.</p>
        `;

        if (this.transporter) {
            try {
                const info = await this.transporter.sendMail({
                    from: process.env.SMTP_FROM || '"API Monitor" <alerts@example.com>',
                    to: process.env.ALERT_EMAIL || 'admin@example.com',
                    subject,
                    html,
                });
                console.log(`Email sent: ${info.messageId}`);
            } catch (error) {
                console.error('Error sending email:', error);
            }
        } else {
            // Fallback logging
            console.log('--- MOCK EMAIL SEND ---');
            console.log(`To: ${process.env.ALERT_EMAIL || 'admin@example.com'}`);
            console.log(`Subject: ${subject}`);
            console.log('Body:', html);
            console.log('-----------------------');
        }
    }
}

export const emailService = EmailService.getInstance();
