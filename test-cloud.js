const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'wfusrnjr',
  api_key: '767938845351567',
  api_secret: 'Nyz6lw5l6q3WYYPy5ZH6yi9i4Bo',
  secure: true
});

async function run() {
  try {
    const result = await cloudinary.uploader.upload('dummy.jpg', { folder: 'mfreuae_listings' });
    console.log("Success:", result.secure_url);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
