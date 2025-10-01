const { verifyGST } = require("../../services/employer/gst.services");

const validateGSTController = async (req, res) => {
  const { gstNumber } = req.body;

  if (!gstNumber) {
    return res
      .status(400)
      .json({ success: false, message: "GST number is required" });
  }

  const result = await verifyGST(gstNumber);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
};

module.exports = { validateGSTController };
