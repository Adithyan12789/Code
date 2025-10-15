const { CONTENT_TYPE } = require("../types/constant");

const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    banner: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    maxAdsForFreeView: { type: Number, default: 0 }, //if video is locked then to that ad's limit after watching ad he has right to view locked episodes
    releaseDate: { type: Date, default: Date.now },
    isTrending: { type: Boolean, default: false },
    isAutoAnimateBanner: { type: Boolean, default: false },
    isAutoUnlockEpisodes: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

newsSchema.index({ isActive: 1 });
newsSchema.index({ releaseDate: -1 });

module.exports = new mongoose.model("MovieSeries", newsSchema);
