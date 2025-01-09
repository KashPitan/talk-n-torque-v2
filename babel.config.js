module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "module:metro-react-native-babel-preset",
        { useTransformReactJSXExperimental: true },
      ],
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
    plugins: [
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "nativewind",
        },
      ],
    ],
  };
};
