import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
            secure: true,
        });
    }

    private getTemplate(filePath: string): string {
        try {
            const baseDir = __dirname.includes('dist')
                ? path.join(process.cwd(), 'dist', 'templates', 'templates')
                : path.join(__dirname, '..', '..', 'templates', 'templates');

            const templatePath = path.join(baseDir, filePath);
            // console.log('Template path:', templatePath);
            return fs.readFileSync(templatePath, 'utf-8');
        } catch (error) {
            console.error('Error reading template file:', error);
            return `<p>Failed to load template</p>`;
        }
    }


    async sendEmail(to: string, subject: string, templateFileName: string, data: { name: string, resetLink: string }) {
        let htmlContent = this.getTemplate(templateFileName);

        // Reemplazar los placeholders en el template con los valores proporcionados
        htmlContent = htmlContent
            .replace(/{{name}}/g, data.name)
            .replace(/{{resetLink}}/g, data.resetLink)
            .replace(/{{year}}/g, new Date().getFullYear().toString());

        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        });
    }

    async sendResetPasswordEmail(to: string, name: string, resetLink: string) {
        await this.sendEmail(to, 'Reset Your Password', 'resetPasswordTemplate.html', { name, resetLink });
    }
}
