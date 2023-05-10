import test from "ava";
import request from "supertest";
import app from "../app.js";
//import GameController from "../controllers/classController.js";
// import { CharacterClass } from "../models/class.js";

const classes = [
  "blade-warden",
  //"foe-breaker",
  "keen-strider",
  "spell-weaver",
  "twin-striker",
];

//Test all routes for each class
test("All routes should return 200", async (t) => {
  const paths = [
    "/",
    "/classes",
    "/classes/{class}",
    "/classes/{class}/list",
    // "/classes/{class}/media",
  ];

  for (const className of classes) {
    for (const path of paths) {
      const url = path.replace("{class}", className);
      const response = await request(app.callback()).get(url);
      t.is(response.status, 200, `${url} should return 200`);
    }
  }
});

// Test invalid paths
test("Invalid paths should return 404", async (t) => {
  const invalidPaths = [
    "/",
    "/classes/invalidId",
    "/classes/{class}/invalidId",
    "/classes/{class}/list/invalidId",
    "/classes/{class}/media/invalidId",
  ];

  const errors = [];

  for (const className of classes) {
    for (const path of invalidPaths) {
      const url = path.replace("{class}", className);
      const response = await request(app.callback()).get(url);
      if (response.status !== 404 || !response.error) {
        errors.push(`${url} should return error status`);
      }
    }
  }

  t.deepEqual(errors, [], "All paths should return 404");
});
