const {
  genRes,
  resCode,
  errorMessage,
  errorTypes,
} = require('../../../../config/options');
const ContactUsRepository = require('../../../../models/repositories/ContactUsRepository');

exports.getContactUsList = async (req, res) => {
  try {
    const {
      start = 0,
      limit = 10,
      search = '',
      orderBy = 'createdAt',
      orderDirection = 'DESC',
    } = req.query;

    const order = [[orderBy, orderDirection.toUpperCase()]];

    const { message, data } = await ContactUsRepository.getContactUsAndCount({
      start,
      limit,
      search,
      order,
    });

    return res
      .status(resCode.HTTP_OK)
      .json(genRes(resCode.HTTP_OK, { message, data }));
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
