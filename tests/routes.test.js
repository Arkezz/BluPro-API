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

  describe("GET /:type", () => {
    it("should return all entities of a type", (done) => {
      // Mock the GameController.getEntities() function
      const entities = [
        "blade-warden",
        "foe-breaker",
        "keen-strider",
        "spell-weaver",
        "twin-striker",
      ];
      const getEntitiesStub = sinon
        .stub(GameController, "getEntities")
        .resolves(entities);

      supertest(app.callback())
        .get("/classes")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Check if the response body matches the expected result
          expect(res.body).to.deep.equal(entities);

          // Restore the GameController.getEntities() function
          getEntitiesStub.restore();
          done();
        });
    });
  });

  describe("GET /:type/:id", () => {
    it("should return an entity of a type", (done) => {
      // Mock the GameController.getEntity() function
      const entity = {
        id: "blade-warden",
        name: "Blade Warden",
        description: "A master of the blade.",
        image: "blade-warden.png",
      };
      const getEntityStub = sinon
        .stub(GameController, "getEntity")
        .resolves(entity);

      supertest(app.callback())
        .get("/classes/blade-warden")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          // Check if the response body matches the expected result
          expect(res.body).to.deep.equal(entity);

          // Restore the GameController.getEntity() function
          getEntityStub.restore();
          done();
        });
    });
  });

  // Add more tests for other routes here
});
