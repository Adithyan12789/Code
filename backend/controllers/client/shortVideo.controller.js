const ShortVideo = require("../../models/shortVideo.model");

//mongoose
const mongoose = require("mongoose");

//import model
const User = require("../../models/user.model");
const LikeHistoryOfVideo = require("../../models/likeHistoryOfVideo.model");
const MovieSeries = require("../../models/news.model");
const History = require("../../models/history.model");
const UserVideoStatus = require("../../models/userVideoStatus.model");

//generate History UniqueId
const {
  generateHistoryUniqueId,
} = require("../../util/generateHistoryUniqueId");

//retrieves all videos from a specific movie series for a user
exports.retrieveMovieSeriesVideosForUser = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const { userId, movieSeriesId } = req.query;

    if (
      !userId ||
      !movieSeriesId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(movieSeriesId)
    ) {
      return res
        .status(200)
        .json({ status: false, message: "Oops! Invalid details." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const movieSeriesObjectId = new mongoose.Types.ObjectId(movieSeriesId);

    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    const [user, totalVideosCount, videos] = await Promise.all([
      User.findOne({ _id: userObjectId })
        .select("_id isBlock coin episodeUnlockAds")
        .lean(),
      ShortVideo.countDocuments({ movieSeries: movieSeriesObjectId }),
      ShortVideo.aggregate([
        { $match: { movieSeries: movieSeriesObjectId } },
        {
          $lookup: {
            from: "movieseries",
            localField: "movieSeries",
            foreignField: "_id",
            as: "movieSeriesDetails",
          },
        },
        { $unwind: "$movieSeriesDetails" },
        { $match: { "movieSeriesDetails.isActive": true } },
        {
          $lookup: {
            from: "likehistoryofvideos",
            localField: "_id",
            foreignField: "videoId",
            as: "likes",
          },
        },
        {
          $lookup: {
            from: "uservideostatuses",
            let: { videoId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$shortVideoId", "$$videoId"] },
                      { $eq: ["$userId", userObjectId] },
                    ],
                  },
                },
              },
            ],
            as: "userVideoStatus",
          },
        },
        {
          $lookup: {
            from: "uservideolists",
            let: { movieSeriesId: movieSeriesObjectId },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", userObjectId] },
                      { $in: ["$$movieSeriesId", "$videos.movieSeries"] },
                    ],
                  },
                },
              },
            ],
            as: "isAddedList",
          },
        },
        {
          $project: {
            _id: 1,
            episodeNumber: 1,
            videoImage: 1,
            videoUrl: 1,
            coin: 1,
            isLocked: {
              $cond: [
                { $gt: [{ $size: "$userVideoStatus" }, 0] },
                { $arrayElemAt: ["$userVideoStatus.isLocked", 0] },
                "$isLocked",
              ],
            },
            "movieSeriesDetails._id": 1,
            "movieSeriesDetails.name": 1,
            "movieSeriesDetails.description": 1,
            "movieSeriesDetails.thumbnail": 1,
            "movieSeriesDetails.maxAdsForFreeView": 1,
            isLike: { $in: [userObjectId, "$likes.userId"] },
            totalLikes: { $size: "$likes" },
            isAddedList: {
              $cond: [{ $eq: [{ $size: "$isAddedList" }, 0] }, false, true],
            },
            totalAddedToList: {
              $size: {
                $filter: {
                  input: "$isAddedList",
                  as: "addedList",
                  cond: { $eq: ["$$addedList.userId", userObjectId] },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: "$movieSeriesDetails._id",
            movieSeriesName: { $first: "$movieSeriesDetails.name" },
            movieSeriesDescription: {
              $first: "$movieSeriesDetails.description",
            },
            movieSeriesThumbnail: { $first: "$movieSeriesDetails.thumbnail" },
            movieSeriesMaxAdsForFreeView: {
              $first: "$movieSeriesDetails.maxAdsForFreeView",
            },
            isAddedList: { $first: "$isAddedList" },
            totalAddedToList: { $first: "$totalAddedToList" },
            videos: { $push: "$$ROOT" },
          },
        },
        { $unwind: "$videos" },
        { $sort: { "videos.episodeNumber": 1 } },
        { $skip: (start - 1) * limit },
        { $limit: limit },
        {
          $group: {
            _id: "$_id",
            movieSeriesName: { $first: "$movieSeriesName" },
            movieSeriesDescription: { $first: "$movieSeriesDescription" },
            movieSeriesThumbnail: { $first: "$movieSeriesThumbnail" },
            movieSeriesMaxAdsForFreeView: { $first: "$movieSeriesMaxAdsForFreeView" },
            isAddedList: { $first: "$isAddedList" },
            totalAddedToList: { $first: "$totalAddedToList" },
            videos: { $push: "$videos" },
          },
        },
        {
          $project: {
            movieSeriesName: 1,
            movieSeriesDescription: 1,
            movieSeriesThumbnail: {
              $concat: [baseUrl, "/admin/NewsChannelPoster","$movieSeriesThumbnail"],
            },
            movieSeriesMaxAdsForFreeView: 1,
            isAddedList: 1,
            totalAddedToList: 1,
            videos: {
              $map: {
                input: "$videos",
                as: "video",
                in: {
                  _id: "$$video._id",
                  episodeNumber: "$$video.episodeNumber",
                  videoImage: { $concat: [baseUrl, "/admin/NewsChannelPoster","$$video.videoImage"] },
                  videoUrl: {
                    $cond: [
                      {
                        $regexMatch: {
                          input: "$$video.videoUrl",
                          regex: /^https:\/\/vz/,
                        },
                      }, // ✅ use $$video
                      "$$video.videoUrl", // keep as-is
                      {
                        $concat: [
                          baseUrl,
                          "/admin/newsVideos",
                          "$$video.videoUrl",
                        ],
                      },
                    ],
                  },
                  isLocked: "$$video.isLocked",
                  coin: "$$video.coin",
                  isLike: "$$video.isLike",
                  totalLikes: "$$video.totalLikes",
                },
              },
            },
          },
        },
      ]),
    ]);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    if (user.isBlock)
      return res
        .status(200)
        .json({ status: false, message: "You are blocked by admin." });

    const episodeUnlockAds = user.episodeUnlockAds.find(
      (ads) =>
        ads?.movieWebseriesId?.toString() === movieSeriesObjectId?.toString()
    );

    console.log("First Video from retrieveMovieSeriesVideosForUser: ", videos[0]);

    return res.status(200).json({
      status: true,
      message: "Retrieved videos from a specific movie series for the user.",
      userInfo: {
        coin: user.coin || 0,
        episodeUnlockAds: episodeUnlockAds ? episodeUnlockAds.count : 0,
      },
      totalVideosCount,
      data: videos[0] || null,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        status: false,
        message: error.message || "Internal Server Error",
      });
  }
};

