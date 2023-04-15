import test from "ava";
import request from "supertest";
import app from "../app.js";
import { CharacterClass } from "models/class.js";

test("GET / returns types from GameController.getTypes", async (t) => {
  const response = await request(app.callback()).get("/");
  t.is(response.status, 200);
  t.deepEqual(response.body, ["classes", "enemies", "quests", "weapons"]);
});
