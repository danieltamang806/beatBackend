// MusicController.js

const axios = require("axios");
const catchAsync = require("./../utils/catchAsync");
const { generateRecommendations } = require("../algorithm/itemBased");
const User = require("../models/userModel");

const getAllHomepagesongs = catchAsync(async (req, res, next) => {
  const response = await axios.get(
    "https://www.jiosaavn.com/api.php?_format=json&_marker=0&api_version=4&ctx=web6dot0&__call=webapi.getLaunchData"
  );

  let suggestions = [];

  try {
    if (req?.user) {
      const user = await User.findOne({ _id: req.user._id });
      if (user) {
        const allUsers = await User.find();
        const allUserExceptCurrentUser = allUsers.filter(
          (item) => item._id.toString() !== user._id.toString()
        );
        suggestions = await generateRecommendations(
          user,
          allUserExceptCurrentUser
        );
      }
    }
  } catch (error) {
    console.log(error);
  }

  const data = response.data;

  const newTrending = data?.new_trending.map((item) => {
    return {
      id: item.id,
      name: item.title,
      type: item.type,
      image: [{ quality: "high", url: item.image }],
    };
  });

  const TopPlaylist = data?.top_playlists.map((item) => {
    return {
      id: item.id,
      name: item.title,
      type: item.type,
      image: [{ quality: "high", url: item.image }],
    };
  });

  const newAlbums = data?.new_albums.map((item) => {
    return {
      id: item.id,
      name: item.title,
      type: item.type,
      image: [{ quality: "high", url: item.image }],
    };
  });

  const topCharts = data?.charts.map((item) => {
    return {
      id: item.id,
      name: item.title,
      type: item.type,
      image: [{ quality: "high", url: item.image }],
    };
  });

  res.status(200).json({
    status: "success",
    data: {
      trending: newTrending,
      topPlaylist: TopPlaylist,
      newAlbums: newAlbums,
      topCharts: topCharts,
      suggestions: suggestions,
    },
  });
});

module.exports = {
  getAllHomepagesongs,
};