// Retrieve only trailer videos with total counts grouped by their associated movie series
exports.getVideosGroupedByMovieSeries = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(200)
        .json({ status: false, message: "Oops! Invalid details." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    const [user, groupedVideos] = await Promise.all([
      User.findOne({ _id: userObjectId }).select("_id isBlock").lean(),
      ShortVideo.aggregate([
        // Sort first so $group picks the earliest video for each series
        { $sort: { createdAt: 1 } }, // or use { _id: 1 } if createdAt doesn't exist
        {
          $lookup: {
            from: "movieseries",
            localField: "movieSeries",
            foreignField: "_id",
            as: "movieSeriesDetails",
          },
        },
        { $unwind: "$movieSeriesDetails" },
        { $match: { "movieSeriesDetails.isActive": true } },

        // 🧩 Get only the FIRST video of each movieSeries
        {
          $group: {
            _id: "$movieSeriesDetails._id",
            firstVideo: { $first: "$$ROOT" }, // keep the first one
          },
        },

        // 🧩 Lookup for user-specific details
        {
          $lookup: {
            from: "uservideostatuses",
            let: { videoId: "$firstVideo._id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$shortVideoId", "$$videoId"] },
                      { $eq: ["$userId", userObjectId] },
                    ],
                  },
                },
              },
            ],
            as: "userVideoStatus",
          },
        },
        {
          $lookup: {
            from: "uservideolists",
            let: { movieSeriesId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", userObjectId] },
                      { $in: ["$$movieSeriesId", "$videos.movieSeries"] },
                    ],
                  },
                },
              },
            ],
            as: "isAddedList",
          },
        },
        {
          $lookup: {
            from: "likehistoryofvideos",
            localField: "firstVideo._id",
            foreignField: "videoId",
            as: "likes",
          },
        },

        // 🧩 Lookup total videos count per movie series
        {
          $lookup: {
            from: "shortvideos",
            let: { movieSeriesId: "$_id" },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$movieSeries", "$$movieSeriesId"] } },
              },
              { $count: "totalCount" },
            ],
            as: "totalVideosInfo",
          },
        },

        // 🧩 Project final output
        {
          $project: {
            _id: 1,
            movieSeriesName: "$firstVideo.movieSeriesDetails.name",
            movieSeriesDescription: "$firstVideo.movieSeriesDetails.description",
            movieSeriesThumbnail: {
              $concat: [baseUrl, "$firstVideo.movieSeriesDetails.thumbnail"],
            },
            video: {
              _id: "$firstVideo._id",
              videoUrl: {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$firstVideo.videoUrl",
                      regex: /^https:\/\/vz/,
                    },
                  },
                  "$firstVideo.videoUrl",
                  {
                    $concat: [
                      baseUrl,
                      "/admin/newsVideos",
                      "$firstVideo.videoUrl",
                    ],
                  },
                ],
              },
              videoImage: {
                $concat: [baseUrl, "/admin/newsImages", "$firstVideo.videoImage"],
              },
              isLocked: {
                $cond: [
                  { $gt: [{ $size: "$userVideoStatus" }, 0] },
                  { $arrayElemAt: ["$userVideoStatus.isLocked", 0] },
                  "$firstVideo.isLocked",
                ],
              },
              totalLikes: { $size: "$likes" },
              isLike: { $in: [userObjectId, "$likes.userId"] },
            },
            isAddedList: {
              $cond: [{ $eq: [{ $size: "$isAddedList" }, 0] }, false, true],
            },
            totalAddedToList: { $size: "$isAddedList" },
            totalVideos: {
              $ifNull: [
                { $arrayElemAt: ["$totalVideosInfo.totalCount", 0] },
                0,
              ],
            },
          },
        },
        { $sort: { _id: 1 } },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]),
    ]);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    if (user.isBlock)
      return res
        .status(200)
        .json({ status: false, message: "You are blocked by admin." });

    console.log("First grouped video:", groupedVideos[0]);

    return res.status(200).json({
      status: true,
      message: "Retrieved first videos of each movie series successfully.",
      data: groupedVideos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Create or remove like for a video
exports.likeOrDislikeOfVideo = async (req, res) => {
  try {
    const { userId, videoId } = req.query;
    if (
      !userId ||
      !videoId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(videoId)
    ) {
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Invalid details." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const videoObjectId = new mongoose.Types.ObjectId(videoId);

    const [user, video, existingLike] = await Promise.all([
      User.findOne({ _id: userObjectId }).select("_id isBlock").lean(),
      ShortVideo.findById(videoObjectId).select("_id").lean(),
      LikeHistoryOfVideo.findOne({
        userId: userObjectId,
        videoId: videoObjectId,
      }).lean(),
    ]);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    if (user.isBlock)
      return res
        .status(200)
        .json({ status: false, message: "You are blocked by admin." });
    if (!video)
      return res
        .status(200)
        .json({ status: false, message: "Video not found." });

    if (existingLike) {
      await LikeHistoryOfVideo.deleteOne({
        userId: userObjectId,
        videoId: videoObjectId,
      });
      return res
        .status(200)
        .json({
          status: true,
          message: "Video disliked successfully.",
          isLike: false,
        });
    } else {
      await new LikeHistoryOfVideo({
        userId: userObjectId,
        videoId: videoObjectId,
      }).save();
      return res
        .status(200)
        .json({
          status: true,
          message: "Video liked successfully.",
          isLike: true,
        });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        status: false,
        message: error.message || "Internal Server Error",
      });
  }
};

// Watch Ad to unlock a video
exports.viewAdToUnlockVideo = async (req, res) => {
  try {
    const { userId, movieWebseriesId, shortVideoId } = req.query;
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    if (!userId || !movieWebseriesId || !shortVideoId) {
      return res
        .status(200)
        .json({
          status: false,
          message:
            "Invalid request parameters. Please provide all required details.",
        });
    }

    const [user, movieWebseries, shortVideo, userVideoStatus] =
      await Promise.all([
        User.findOne({ _id: userId })
          .select("_id isBlock episodeUnlockAds")
          .lean(),
        MovieSeries.findById(movieWebseriesId)
          .select("_id maxAdsForFreeView thumbnail")
          .lean(),
        ShortVideo.findById(shortVideoId).select("_id videoImage").lean(),
        UserVideoStatus.findOne({ userId, shortVideoId })
          .select("_id isLocked")
          .lean(),
      ]);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User not found!" });
    if (user.isBlock)
      return res
        .status(403)
        .json({
          status: false,
          message:
            "Access denied. Your account has been blocked by the administrator.",
        });
    if (!movieWebseries)
      return res
        .status(200)
        .json({ status: false, message: "MovieSeries not found." });
    if (!shortVideo)
      return res
        .status(200)
        .json({ status: false, message: "ShortVideo not found." });
    if (userVideoStatus && !userVideoStatus.isLocked)
      return res
        .status(200)
        .json({
          status: true,
          message: "Video is already unlocked for this user.",
        });

    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const movieAdData = user?.episodeUnlockAds?.find(
      (ad) => ad?.movieWebseriesId?.toString() === movieWebseriesId.toString()
    );

    if (
      movieAdData &&
      movieAdData.date === today &&
      movieAdData.count >= movieWebseries.maxAdsForFreeView
    ) {
      return res
        .status(200)
        .json({
          status: false,
          message:
            "Daily ad viewing limit reached for this movie. Please try again tomorrow.",
        });
    }

    res.status(200).json({
      status: true,
      message: "Ad successfully watched. The content has been unlocked.",
      movieSeriesThumbnail: movieWebseries.thumbnail
        ? `${baseUrl}${movieWebseries.thumbnail}`
        : null,
      videoImage: shortVideo.videoImage
        ? `${baseUrl}${shortVideo.videoImage}`
        : null,
    });

    await Promise.all([
      User.findOneAndUpdate(
        {
          _id: user._id,
          "episodeUnlockAds.movieWebseriesId": movieWebseriesId,
        },
        {
          $inc: { "episodeUnlockAds.$.count": 1 },
          $set: { "episodeUnlockAds.$.date": today },
        },
        { upsert: false, new: true }
      ).then(async (result) => {
        if (!result) {
          await User.updateOne(
            { _id: user._id },
            {
              $push: {
                episodeUnlockAds: { movieWebseriesId, count: 1, date: today },
              },
            }
          );
        }
      }),
      userVideoStatus
        ? UserVideoStatus.updateOne(
            { _id: userVideoStatus._id },
            { $set: { isLocked: false } }
          )
        : UserVideoStatus.create({ userId, shortVideoId, isLocked: false }),
    ]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

// Deducting coins when a video is viewed
exports.deductCoinForVideoView = async (req, res) => {
  try {
    const { userId, shortVideoId } = req.query;
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    if (!userId || !shortVideoId) {
      return res
        .status(200)
        .json({
          status: false,
          message:
            "Invalid request parameters. Please provide all required details.",
        });
    }

    const [uniqueId, user, shortVideo, userVideoStatus] = await Promise.all([
      generateHistoryUniqueId(),
      User.findOne({ _id: userId }).select("_id isBlock coin").lean(),
      ShortVideo.findById(shortVideoId)
        .select("_id coin movieSeries videoImage")
        .lean(),
      UserVideoStatus.findOne({ userId, shortVideoId })
        .select("_id isLocked")
        .lean(),
    ]);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User not found!" });
    if (user.isBlock)
      return res
        .status(403)
        .json({
          status: false,
          message: "Access denied. You are blocked by the admin.",
        });
    if (!shortVideo)
      return res
        .status(200)
        .json({ status: false, message: "ShortVideo not found." });

    if (user.coin < shortVideo.coin) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Insufficient coins to unlock this video.",
        });
    }

    if (userVideoStatus && !userVideoStatus.isLocked) {
      return res
        .status(200)
        .json({
          status: true,
          message: "Video is already unlocked for this user.",
        });
    }

    if (shortVideo.coin > 0) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id, coin: { $gte: shortVideo.coin } },
        { $inc: { coin: -shortVideo.coin } },
        { new: true }
      ).select("_id coin");

      if (!updatedUser)
        return res
          .status(200)
          .json({
            status: false,
            message: "Failed to deduct coins. Please try again.",
          });

      res.status(200).json({
        status: true,
        message: "Coins have been successfully deducted. Video unlocked.",
        userCoin: updatedUser.coin || 0,
        videoImage: shortVideo.videoImage
          ? `${baseUrl}${shortVideo.videoImage}`
          : null,
      });

      await Promise.all([
        userVideoStatus
          ? UserVideoStatus.updateOne(
              { _id: userVideoStatus._id },
              { $set: { isLocked: false } }
            )
          : UserVideoStatus.create({ userId, shortVideoId, isLocked: false }),
        History.create({
          userId: user._id,
          videoId: shortVideo._id,
          movieSeries: shortVideo.movieSeries,
          uniqueId: uniqueId,
          coin: shortVideo.coin,
          type: 6,
          date: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          }),
        }),
      ]);
    } else {
      res.status(200).json({
        status: true,
        message: "Video unlocked successfully (free content).",
        userCoin: user.coin || 0,
        videoImage: shortVideo.videoImage
          ? `${baseUrl}${shortVideo.videoImage}`
          : null,
      });

      await (userVideoStatus
        ? UserVideoStatus.updateOne(
            { _id: userVideoStatus._id },
            { $set: { isLocked: false } }
          )
        : UserVideoStatus.create({ userId, shortVideoId, isLocked: false }));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

// Episodes auto-unlock (movieSeries-wise)
exports.unlockEpisodesAutomatically = async (req, res) => {
  try {
    const { userId, movieWebseriesId, type } = req.query;
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    if (!userId || !movieWebseriesId || typeof type === "undefined") {
      return res
        .status(200)
        .json({
          status: false,
          message:
            "Invalid request parameters. Please provide all required details.",
        });
    }

    const [uniqueId, user, movieWebseries] = await Promise.all([
      generateHistoryUniqueId(),
      User.findOne({ _id: userId }),
      MovieSeries.findById(movieWebseriesId),
    ]);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User not found!" });
    if (user.isBlock)
      return res
        .status(403)
        .json({ status: false, message: "You are blocked by the admin." });
    if (!movieWebseries)
      return res
        .status(200)
        .json({ status: false, message: "MovieSeries not found." });

    const enableAutoUnlock = type === "true";

    movieWebseries.isAutoUnlockEpisodes = enableAutoUnlock;
    await movieWebseries.save();

    if (enableAutoUnlock) {
      // Record in history
      await History.create({
        userId: user._id,
        movieSeries: movieWebseries._id,
        uniqueId: uniqueId,
        type: 7, // type for auto-unlock
        date: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      });

      return res.status(200).json({
        status: true,
        message: "Episodes successfully auto-unlocked and history recorded.",
        movieSeriesThumbnail: movieWebseries.thumbnail
          ? `${baseUrl}${movieWebseries.thumbnail}`
          : null,
      });
    } else {
      // Remove history entry if auto-unlock disabled
      await History.deleteOne({
        userId: user._id,
        movieSeries: movieWebseries._id,
        type: 7,
      });

      return res.status(200).json({
        status: true,
        message: "Episodes successfully auto-locked.",
        movieSeriesThumbnail: movieWebseries.thumbnail
          ? `${baseUrl}${movieWebseries.thumbnail}`
          : null,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

// Retrieves all videos from a specific movie series for a user (web)
exports.loadMovieSeriesVideosForUser = async (req, res) => {
  try {
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    const { movieSeriesId, userId } = req.query;

    if (!movieSeriesId) {
      return res
        .status(200)
        .json({ status: false, message: "Oops! Invalid details." });
    }

    if (!mongoose.Types.ObjectId.isValid(movieSeriesId)) {
      return res.status(200).json({
        status: false,
        message: "Invalid movieSeriesId format. It must be a valid ObjectId.",
      });
    }

    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const movieSeriesObjectId = new mongoose.Types.ObjectId(movieSeriesId);

    let user = null;
    let userIdObject = null;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      userIdObject = new mongoose.Types.ObjectId(userId);
      user = await User.findOne({ _id: userIdObject })
        .select("_id isBlock coin episodeUnlockAds")
        .lean();

      if (!user) {
        return res
          .status(200)
          .json({ status: false, message: "User not found." });
      }

      if (user.isBlock) {
        return res
          .status(200)
          .json({ status: false, message: "You are blocked by admin." });
      }
    }

    const aggregationPipeline = [
      { $match: { movieSeries: movieSeriesObjectId } },
      {
        $lookup: {
          from: "movieseries",
          localField: "movieSeries",
          foreignField: "_id",
          as: "movieSeriesDetails",
        },
      },
      { $unwind: "$movieSeriesDetails" },
      { $match: { "movieSeriesDetails.isActive": true } },
      {
        $lookup: {
          from: "likehistoryofvideos",
          localField: "_id",
          foreignField: "videoId",
          as: "likes",
        },
      },
    ];

    if (userIdObject) {
      aggregationPipeline.push(
        {
          $lookup: {
            from: "uservideostatuses",
            let: { videoId: "$_id", userId: userIdObject },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$shortVideoId", "$$videoId"] },
                      { $eq: ["$userId", "$$userId"] },
                    ],
                  },
                },
              },
            ],
            as: "userVideoStatus",
          },
        },
        {
          $lookup: {
            from: "uservideolists",
            let: { userId: userIdObject, movieSeriesId: movieSeriesObjectId },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", "$$userId"] },
                      { $in: ["$$movieSeriesId", "$videos.movieSeries"] },
                    ],
                  },
                },
              },
            ],
            as: "isAddedList",
          },
        }
        
      );
    }

    aggregationPipeline.push(
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          episodeNumber: 1,
          videoImage: { $concat: [baseUrl, "/admin/NewsChannelPoster","$videoImage"] },
          videoUrl: {
                    $cond: [
                      {
                        $regexMatch: {
                          input: "$videoUrl",
                          regex: /^https:\/\/vz/,
                        },
                      }, // ✅ use $$video
                      "$videoUrl", // keep as-is
                      {
                        $concat: [
                          baseUrl,
                          "/admin/newsVideos",
                          "$videoUrl",
                        ],
                      },
                    ],
                  },
          isLocked: userIdObject
            ? {
                $cond: {
                  if: { $gt: [{ $size: "$userVideoStatus" }, 0] },
                  then: { $arrayElemAt: ["$userVideoStatus.isLocked", 0] },
                  else: "$isLocked",
                },
              }
            : "$isLocked",
          coin: 1,
          "movieSeriesDetails._id": 1,
          "movieSeriesDetails.name": 1,
          "movieSeriesDetails.description": 1,
          "movieSeriesDetails.thumbnail": {
            $concat: [baseUrl, "$movieSeriesDetails.thumbnail"],
          },
          "movieSeriesDetails.maxAdsForFreeView": 1,
          isLike: userIdObject
            ? { $in: [userIdObject, "$likes.userId"] }
            : false,
          totalLikes: { $size: "$likes" },
          isAddedList: userIdObject
            ? { $cond: [{ $eq: [{ $size: "$isAddedList" }, 0] }, false, true] }
            : false,
          totalAddedToList: userIdObject
            ? {
                $size: {
                  $filter: {
                    input: "$isAddedList",
                    as: "addedList",
                    cond: { $eq: ["$$addedList.userId", userIdObject] },
                  },
                },
              }
            : 0,
        },
      },
      {
        $group: {
          _id: "$movieSeriesDetails._id",
          movieSeriesName: { $first: "$movieSeriesDetails.name" },
          movieSeriesDescription: { $first: "$movieSeriesDetails.description" },
          movieSeriesThumbnail: { $first: "$movieSeriesDetails.thumbnail" },
          movieSeriesMaxAdsForFreeView: {
            $first: "$movieSeriesDetails.maxAdsForFreeView",
          },
          isAddedList: { $first: "$isAddedList" },
          totalAddedToList: { $first: "$totalAddedToList" },
          videos: {
            $push: {
              _id: "$_id",
              episodeNumber: "$episodeNumber",
              title: "$title",
              description: "$description",
              videoImage: "$videoImage",
              videoUrl: "$videoUrl",
              isLocked: "$isLocked",
              coin: "$coin",
              isLike: "$isLike",
              totalLikes: "$totalLikes",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      { $skip: (start - 1) * limit },
      { $limit: limit }
    );

    const [totalVideosCount, videos] = await Promise.all([
      ShortVideo.countDocuments({ movieSeries: movieSeriesObjectId }),
      ShortVideo.aggregate(aggregationPipeline),
    ]);

    const userInfo = userIdObject
      ? {
          coin: user.coin || 0,
          episodeUnlockAds:
            user.episodeUnlockAds.find(
              (ads) =>
                ads?.movieWebseriesId?.toString() ===
                movieSeriesObjectId.toString()
            )?.count || 0,
        }
      : null;

    return res.status(200).json({
      status: true,
      message: "Retrieved videos from a specific movie series.",
      userInfo,
      totalVideosCount,
      data: videos[0] || null,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        status: false,
        message: error.message || "Internal Server Error",
      });
  }
};