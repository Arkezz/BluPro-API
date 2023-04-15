import test from "ava";
import request from "supertest";
import app from "../app.js";
import { CharacterClass } from "models/class.js";

test("GET / returns types from GameController.getTypes", async (t) => {
  const response = await request(app.callback()).get("/");
  t.is(response.status, 200);
  t.deepEqual(response.body, ["classes", "enemies", "quests", "weapons"]);
});

test("GET /:type returns entities from GameController.getEntities", async (t) => {
  const response = await request(app.callback()).get("/classes");
  t.is(response.status, 200);
  t.true(Array.isArray(response.body));
});

test("GET /:type/all returns all entities from GameController.getAllEntities", async (t) => {
  const response = await request(app.callback()).get("/classes/all");
  t.is(response.status, 200);
  t.true(Array.isArray(response.body));
});
