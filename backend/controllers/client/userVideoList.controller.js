const UserVideoList = require("../../models/userVideoList.model");
const User = require("../../models/user.model");
const News = require("../../models/news.model");
const mongoose = require("mongoose");

// video added to own list Or remove from own list by user
exports.videoAddedToMyListByUser = async (req, res) => {
  try {
    const { userId, movieSeriesId } = req.query;
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    if (!userId || !movieSeriesId) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const movieSeriesObjectId = new mongoose.Types.ObjectId(movieSeriesId);

    const [user, movieSeries, existingList] = await Promise.all([
      User.findOne({ _id: userObjectId }).lean().select("_id isBlock name"),
      News.findOne({ _id: movieSeriesObjectId })
        .lean()
        .select("_id thumbnail"),
      UserVideoList.findOne({
        userId: userObjectId,
        "videos.movieSeries": movieSeriesObjectId,
      }),
    ]);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    if (user.isBlock) {
      return res
        .status(200)
        .json({ status: false, message: "User is blocked by admin." });
    }

    if (!movieSeries) {
      return res
        .status(200)
        .json({ status: false, message: "MovieSeries not found." });
    }

    if (existingList) {
      // remove from list
      await UserVideoList.findOneAndUpdate(
        { userId: user._id },
        { $pull: { videos: { movieSeries: movieSeries._id } } },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "MovieSeries removed from your list.",
        isAddedToList: false,
        movieSeriesThumbnail: movieSeries.thumbnail
          ? `${baseUrl}/admin/NewsChannelPoster${movieSeries.thumbnail}`
          : null,
      });
    } else {
      // add to list
      await UserVideoList.findOneAndUpdate(
        { userId: user._id },
        { $push: { videos: { movieSeries: movieSeries._id } } },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        status: true,
        message: "MovieSeries added to your list successfully.",
        isAddedToList: true,
        movieSeriesThumbnail: movieSeries.thumbnail
          ? `${baseUrl}${movieSeries.thumbnail}`
          : null,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: error.message || "Internal Server Error" });
  }
};

// fetch videos which added own list
exports.getAllVideosAddedToMyListByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const baseUrl =
      process.env.WASABI_URL || `${req.protocol}://${req.get("host")}`;

    if (!userId) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [user, userVideoList] = await Promise.all([
      User.findOne({ _id: userObjectId })
        .lean()
        .select("_id isBlock name")
        .lean(),
      UserVideoList.findOne({ userId: userObjectId })
        .populate({
          path: "videos.movieSeries",
          select: "name thumbnail",
        })
        .lean(),
    ]);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User not found." });
    }

    if (user.isBlock) {
      return res
        .status(200)
        .json({ status: false, message: "User is blocked by admin." });
    }

    const formattedVideos =
      userVideoList?.videos.map((v) => ({
        ...v,
        movieSeries: v.movieSeries
          ? {
              ...v.movieSeries,
              thumbnail: v.movieSeries.thumbnail
                ? `${baseUrl}/admin/NewsChannelPoster${v.movieSeries.thumbnail}`
                : null,
            }
          : null,
      })) || [];

    return res.status(200).json({
      status: true,
      message: "Favorite MovieSeries retrieved successfully.",
      data: formattedVideos,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: error.message || "Internal Server Error" });
  }
};
