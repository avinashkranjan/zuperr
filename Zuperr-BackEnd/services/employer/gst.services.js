const axios = require("axios");

const GSTIN_API_KEY = "097db19a1663f4f538b5e5a822664714";

const verifyGST = async (gstNumber) => {
  try {
    const url = `https://sheet.gstincheck.co.in/check/${GSTIN_API_KEY}/${gstNumber}`;
    const { data } = await axios.get(url);

    if (data.flag && data.data?.sts === "Active") {
      return {
        success: true,
        message: "GST is valid and active",
        gstDetails: data.data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Invalid GST",
      };
    }
  } catch (error) {
    console.error("GST API error:", error?.response?.data || error.message);
    return {
      success: false,
      message: "GST verification failed",
    };
  }
};

module.exports = { verifyGST };
