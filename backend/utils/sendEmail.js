import transporter from "../config/email";

export const sendEmail = async (to,subject,text,html)=>{
    try {
        const info = await transporter.sendMail({
            from:`"BuyOn WebApp"<${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html

        });
        console.log("Email Sent...")
    } catch (error) {
        console.log(error.message);
    }
};