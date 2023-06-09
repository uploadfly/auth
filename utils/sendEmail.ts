import plunk from "../configs/plunk";

const sendEmail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  await plunk.emails.send({
    to,
    subject,
    body,
  });
};

export { sendEmail };
