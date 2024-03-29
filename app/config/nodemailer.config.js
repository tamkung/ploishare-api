require("dotenv").config();
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const auth = require("../config/auth.config");

module.exports.sendVerificationEmail = (email) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        secure: false,
        port: 465,
        auth: {
            user: auth.user,
            pass: auth.pass
        },
        pool: true,
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    }));

    const mailOptions = {
        from: '"ปล่อยShare" <noreply@example.com>',
        to: email,
        subject: 'ยืนยัน SCG Email ของคุณ',
        html: `<div class="es-wrapper-color">
        <!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        <v:fill type="tile" color="#fafafa"></v:fill>
    </v:background>
    <![endif]-->
        <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table cellpadding="0" cellspacing="0" class="es-content esd-footer-popover" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" align="center">
                                        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image es-p10t es-p10b" style="font-size: 0px;"><a target="_blank"><img src="https://ayiqmq.stripocdn.email/content/guids/CABINET_67e080d830d87c17802bd9b4fe1c0912/images/55191618237638326.png" alt style="display: block;" width="100"></a></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10b es-m-txt-c">
                                                                                        <h3 style="font-size: 36px; line-height: 100%;">ยืนยันตัวตน SCG Email ของคุณ</h3>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l">
                                                                                        <p>ขอบคุณสำหรับการสมัครใช้บริการเว็บไซต์ "ปล่อยShared" กดปุ่ม "ยืนยันตัวตน" เพื่อดำเนินการเข้าสู่ระบบ</p>
                                                                                    </td>
                                                                                </tr>
                                                                                
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-button es-p10t es-p10b"><span class="es-button-border" style="border-radius: 6px;"><a href="https://ploishare.vercel.app/confirm/${email}" class="es-button" target="_blank" style="background-color: #4CAF50; /* Green */ border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">ยืนยันตัวตน</a></span></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l">
                                                                                        <p>หากการสมัครครั้งนี้ไม่เกี่ยวข้องกับท่านหรือไม่ใช่ท่าน กรุณาตอบกลับ email แล้วระบุว่า "ไม่ใช่ท่าน ฯลฯ" ขอบคุณค่ะ</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.sendForgotPassEmail = (email, token) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        secure: false,
        port: 465,
        auth: {
            user: auth.user,
            pass: auth.pass
        },
        pool: true,
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    }));

    const mailOptions = {
        from: '"ปล่อยShare" <noreply@example.com>',
        to: email,
        subject: 'Reset Password',
        html: `<h3>Reset Password</h3>
        <h3>Hello ${email}</h3>
        <p>Clicking on the following link</p>
        <a href="https://ploishare.vercel.app/${email}"> Click here</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}