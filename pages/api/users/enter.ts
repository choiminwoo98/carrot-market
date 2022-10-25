import twilio from "twilio";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
const nodemailer = require("nodemailer");

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  var mailOptions = {
    to: process.env.EMAIL_SERVER_USER,
    subject: "Your Carrot Market Verification Email",
    text: `your login token is ${payload}.`,
  };

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `your login token is ${payload}.`,
    // });
  } else if (email) {
    // const email = await transporter.sendMail(
    //   mailOptions,
    //   function (error: any, info: any) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log(info.response);
    //     }
    //   }
    // );
  }
  return res.json({
    ok: true,
  });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });
