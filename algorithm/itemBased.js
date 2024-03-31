// Function to calculate cosine similarity between two vectors
const cosineSimilarity = (vectorA, vectorB) => {
  // Calculate dot product
  const dotProduct = vectorA.reduce(
    (acc, val, index) => acc + val * vectorB[index],
    0
  );

  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vectorA.reduce((acc, val) => acc + val ** 2, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((acc, val) => acc + val ** 2, 0));

  // Calculate cosine similarity
  const similarity = dotProduct / (magnitudeA * magnitudeB);
  return similarity;
};

// Function to calculate similarity between two users based on their favorite songs
const calculateSimilarity = (user1, user2) => {
  const favoriteSongs1 = user1.userFavoriteSong;
  const favoriteSongs2 = user2.userFavoriteSong;

  // Convert favorite songs to binary vectors
  const vector1 = favoriteSongs1.map((song) =>
    favoriteSongs2.includes(song) ? 1 : 0
  );
  const vector2 = favoriteSongs2.map((song) =>
    favoriteSongs1.includes(song) ? 1 : 0
  );

  // Calculate cosine similarity between the binary vectors
  return cosineSimilarity(vector1, vector2);
};

// Function to generate recommendations for a user based on similar users' preferences
const generateRecommendations = (user, users) => {
  const recommendations = {};

  // Calculate similarity between the user and other users
  for (const otherUser of users) {
    if (otherUser.id !== user.id) {
      const similarity = calculateSimilarity(user, otherUser);

      // If similarity is above threshold, add other user's favorite songs as recommendations
      if (similarity >= 0.5) {
        for (const song of otherUser.userFavoriteSong) {
          if (!user.userFavoriteSong.includes(song)) {
            if (recommendations[song]) {
              recommendations[song]++;
            } else {
              recommendations[song] = 1;
            }
          }
        }
      }
    }
  }

  // Filter out songs already favored by the user
  const filteredRecommendations = Object.keys(recommendations)
    .filter((song) => !user.userFavoriteSong.includes(song))
    .map((song) => ({ song, count: recommendations[song] }))
    .sort((a, b) => b.count - a.count)
    .map((item) => item.song);

  return filteredRecommendations;
};

// Example test data with more diverse and larger user song preferences
const users = [
  { id: 1, userFavoriteSong: ["song1", "song2", "song3", "song4", "song5"] },
  { id: 2, userFavoriteSong: ["song2", "song3", "song4", "song6", "song7"] },
  { id: 3, userFavoriteSong: ["song1", "song3", "song5", "song8", "song9"] },
  { id: 4, userFavoriteSong: ["song1", "song4", "song6", "song10", "song11"] },
  { id: 5, userFavoriteSong: ["song3", "song5", "song7", "song9", "song12"] },
  { id: 6, userFavoriteSong: ["song1", "song4", "song8", "song10", "song13"] },
  { id: 8, userFavoriteSong: ["song2", "song5", "song9", "song11", "song13"] },
  { id: 9, userFavoriteSong: ["song1", "song3", "song6", "song12", "song14"] },
  { id: 10, userFavoriteSong: ["song2", "song4", "song7", "song10", "song15"] },
];

const user = {
  id: 7,
  userFavoriteSong: ["song1", "song4", "song14", "song15", "song16"],
}; // Example user

// const recommendations = generateRecommendations(user, users);
// console.log("Recommendations:", recommendations);

module.exports = { calculateSimilarity, generateRecommendations };
