import test from "ava";
// import app from "../src/app.js";
// import GameController from "../src/controllers/classController.js";

test("foo", (t) => {
  t.pass();
});

test("bar", async (t) => {
  const bar = Promise.resolve("bar");
  t.is(await bar, "bar");
});
