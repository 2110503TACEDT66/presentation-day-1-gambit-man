const express = require('express');
const {
  getImages,
  getImage,
  uploadImages,
  updateImage,
  deleteImage,
} = require('../controllers/images');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route('/')
  .get(protect, getImages)
  .post(protect, upload.array('images', 10), uploadImages);

router
  .route('/:id')
  .get(protect, getImage)
  .put(protect, upload.single('image'), updateImage)
  .delete(protect, deleteImage);

module.exports = router;
