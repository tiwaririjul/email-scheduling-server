const transporter = require("../config/mailConfig");
const Groq = require("groq-sdk");

const sendEmail = async (email, subject, message) => {
  if (!email) {
    throw new Error("Email ID is required to send an email");
  }
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const groq = new Groq({
  apiKey: process.env.GROQ_API,
});

const getGroqChatCompletion = async (question) => {
  console.log();
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `I want to create an email excluding subject on this topic: ${question}. I will be directly copying and pasting this email into my inbox, so please avoid adding any introductory phrases like 'Here is the generated prompt.' The email should be concise, professional (or casual, depending on the context), and relevant to the topic. Please ensure it is ready to send as-is. Let me know if additional details about the audience or purpose would help.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return response; // Ensure the API response is properly returned
  } catch (error) {
    console.error("Error getting Groq chat completion:", error);
    throw new Error("Failed to fetch chat completion from Groq.");
  }
};

module.exports = { sendEmail, getGroqChatCompletion };
