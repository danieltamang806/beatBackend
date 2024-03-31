const calculateSimilarity = async (song1, song2, users) => {
  try {
    console.log("Calculating similarity between", song1, "and", song2);

    // Find users who have both songs in their favorite list
    const usersWithBothSongs = users.filter(
      (user) =>
        user.userFavoriteSong.includes(song1) &&
        user.userFavoriteSong.includes(song2)
    );

    console.log("Users with both songs:", usersWithBothSongs);

    // Calculate the vector product
    const vectorProduct = usersWithBothSongs.reduce(
      (acc, user) =>
        acc +
        (user.userFavoriteSong.includes(song1) ? 1 : -1) *
          (user.userFavoriteSong.includes(song2) ? 1 : -1),
      0
    );

    console.log("Vector product:", vectorProduct);

    // Calculate the norms of the vectors
    const normA = users.filter((user) =>
      user.userFavoriteSong.includes(song1)
    ).length;
    const normB = users.filter((user) =>
      user.userFavoriteSong.includes(song2)
    ).length;

    console.log("Norm A:", normA);
    console.log("Norm B:", normB);

    // Check for zero norms to avoid division by zero
    if (normA === 0 || normB === 0) {
      console.log("Zero norms detected, returning similarity: 0");
      return 0;
    }

    // Calculate the similarity using the vector product and norms
    const similarity = vectorProduct / Math.sqrt(normA * normB);

    console.log("Similarity:", similarity);
    return similarity;
  } catch (error) {
    console.error("Error calculating similarity:", error);
    throw error;
  }
};

const generateRecommendations = async (user, users) => {
  try {
    console.log("Generating recommendations for user:", user);

    const recommendations = [];
    const userFavoriteSongs = user?.userFavoriteSong;

    for (let i = 0; i < userFavoriteSongs.length; i++) {
      const song = userFavoriteSongs[i];

      console.log("Checking song:", song);

      const similarUsers = users.filter((otherUser) =>
        otherUser.userFavoriteSong.includes(song)
      );

      console.log("Similar users:", similarUsers);

      const recommendedSongs = similarUsers
        .map((otherUser) =>
          otherUser.userFavoriteSong.filter((otherSong) => otherSong !== song)
        )
        .flat();

      console.log("Recommended songs:", recommendedSongs);
      recommendations.push(...recommendedSongs);
    }

    // Remove duplicates
    const uniqueRecommendations = [...new Set(recommendations)];

    console.log("Final recommendations:", uniqueRecommendations);
    return uniqueRecommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

const users = [
  { id: 1, userFavoriteSong: ["song1", "song2", "song3"] },
  { id: 2, userFavoriteSong: ["song2", "song3", "song4"] },
  { id: 3, userFavoriteSong: ["song1", "song3", "song5"] },
  { id: 4, userFavoriteSong: ["song2", "song4", "song5"] },
  { id: 5, userFavoriteSong: ["song1", "song4", "song6"] },
  { id: 6, userFavoriteSong: ["song1", "song7", "song8"] }, // New user
];

const user = { id: 7, userFavoriteSong: ["song1", "song4"] };

generateRecommendations(user, users)
  .then((recommendations) => {
    console.log("Recommendations:", recommendations);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = { calculateSimilarity, generateRecommendations };
