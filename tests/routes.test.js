import { getTypes } from "../src/modules/filesystem.js";
import { expect } from "chai";
import sinon from "sinon";
import logger from "../src/modules/logger.js";

describe("getTypes", function () {
  beforeEach(function () {
    sinon.stub(logger, "debug");
    sinon.stub(logger, "info");
    sinon.stub(logger, "error");
  });

  afterEach(function () {
    logger.debug.restore();
    logger.info.restore();
    logger.error.restore();
  });
  it("should return an array of strings", async function () {
    const types = await getTypes();
    expect(types).to.be.an("array");
    expect(types[0]).to.be.a("string");
  });

  it("should check if the types are correctly cached", async function () {
    await getTypes();
    expect(logger.info.calledWith("Added types to cache")).to.be.true;
    await getTypes();
    expect(logger.info.calledWith("Cache hit for types")).to.be.true;
  });
});
