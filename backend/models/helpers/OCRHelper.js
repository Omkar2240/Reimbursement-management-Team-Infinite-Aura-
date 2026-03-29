const { readFileSync } = require('fs');

const extractExpenseDataFromReceipt = async (filePath) => {
  try {
    const fileBuffer = readFileSync(filePath);
    return {
      success: true,
      data: {
        textPreview: fileBuffer.toString('utf-8', 0, 500),
        amount: null,
        date: null,
        vendor: null,
        description: null,
        note: 'OCR integration placeholder. Replace with OCR provider response.',
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  extractExpenseDataFromReceipt,
};
