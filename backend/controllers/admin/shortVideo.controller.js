const ShortVideo = require("../../models/shortVideo.model");

//import model
const News = require("../../models/news.model");
const User = require("../../models/user.model");

//mongoose
const mongoose = require("mongoose");

//deleteFromStorage
const { deleteFromStorage } = require("../../util/storageHelper");

//private key
const admin = require("../../util/privateKey");

//validate whether an episode requires coins or not
exports.validateEpisodeLock = async (req, res) => {
  try {
    if (!settingJSON) {
      return res
        .status(200)
        .json({ status: false, message: "Setting does not found!" });
    }

    const { episodeNumber } = req.query;

    if (!episodeNumber) {
      return res
        .status(200)
        .json({ success: false, message: "Episode number is required." });
    }

    const episodeNumberInt = parseInt(episodeNumber, 10);
    if (isNaN(episodeNumberInt) || episodeNumberInt < 0) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid episode number." });
    }

    const freeEpisodesForNonVip = settingJSON?.freeEpisodesForNonVip || 0;

    const isLocked = episodeNumberInt > freeEpisodesForNonVip;

    return res.status(200).json({
      success: true,
      message: "Validation completed.",
      isLocked: isLocked,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server error" });
  }
};

// create shortVideo (movie or webseries wise)
exports.createShortVideo = async (req, res) => {
  try {
    if (!settingJSON) {
      await Promise.all([
        req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
        req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
      ]);
      return res.status(200).json({ status: false, message: "Setting does not found!" });
    }

    console.log("Incoming body =>", req.body);

    const {
      movieSeriesId,
      name,
      description,
      videoImage,
      videoUrl,
      duration,
      coin,
    } = req.body;

    const durationOfShorts = settingJSON.durationOfShorts || 30;

    if (
      !movieSeriesId ||
      !name?.trim() ||
      !description?.trim() ||
      !videoImage?.trim() ||
      !videoUrl?.trim() ||
      duration === undefined
    ) {
      await Promise.all([
        req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
        req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
      ]);
      return res.status(200).json({ status: false, message: "Missing required fields." });
    }

    if (durationOfShorts < parseInt(duration)) {
      await Promise.all([
        req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
        req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
      ]);
      return res.status(200).json({
        status: false,
        message: "⚠️ Your video duration exceeds the limit set by the admin.",
      });
    }

    const movieSeriesObjId = new mongoose.Types.ObjectId(movieSeriesId);
    const movieSeries = await News.findById(movieSeriesObjId).select("_id").lean();

    if (!movieSeries) {
      await Promise.all([
        req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
        req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
      ]);
      return res.status(200).json({ status: false, message: "MovieSeries does not found." });
    }

    // ✅ Image handling: only save filename
    let videoImagePath = null;
    if (videoImage) {
      const filename = videoImage.split("/").pop();
      videoImagePath = `/${filename}`;
    }

    // ✅ Video URL handling (same idea)
    let videoFilePath = null;
    if (videoUrl) {
      if (videoUrl.startsWith("https://vz")) {
        // external URL → keep as-is
        videoFilePath = videoUrl;
      } else {
        const filename = videoUrl.split("/").pop();
        videoFilePath = `/${filename}`;
      }
    }

    const shortVideo = new ShortVideo({
      movieSeries: movieSeries._id,
      name,
      description,
      videoImage: videoImagePath,
      videoUrl: videoFilePath,
      coin: coin || 0,
      duration: parseInt(duration),
      releaseDate: Date.now(),
    });

    await shortVideo.save();

    const baseUrl = process.env.WASABI_URL;
    const responseData = shortVideo.toObject();
    responseData.videoImage = responseData.videoImage
      ? `${baseUrl}${responseData.videoImage}`
      : null;

    responseData.videoUrl = responseData.videoUrl?.startsWith("https://vz")
      ? responseData.videoUrl
      : `${baseUrl}${responseData.videoUrl}`;

    res.status(200).json({
      status: true,
      message: "Content created successfully",
      data: responseData,
    });

    // ✅ Send notification to all users
    const users = await User.find({ isBlock: false }).select("_id fcmToken");
    for (const user of users) {
      if (user.fcmToken && user.fcmToken !== null) {
        const adminPromise = await admin;
        const payload = {
          token: user.fcmToken,
          notification: {
            title: "🎬 New Short Video Alert! 🚀",
            body: "🔥 A brand-new short video is live! Tap to watch now and enjoy fresh content. 🎥✨",
          },
          data: {
            type: "NEW_SHORT_VIDEO",
          },
        };

        adminPromise
          .messaging()
          .send(payload)
          .then((response) => {
            console.log(`Notification sent successfully to user ${user._id}:`, response);
          })
          .catch((error) => {
            console.log(`Error sending notification to user ${user._id}:`, error);
          });
      }
    }
  } catch (error) {
    await Promise.all([
      req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
      req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
    ]);
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server error" });
  }
};

// update shortVideo (movie or webseries wise)
exports.updateShortVideo = async (req, res) => {
  try {
    if (!req.body.shortVideoId) {
      await Promise.all([
        req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
        req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
      ]);
      return res.status(200).json({
        status: false,
        message: "The 'shortVideoId' field is required.",
      });
    }

    const shortVideoId = new mongoose.Types.ObjectId(req.body.shortVideoId);
    const durationOfShorts = settingJSON.durationOfShorts || 30;

    const shortVideo = await ShortVideo.findById(shortVideoId);
    if (!shortVideo) {
      await Promise.all([
        req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
        req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
      ]);
      return res.status(200).json({ status: false, message: "ShortVideo not found." });
    }

    if (req?.body?.videoUrl && durationOfShorts < parseInt(req.body.duration)) {
      await Promise.all([
        req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
        req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
      ]);
      return res.status(200).json({
        status: false,
        message: "⏳ Your video duration exceeds the limit set by the admin.",
      });
    }

    // ✅ Handle videoImage update
    if (req?.body?.videoImage) {
      if (shortVideo.videoImage) {
        await deleteFromStorage(shortVideo.videoImage);
      }
      const filename = req.body.videoImage.split("/").pop();
      shortVideo.videoImage = `/${filename}`;
    }

    // ✅ Handle videoUrl update
    if (req?.body?.videoUrl) {
      if (shortVideo.videoUrl && !shortVideo.videoUrl.startsWith("https://vz")) {
        // only delete from storage if it's a Wasabi file
        await deleteFromStorage(shortVideo.videoUrl);
      }

      if (req.body.videoUrl.startsWith("https://vz")) {
        shortVideo.videoUrl = req.body.videoUrl; // external links stay
      } else {
        const filename = req.body.videoUrl.split("/").pop();
        shortVideo.videoUrl = `/${filename}`;
      }
    }

    // Other fields
    shortVideo.name = req.body.name || shortVideo.name;
    shortVideo.description = req.body.description || shortVideo.description;
    shortVideo.duration = parseInt(req.body.duration) || shortVideo.duration;
    shortVideo.coin = req.body.coin || shortVideo.coin;

    await shortVideo.save();

    // ✅ Add base URL for frontend
    const baseUrl = process.env.WASABI_URL || "";
    const responseData = shortVideo.toObject();
    responseData.videoImage = responseData.videoImage
      ? `${baseUrl}${responseData.videoImage}`
      : null;

    responseData.videoUrl = responseData.videoUrl?.startsWith("https://vz")
      ? responseData.videoUrl
      : `${baseUrl}${responseData.videoUrl}`;

    return res.status(200).json({
      status: true,
      message: "ShortVideo updated successfully",
      data: responseData,
    });
  } catch (error) {
    await Promise.all([
      req.body.videoImage ? deleteFromStorage(req.body.videoImage) : Promise.resolve(),
      req.body.videoUrl ? deleteFromStorage(req.body.videoUrl) : Promise.resolve(),
    ]);
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server error" });
  }
};

// fetch shortVideos
exports.fetchShortVideos = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;

    const [totalShortVideos, shortVideos] = await Promise.all([
      ShortVideo.countDocuments(),
      ShortVideo.find()
        .populate("movieSeries", "name")
        .sort({ createdAt: -1 })
        .skip((start - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    // ✅ Add base URL to image & video fields
    const baseUrl = process.env.WASABI_URL || "";

    console.log("baseUrl: ", baseUrl); // Debug log

    const data = shortVideos.map((sv) => ({
      ...sv,
      videoImage: sv.videoImage
        ? `${baseUrl}/admin/newsImages${sv.videoImage}`
        : null,

      videoUrl: sv.videoUrl ? sv.videoUrl.startsWith("https://vz") ? sv.videoUrl : `${baseUrl}/admin/newsVideos${sv.videoUrl}` : null,
    }));

    console.log("shortVideos data: ", data);

    return res.status(200).json({
      status: true,
      message: "Success",
      total: totalShortVideos,
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server error" });
  }
};

//fetch particular movie or webseries wise shortVideos
exports.retrieveMovieSeriesVideoData = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    if (!req.query.movieSeriesId) {
      return res
        .status(200)
        .json({ status: false, message: "Oops! Invalid details." });
    }

    const movieSeriesId = new mongoose.Types.ObjectId(req.query.movieSeriesId);

    const [total, videos] = await Promise.all([
      ShortVideo.countDocuments({
        movieSeries: new mongoose.Types.ObjectId(movieSeriesId),
      }),
      ShortVideo.aggregate([
        {
          $match: {
            movieSeries: new mongoose.Types.ObjectId(movieSeriesId),
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            episodeNumber: 1,
            videoImage: 1,
            videoUrl: 1,
            coin: 1,
            isLocked: 1,
            releaseDate: 1,
            createdAt: 1,
          },
        },
        { $sort: { episodeNumber: 1 } },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]),
    ]);

    // Add base URL
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;
    const updatedVideos = videos.map((video) => ({
      ...video,
      videoImage: video.videoImage
        ? `${baseUrl}/admin/newsImages/${video.videoImage.replace(/^\/+/, "")}`
        : null,
      videoUrl: video.videoUrl?.startsWith("https://vz")
        ? video.videoUrl : `${baseUrl}/admin/newsVideos/${video.videoUrl.replace(/^\/+/, "")}`
    }));

    return res.status(200).json({
      status: true,
      message: "Retrieved videos from a specific movie series.",
      total: total,
      data: updatedVideos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//fetching information about a short video
exports.getShortVideoInfo = async (req, res) => {
  try {
    if (!req.query.shortVideoId) {
      return res.status(200).json({
        status: false,
        message: "The 'shortVideoId' field is required.",
      });
    }

    const shortVideoId = new mongoose.Types.ObjectId(req.query.shortVideoId);

    const shortVideo = await ShortVideo.findById(shortVideoId)
      .select("videoUrl")
      .lean();
    if (!shortVideo) {
      return res
        .status(200)
        .json({ status: false, message: "ShortVideo not found." });
    }

    return res.status(200).json({
      status: true,
      message: "ShortVideo fetched successfully",
      data: shortVideo,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server error" });
  }
};

//delete a short video
exports.removeShortMedia = async (req, res) => {
  try {
    if (!req.query.movieSeriesId || !req.query.shortVideoId) {
      return res.status(200).json({
        status: false,
        message: "The `movieSeriesId` and 'shortVideoId' field is required.",
      });
    }

    const shortVideoId = new mongoose.Types.ObjectId(req.query.shortVideoId);
    const movieSeriesId = new mongoose.Types.ObjectId(req.query.movieSeriesId);
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    const shortVideo = await ShortVideo.findById(shortVideoId)
      .select("episodeNumber videoImage videoUrl")
      .lean();
    if (!shortVideo) {
      return res
        .status(200)
        .json({ status: false, message: "ShortVideo not found." });
    }

    if (shortVideo.episodeNumber == 0) {
      return res
        .status(200)
        .json({ status: false, message: "Trailer cannot be deleted." });
    }

    await Promise.all([
      shortVideo.videoImage ? deleteFromStorage(shortVideo.videoImage) : null,
      shortVideo.videoUrl ? deleteFromStorage(shortVideo.videoUrl) : null,
      ShortVideo.deleteOne({ _id: shortVideoId }),
    ]);

    const freeEpisodesLimit = settingJSON.freeEpisodesForNonVip || 5;
    const remainingEpisodes = await ShortVideo.find({
      movieSeries: movieSeriesId,
      episodeNumber: { $gt: 0 }, // Exclude Trailer (episodeNumber: 0)
    })
      .sort("episodeNumber")
      .select("_id episodeNumber")
      .lean();

    for (let i = 0; i < remainingEpisodes.length; i++) {
      const newEpisodeNumber = i + 1;
      const isLocked = newEpisodeNumber > freeEpisodesLimit;
      const coin = isLocked ? 10 : 0;

      await ShortVideo.findByIdAndUpdate(remainingEpisodes[i]._id, {
        episodeNumber: newEpisodeNumber,
        isLocked,
        coin,
      });
    }

    const videos = await ShortVideo.aggregate([
      {
        $match: {
          movieSeries: new mongoose.Types.ObjectId(movieSeriesId),
        },
      },
      {
        $project: {
          _id: 1,
          episodeNumber: 1,
          videoImage: 1,
          videoUrl: 1,
          coin: 1,
          isLocked: 1,
          releaseDate: 1,
          createdAt: 1,
        },
      },
      { $sort: { episodeNumber: 1 } },
      { $skip: (start - 1) * limit },
      { $limit: limit },
    ]);

    res.status(200).json({
      status: true,
      message: "ShortVideo deleted successfully, and episode numbers updated.",
      videos,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//handles moving an episode to a different position in the sequence and adjusts the episode numbers and lock status accordingly
exports.editShortVideo = async (req, res) => {
  try {
    if (
      !req.query.movieSeriesId ||
      !req.query.shortVideoId ||
      !req.query.newEpisodePosition
    ) {
      return res.status(200).json({
        status: false,
        message:
          "The `movieSeriesId`, 'shortVideoId', and 'newEpisodePosition' fields are required.",
      });
    }

    const shortVideoId = new mongoose.Types.ObjectId(req.query.shortVideoId);
    const movieSeriesId = new mongoose.Types.ObjectId(req.query.movieSeriesId);
    const newEpisodePosition = parseInt(req.query.newEpisodePosition, 10);

    const shortVideo = await ShortVideo.findById(shortVideoId)
      .select("episodeNumber videoImage videoUrl isLocked coin")
      .lean();
    if (!shortVideo) {
      return res
        .status(200)
        .json({ status: false, message: "ShortVideo not found." });
    }

    if (shortVideo.episodeNumber === 0) {
      return res
        .status(200)
        .json({ status: false, message: "Trailers cannot be moved." });
    }

    const freeEpisodesLimit = settingJSON.freeEpisodesForNonVip || 2;

    let remainingEpisodes = await ShortVideo.find({
      movieSeries: movieSeriesId,
      episodeNumber: { $gt: 0 }, // Exclude trailer
    })
      .sort("episodeNumber")
      .select("_id episodeNumber coin isLocked videoImage videoUrl")
      .lean();

    let freeEpisodes = remainingEpisodes.filter((ep) => ep.coin === 0); // Free episodes
    let paidEpisodes = remainingEpisodes.filter((ep) => ep.coin > 0); // Paid episodes

    freeEpisodes = freeEpisodes.slice(0, freeEpisodesLimit);
    remainingEpisodes = [...freeEpisodes, ...paidEpisodes];

    const episodeIndex = remainingEpisodes.findIndex(
      (e) => e._id.toString() === shortVideoId.toString()
    );
    const episodeToMoveObj = remainingEpisodes[episodeIndex];

    remainingEpisodes.splice(episodeIndex, 1);
    remainingEpisodes.splice(newEpisodePosition - 1, 0, episodeToMoveObj);

    for (let i = 0; i < remainingEpisodes.length; i++) {
      const newEpisodeNumber = i + 1;
      const isLocked = newEpisodeNumber > freeEpisodesLimit;
      const coin = isLocked
        ? remainingEpisodes[i].coin === 0
          ? 10
          : remainingEpisodes[i].coin
        : 0;

      await ShortVideo.findByIdAndUpdate(remainingEpisodes[i]._id, {
        isLocked,
        coin,
        episodeNumber: newEpisodeNumber,
        videoImage: remainingEpisodes[i].videoImage,
        videoUrl: remainingEpisodes[i].videoUrl,
      });
    }

    return res.status(200).json({
      status: true,
      message:
        "ShortVideo updated successfully, and episode positions preserved correctly.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};
