const PROXY_CONFIG = {
  '/api': {
    // Set the following line to the address of the API you want to test against:
    target: process.env.METABOLICA_DEV_API_HOST || 'http://localhost',
    secure: false,
    changeOrigin: true
  }
};

module.exports = PROXY_CONFIG;
