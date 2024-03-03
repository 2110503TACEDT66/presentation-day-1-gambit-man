const Image = require('../models/Image');
const axios = require('axios');

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id });

    if (!images || images.length === 0) {
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
    req.body.user = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const imgurResponses = [];

    for (const file of req.files) {
      console.log('File details:', file);

      if (!file.buffer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file format',
        });
      }

      const base64Image = file.buffer.toString('base64');

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

      if (imgurResponse.data.success) {
        console.log('Imgur upload successful:', imgurResponse.data.data.link);

        const image = await Image.create({
          imgurLink: imgurResponse.data.data.link,
          user: req.body.user,
        });

        imgurResponses.push(image);
      } else {
        console.error('Imgur upload failed:', imgurResponse.data);
        return res.status(500).json({
          success: false,
          message: 'Imgur upload failed',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: imgurResponses,
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
    req.body.user = req.user.id;

    const existingImage = await Image.findById(req.params.id);

    if (!existingImage) {
      return res.status(400).json({
        success: false,
        message: 'Image not found',
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

    if (!imgurResponse.data.success) {
      res.status(500).json({
        success: false,
        message: 'Imgur upload failed',
      });
    }

    const image = await Image.findByIdAndUpdate(
      req.params.id,
      {
        imgurLink: imgurResponse.data.data.link,
        user: req.body.user,
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
