import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Blinkit <onboarding@resend.dev>',
            to: sendTo,
            subject,
            html,
        });

        if (error) {
            console.error('Email send error:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('sendEmail exception:', error);
        return null;
    }
};

export default sendEmail;