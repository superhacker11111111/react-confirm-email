export const module = {
  rules: [
    // existing loaders
    {
      test: /\.svg$/,
      use: ['file-loader'],
    },
  ],
};
