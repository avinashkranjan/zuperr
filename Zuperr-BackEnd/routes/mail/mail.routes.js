const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../middleware/auth");
const mailService = require("../../services/mail/mail.service");

/**
 * POST /api/mail/single
 * Send single email
 */
router.post("/single", authenticateToken, async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: to, subject, and (text or html)",
      });
    }
    
    const result = await mailService.sendSingle({ to, subject, text, html });
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/mail/bulk
 * Send bulk emails
 */
router.post("/bulk", authenticateToken, async (req, res) => {
  try {
    const { emails } = req.body;
    
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "emails must be a non-empty array",
      });
    }
    
    const result = await mailService.sendBulk(emails);
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/mail/template
 * Send template-based email
 */
router.post("/template", authenticateToken, async (req, res) => {
  try {
    const { to, template, data } = req.body;
    
    if (!to || !template) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: to, template",
      });
    }
    
    const result = await mailService.sendTemplate({ to, template, data });
    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
