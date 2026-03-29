const {
  resCode,
  genRes,
  errorTypes,
  errorMessage,
} = require('../../../config/options');

const {
  generateLocalFileUrl,
} = require('../../../models/helpers/MulterHelper');

exports.postUploadMedia = async (req, res) => {
  try {
    if (req.file) {
      return res.json(
        genRes(resCode.HTTP_OK, {
          data: req.file,
          localUrl: generateLocalFileUrl(req.file.filename),
        })
      );
    }
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

exports.getPostSignedURL = async (req, res) => {
  try {
    const filePath = `uploads/${Date.now()}-${req.query.fileName}`;
    res.status(resCode.HTTP_OK).json(
      genRes(resCode.HTTP_OK, {
        url: generateLocalFileUrl(filePath),
        filePath,
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
