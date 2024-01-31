const Router = require("express").Router();

const CustomerHelper = require("../helpers/customerHelper");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/customer.js";

const customerList = async (request, reply) => {
  try {
    const { name } = request.query;

    const response = await CustomerHelper.getAllCustomer(name);

    if (!response.ok) {
      return reply.status(404).json(response);
    }

    return reply.status(200).json(response);
  } catch (err) {
    console.log([fileName, "customerList", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const customerDetail = async (request, reply) => {
  try {
    const { id } = request.params;

    const response = await CustomerHelper.getCustomerDetail(id);
    if (!response.ok) {
      return reply.status(404).json(response);
    }

    return reply.status(200).json(response);
  } catch (err) {
    console.log([fileName, "customerDetail", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const createCustomer = async (request, reply) => {
  try {
    const customerData = request.body;

    Validation.createCustomer(customerData);

    const response = await CustomerHelper.createCustomer(customerData);

    if (!response.ok) {
      return reply.status(400).json(response);
    }

    return reply.status(201).json(response);
  } catch (err) {
    console.log([fileName, "createCustomer", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const editCustomer = async (request, reply) => {
  try {
    const customerData = request.body;
    const { id } = request.params;

    Validation.updateCustomer(customerData);

    const response = await CustomerHelper.updateCustomer(id, customerData);

    return reply.status(202).json(response);
  } catch (err) {
    console.log([fileName, "editCustomer", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const removeCustomer = async (request, reply) => {
  try {
    const { id } = request.params;

    const response = await CustomerHelper.deleteCustomer(id);

    return reply.status(202).json(response);
  } catch (err) {
    console.log([fileName, "removeCustomer", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/customer", customerList);
Router.get("/customer/:id", customerDetail);
Router.post("/customer", createCustomer);
Router.patch("/customer/:id", editCustomer);
Router.delete("/customer/:id", removeCustomer);

module.exports = Router;
