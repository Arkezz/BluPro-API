const { getTypes } = require("../src/modules/filesystem.js");
const { expect } = require("chai");
const sinon = require("sinon");
const logger = require("../src/modules/logger");

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
