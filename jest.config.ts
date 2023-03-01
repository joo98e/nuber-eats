import type { Config } from "jest";

const config: Config = {
  verbose: true,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^@modules/(.*)": ["<rootDir>/src/$1"],
    "^@common/(.*)": ["<rootDir>/common/$1"],
  },
  collectCoverageFrom: ["**/*.service.(t|j)s"],
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: ["node_modules", "dist"],
  testEnvironment: "node",
};

export default config;
