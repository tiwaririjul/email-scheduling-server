const {
  sendEmail,
  getGroqChatCompletion,
} = require("../services/emailService");

const scheduledJobs = {};

const scheduleEmail = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Invalid input." });
  }

  try {
    await sendEmail(email, subject, message);
    console.log(`Email sent to ${email} subject ${subject} message ${message}`);
    delete scheduledJobs[email];
  } catch (error) {
    console.error("Failed to send email:", error);
  }

  res.status(200).json({ success: true, message: "Email Sent successfully" });
};

const generatePrompt = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res
      .status(400)
      .json({ success: false, message: "Question is required." });
  }

  try {
    const chatCompletion = await getGroqChatCompletion(question);

    console.log("chat completion ", chatCompletion);

    const generatedPrompt = chatCompletion?.choices[0]?.message?.content || "";

    if (!generatedPrompt) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to generate prompt." });
    }

    res.status(200).json({ success: true, prompt: generatedPrompt });
  } catch (error) {
    console.error("Failed to generate prompt:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error generating prompt." });
  }
};

module.exports = {
  scheduleEmail,
  generatePrompt,
};
