const { resCode, genRes, errorMessage } = require('../../../config/options');

exports.getActiveCompaniesList = async (req, res) => {
  try {
    // TODO: replace with DB query once Company model exists
    const companies = [
      {
        id: 1,
        name: 'Example Company',
        status: 'active',
      },
    ];

    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        rows: companies,
        count: companies.length,
      })
    );
  } catch (error) {
    console.error('Error fetching companies', error);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorMessage.SERVER_ERROR)
      );
  }
};
