import test from "ava";
import request from "supertest";
import app from "../app.js";
//import GameController from "../controllers/classController.js";
// import { CharacterClass } from "../models/class.js";

const classes = [
  "blade-warden",
  "foe-breaker",
  "keen-strider",
  "spell-weaver",
  "twin-striker",
];

test("Invalid paths should return 404", async (t) => {
  const invalidPaths = [
    "/invalidpath",
    "/classes/invalidId",
    "/classes/{class}/invalidId",
    "/classes/{class}/list/invalidId",
    "/classes/{class}/media/invalidId",
  ];

  for (const className of classes) {
    for (const path of invalidPaths) {
      const url = path.replace("{class}", className);
      const response = await request(app.callback()).get(url);
      t.is(response.status, 404, `${url} should return 404`);
    }
  }
});
