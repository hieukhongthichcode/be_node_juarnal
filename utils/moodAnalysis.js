const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function analyzeMood(text) {
  try {
    const response = await axios.post(`${process.env.FLASK_URL}/analyze`, {
      content: text,
    });

    console.log('Kết quả trả về từ Flask:', response.data);

    const mood = response.data;

    if (!mood || typeof mood.label !== 'string') {
      console.error('Dữ liệu trả về không hợp lệ:', mood);
      return { label: 'UNKNOWN', score: 0 };
    }

    const score = parseFloat(mood.score);

    if (isNaN(score)) {
      console.error('Score không hợp lệ:', mood.score);
      return { label: 'UNKNOWN', score: 0 };
    }

    return {
      label: mood.label,
      score: score,
    };
  } catch (error) {
    console.error('Lỗi khi gọi Flask:', error.message);
    return { label: 'UNKNOWN', score: 0 };
  }
}

module.exports = analyzeMood;
