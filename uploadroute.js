const express = require('express');
const upload = require('./uploadmiddleware');
const UploadController = require('./uploadController');

const router = express.Router();

router.post('/upload', upload.single('file'), UploadController.uploadGSheet)

module.exports = router;