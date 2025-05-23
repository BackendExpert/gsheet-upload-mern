const mongoose = require('mongoose');

const UploadModelSchema = new mongoose.Schema({

});

const UploadModel = mongoose.model('UploadModel', UploadModelSchema);

module.exports = UploadModel;