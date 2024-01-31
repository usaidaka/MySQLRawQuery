const db = require("../services/database");

const getCustomerByName = async (name) => {
  let response = {};
  const result = await db.getCustomerByName(name);

  if (result.length === 0) {
    response = {
      ok: false,
      message: `Customer with name "${name}" is Not Found`,
    };
    return response;
  }

  response = {
    ok: true,
    message: "Retrieving Customer by Name successfully",
    result,
  };
  return response;
};

const getAllCustomer = async (name) => {
  let response = {};
  const result = await db.getAllCustomer();

  if (name) {
    const resultQuery = await getCustomerByName(name);
    return resultQuery;
  }

  if (result.length === 0) {
    response = { ok: false, message: "Customer Data still Empty", result };
    return response;
  }

  response = {
    ok: true,
    message: "Retrieving All Customer Data Successfully",
    result,
  };
  return response;
};

const getCustomerDetail = async (id) => {
  let response = {};
  const result = await db.getCustomerDetail(id);
  if (result.length === 0) {
    response = { ok: false, message: "Customer Not Found" };
    return response;
  }

  response = {
    ok: true,
    message: "Retrieving Customer Data Successfully",
    result,
  };
  return response;
};

const createCustomer = async (customerData) => {
  const customer = await getAllCustomer();

  const isPhoneUsed = customer.result?.find(
    (prop) => prop.phone === customerData.phone
  );

  const isNameUsed = customer.result?.find(
    (prop) => prop.name === customerData.name
  );

  let response = {};

  if (isNameUsed) {
    response = { ok: false, message: "Name is Already Used" };
    return response;
  }

  if (isPhoneUsed) {
    response = { ok: false, message: "Phone Number is Already Used" };
    return response;
  }

  const result = await db.addCustomer(customerData);

  if (!result) {
    response = { ok: false, message: "Create Customer is Failed" };
    return response;
  }

  response = {
    ok: true,
    message: "New Customer Successfully Created!",
    result: customerData,
  };

  return response;
};

const updateCustomer = async (id, customerData) => {
  const { phone } = customerData;

  const customer = await getAllCustomer();

  let response = {};

  const isIdFound = customer.result?.find(
    (prop) => prop.idCustomer === Number(id)
  );

  if (!isIdFound) {
    response = { ok: false, message: "Customer Not Found" };
    return response;
  }

  if (phone) {
    const isPhoneUsed = customer.result?.find(
      (prop) => prop.phone === customerData.phone
    );

    if (isPhoneUsed) {
      response = { ok: false, message: "Phone Number is Already Used" };
      return response;
    }
  }

  const result = await db.editCustomer(id, customerData);

  if (!result) {
    response = { ok: false, message: "Update Customer is Failed" };
    return response;
  }

  response = {
    ok: true,
    message: "Customer's Data Successfully Updated!",
    result: customerData,
  };

  return response;
};

const deleteCustomer = async (id) => {
  let response = {};
  const customer = await getAllCustomer();
  const isIdFound = customer.result?.find(
    (prop) => prop.idCustomer === Number(id)
  );

  const customerInformation = customer.result?.filter(
    (prop) => prop.idCustomer === Number(id)
  );

  if (!isIdFound) {
    response = { ok: false, message: "Customer Not Found" };
    return response;
  }

  const result = await db.removeCustomer(id);

  if (!result) {
    response = { ok: false, message: "Delete Customer is Failed" };
    return response;
  }

  response = {
    ok: true,
    message: "Customer's Data Successfully Deleted!",
    result: customerInformation,
  };

  return response;
};

module.exports = {
  getAllCustomer,
  createCustomer,
  getCustomerDetail,
  updateCustomer,
  deleteCustomer,
};
