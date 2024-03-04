const express = require('express');
const {
  getImages,
  getImage,
  uploadImages,
  updateImage,
  deleteImage,
} = require('../controllers/images');

const router = express.Router({ mergeParams: true });
const { protect, authorization } = require('../middleware/auth');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route('/')
  .get(protect, getImages)
  .post(protect, upload.single('image'), uploadImages);

router
  .route('/:id')
  .get(protect, getImage)
  .put(
    protect,
    authorization('admin', 'user'),
    upload.single('image'),
    updateImage
  )
  .delete(protect, authorization('admin', 'user'), deleteImage);

module.exports = router;
