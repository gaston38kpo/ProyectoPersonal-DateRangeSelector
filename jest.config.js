export default {
    transform: { "^.+\\.[t|j]sx?$": "babel-jest" },
    transformIgnorePatterns: [
        "/node_modules/(?!dayjs).+\\.js$",
    ],
    moduleFileExtensions: ["js", "jsx"],
    testEnvironment: "node",
};