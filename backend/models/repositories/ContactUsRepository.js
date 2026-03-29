const { ContactUs } = require('../index');
const { successMessage } = require('../../config/options');
const EmailRepository = require('./EmailRepository');
const { Op } = require('sequelize');

exports.getContactUsAndCount = async ({
  start = 0,
  limit = 10,
  search = '',
  order = [['createdAt', 'DESC']],
}) => {
  try {
    const where = {};

    if (search && !['all', 'null', 'undefined'].includes(search)) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { mobileNumber: { [Op.iLike]: `%${search}%` } },
        { message: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await ContactUs.findAndCountAll({
      where,
      offset: Number(start),
      limit: Number(limit),
      order,
    });

    return {
      success: true,
      message: successMessage.DETAIL_MESSAGE('Contact requests'),
      data: {
        rows,
        pagination: {
          totalCount: count,
          start: Number(start),
          limit: Number(limit),
        },
      },
    };
  } catch (error) {
    throw new Error(`Error fetching contact requests: ${error.message}`);
  }
};

exports.createContactUs = async (contactData) => {
  try {
    const { firstName, lastName, email, mobileNumber, message } = contactData;

    // Save to database
    const contactUs = await ContactUs.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      message,
    });

    // Send confirmation email to user
    const emailData = {
      name: `${firstName} ${lastName}`,
      email,
      phone: mobileNumber,
      subject: 'Contact Us Inquiry',
      message,
    };

    await EmailRepository.sendContactUsEmail(emailData);

    return {
      success: true,
      message: successMessage.CREATED_MESSAGE('Contact request'),
      data: contactUs,
    };
  } catch (error) {
    throw new Error(`Error creating contact us: ${error.message}`);
  }
};
