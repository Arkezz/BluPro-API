import app from "../src/app.js";
import GameController from "../src/controllers/classController.js";
import sinon from "sinon";
import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;

describe("GameController routes", () => {
  describe("GET /", () => {
    it("should return all types", (done) => {
      // Mock the GameController.getTypes() function
      const types = ["classes", "enemies", "quests", "weapons"];
      const getTypesStub = sinon
        .stub(GameController, "getTypes")
        .resolves(types);

      supertest(app.callback())
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Check if the response body matches the expected result
          expect(res.body).to.deep.equal(types);

          // Restore the GameController.getTypes() function
          getTypesStub.restore();
          done();
        });
    });
  });

  // Add more tests for other routes here
});
