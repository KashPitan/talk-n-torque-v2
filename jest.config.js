module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/supabase/functions/tests"],
  moduleNameMapper: {
    "^~/components/(.*)$": "<rootDir>/components/$1",
    "^~/lib/(.*)$": "<rootDir>/lib/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|@rneui|react-native-reanimated|@rn-primitives)/)",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
};
