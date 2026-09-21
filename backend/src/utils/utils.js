function generateOtp()
{
   return Math.floor(10000+Math.random()*900000).toString();
}


function getOtpHtml(otp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
    ">

      <div style="
        max-width: 500px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">

        <h2 style="
          text-align: center;
          color: #333333;
        ">
          Email Verification
        </h2>

        <p style="
          color: #555555;
          font-size: 16px;
        ">
          Hello,
        </p>

        <p style="
          color: #555555;
          font-size: 16px;
        ">
          Thank you for registering with us. Please use the OTP below
          to verify your email address.
        </p>

        <div style="
          text-align: center;
          margin: 30px 0;
        ">
          <span style="
            display: inline-block;
            background-color: #f1f5ff;
            color: #2563eb;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 15px 25px;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="
          color: #777777;
          font-size: 14px;
          text-align: center;
        ">
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="
          color: #777777;
          font-size: 14px;
        ">
          If you did not request this verification code, please ignore
          this email.
        </p>

        <hr style="
          border: none;
          border-top: 1px solid #eeeeee;
          margin: 25px 0;
        ">

        <p style="
          text-align: center;
          color: #999999;
          font-size: 12px;
        ">
          © 2026 Your Application. All rights reserved.
        </p>

      </div>

    </body>
    </html>
  `;
}


module.exports={generateOtp,getOtpHtml};