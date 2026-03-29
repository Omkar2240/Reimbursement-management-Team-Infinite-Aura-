const { resCode, genRes, errorMessage } = require('../../../config/options');
const CompanyRepository = require('../../../models/repositories/CompanyRepository');

exports.getActiveCompaniesList = async (req, res) => {
  try {
    const { success, data } = await CompanyRepository.getCompanies();
    if (!success) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(genRes(resCode.HTTP_BAD_REQUEST, 'Unable to fetch companies'));
    }

    return res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        rows: data,
        count: data.length,
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
