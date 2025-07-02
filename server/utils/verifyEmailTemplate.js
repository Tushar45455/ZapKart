const verifyEmailTemplate = ({ name, url }) => {
    return `
<div style="font-family: Arial, sans-serif; color: #222;">
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for registering with <strong>ZapKart</strong>!</p>
    <p>Please verify your email address to activate your account:</p>
    <a href="${url}" 
       style="
            display: inline-block;
            padding: 12px 28px;
            background: #007bff;
            color: #fff;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin: 18px 0;
            font-size: 18px;
        ">
        Verify Email
    </a>
    <p style="margin-top: 24px;">If you did not create a ZapKart account, you can safely ignore this email.</p>
    <p style="margin-top: 32px;">Best regards,<br/>The ZapKart Team</p>
</div>
    `;
};

export default verifyEmailTemplate;