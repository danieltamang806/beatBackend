// itemBased.js

const calculateSimilarity = async (song1, song2, users) => {
  try {
    // Find users who have both songs in their favorite list
    const usersWithBothSongs = users.filter(
      (user) =>
        user.userFavoriteSong.includes(song1) &&
        user.userFavoriteSong.includes(song2)
    );

    // Calculate the vector product
    const vectorProduct = usersWithBothSongs.reduce(
      (acc, user) =>
        acc +
        (user.userFavoriteSong.includes(song1) ? 1 : -1) *
          (user.userFavoriteSong.includes(song2) ? 1 : -1),
      0
    );

    // Calculate the norms of the vectors
    const normA = users.filter((user) =>
      user.userFavoriteSong.includes(song1)
    ).length;
    const normB = users.filter((user) =>
      user.userFavoriteSong.includes(song2)
    ).length;

    // Check for zero norms to avoid division by zero
    if (normA === 0 || normB === 0) {
      return 0;
    }

    // Calculate the similarity using the vector product and norms
    const similarity = vectorProduct / Math.sqrt(normA * normB);

    return similarity;
  } catch (error) {
    console.error("Error calculating similarity:", error);
    throw error;
  }
};

const generateRecommendations = async (user, users) => {
  try {
    const recommendations = [];
    const userFavoriteSongs = user?.userFavoriteSong;

    for (let i = 0; i < userFavoriteSongs.length; i++) {
      for (let j = i + 1; j < userFavoriteSongs.length; j++) {
        const song1 = userFavoriteSongs[i];
        const song2 = userFavoriteSongs[j];

        const similarity = await calculateSimilarity(song1, song2, users);

        console.log(
          "Similarity between",
          song1,
          "and",
          song2,
          "is",
          similarity
        );

        if (similarity >= 0.5) {
          const recommendedSongs = users
            .filter(
              (otherUser) =>
                otherUser.userFavoriteSong.includes(song1) &&
                !otherUser.userFavoriteSong.includes(song2)
            )
            .map((otherUser) =>
              otherUser.userFavoriteSong.filter((song) => song !== song1)
            );

          recommendations.push(...recommendedSongs);
        }
      }
    }
    console.log(recommendations);
    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

module.exports = { calculateSimilarity, generateRecommendations };
