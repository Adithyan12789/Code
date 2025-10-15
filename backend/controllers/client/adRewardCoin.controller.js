const AdRewardCoin = require("../../models/adRewardCoin.model");

//import model
const User = require("../../models/user.model");

//mongoose
const mongoose = require("mongoose");

//get ad rewards
exports.getAdRewardByUser = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({ status: false, message: "Oops! Invalid details!" });
    }

    const userId = new mongoose.Types.ObjectId(req.query.userId);

    if(!userId){
      return res.status(200).json({ status: false, message: "Oops! Invalid UserId!" });
    }

    const [user, adReward] = await Promise.all([User.findOne({ _id: userId }), AdRewardCoin.find().sort({ coinEarnedFromAd: 1 })]);

    const userWatchAds = user?.watchAds;

    console.log("userWatchAds: ", userWatchAds);
    console.log("adReward: ", adReward);

    return res.status(200).json({
      status: true,
      message: "Retrive AdRewardCoin Successfully",
      userWatchAds: userWatchAds,
      data: adReward,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server error" });
  }
};
