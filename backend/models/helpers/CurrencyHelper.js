const axios = require('axios');

const convertCurrency = async (from, to, amount) => {
  if (!from || !to || Number.isNaN(Number(amount))) {
    return { success: false, message: 'Invalid currency conversion input' };
  }

  if (from.toUpperCase() === to.toUpperCase()) {
    return {
      success: true,
      data: {
        amount: Number(amount),
        from,
        to,
        rate: 1,
      },
    };
  }

  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`
  );
  const rate = response?.data?.rates?.[to.toUpperCase()];
  if (!rate) {
    return { success: false, message: 'Conversion rate not found' };
  }

  return {
    success: true,
    data: {
      amount: Number(amount) * rate,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate,
    },
  };
};

module.exports = {
  convertCurrency,
};
