const Image = require('../models/Image');
const axios = require('axios');

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();

    if (!images) {
      return res.status(400).json({
        success: false,
        message: 'No images found',
      });
    }

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const existedImage = await Image.findOne({
      user: req.user.id,
    });

    if (existedImage) {
      return res.status(400).json({
        success: false,
        message: 'You have already uploaded an image',
      });
    }

    req.body.user = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    if (!req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format',
      });
    }

    const base64Image = req.file.buffer.toString('base64');

    const imgurResponse = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: base64Image,
      },
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    );

    const image = await Image.create({
      image: imgurResponse.data.data.link,
      user: req.body.user,
    });

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const existingImage = await Image.findById(req.params.id);

    if (!existingImage) {
      return res.status(400).json({
        success: false,
        message: 'Image not found',
      });
    }

    if (
      existingImage.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this image`,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    if (!req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format',
      });
    }

    const base64Image = req.file.buffer.toString('base64');

    const imgurResponse = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: base64Image,
      },
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    );

    const image = await Image.findByIdAndUpdate(
      req.params.id,
      {
        image: imgurResponse.data.data.link,
        user: existingImage.user,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image not found',
      });
    }

    if (image.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this image`,
      });
    }

    await image.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
