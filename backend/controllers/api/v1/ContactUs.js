const {
  genRes,
  resCode,
  errorMessage,
  errorTypes,
} = require('../../../config/options');
const ContactUsRepository = require('../../../models/repositories/ContactUsRepository');

exports.postContactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, message } = req.body;

    const { success, message: repoMessage } =
      await ContactUsRepository.createContactUs({
        firstName,
        lastName,
        email,
        mobileNumber,
        message,
      });

    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, repoMessage));
    }

    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        message:
          'Your message has been sent successfully. We will get back to you soon.',
      })
    );
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          errorMessage.SERVER_ERROR,
          errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};
