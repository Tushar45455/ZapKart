const forgotPasswordTemplate = ({ name, otp }) => {
    return `
<div style="font-family: Arial, sans-serif; color: #222;">
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your ZapKart account password.</p>
    <p>Please use the following OTP to reset your password:</p>
    <div style="
        background: #fffbe6;
        border: 2px dashed #f7c948;
        border-radius: 8px;
        font-size: 28px;
        padding: 24px 0;
        margin: 24px 0;
        text-align: center;
        font-weight: bold;
        letter-spacing: 4px;
        color: #d48806;">
        ${otp}
    </div>
    <p style="margin-bottom: 24px;">
        <strong>Note:</strong> This OTP is valid for 1 hour. Enter it in the application to reset your password.
    </p>
    <p>Thank you for using ZapKart!</p>
    <p style="margin-top: 32px;">Best regards,<br/>The ZapKart Team</p>
</div>
    `;
};

export default forgotPasswordTemplate;