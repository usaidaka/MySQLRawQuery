const Router = require("express").Router();

const LendingHelper = require("../helpers/lendingHelper");

const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/lending.js";

const lendingList = async (request, reply) => {
  try {
    const response = await LendingHelper.getAllLending();

    if (!response.ok) {
      return reply.status(404).json(response);
    }

    return reply.status(200).json(response);
  } catch (err) {
    console.log([fileName, "lendingList", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const createLending = async (request, reply) => {
  try {
    const lendingData = request.body;
    Validation.createLending(lendingData);

    const response = await LendingHelper.addLanding(lendingData);
    if (!response.ok) {
      return reply.status(404).json(response);
    }

    return reply.status(201).json(response);
  } catch (err) {
    console.log([fileName, "createLending", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const customerLendingBookList = async (request, reply) => {
  try {
    const { id } = request.params;
    const response = await LendingHelper.getAllLendingListCustomer(id);

    if (!response.ok) {
      return reply.status(404).json(response);
    }

    return response;
  } catch (err) {
    console.log([fileName, "createLending", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/lending", lendingList);
Router.get("/lending/:id", customerLendingBookList);
Router.post("/lending", createLending);

module.exports = Router;
