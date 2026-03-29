const axios = require('axios');

const { errorMessage } = require('../../config/options');

exports.checkGoogleToken = async ({ idToken, googleId }) => {
  try {
    const appLink = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const response = await axios.get(appLink);
    const data = response.data;
    if (!data) {
      return {
        success: false,
        message: errorMessage.INVALID_REQUEST,
      };
    } else if (googleId !== data['sub']) {
      return {
        success: false,
        message: errorMessage.INVALID_REQUEST,
      };
    }
    return {
      success: true,
      message: 'Logged in token correct',
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage.INVALID_REQUEST,
    };
  }
};
