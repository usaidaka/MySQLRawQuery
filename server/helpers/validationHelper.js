const Joi = require("joi");
const Boom = require("boom");

const pokemonListValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional().description("Pokemon name; i.e. Bulbasaur"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const createCustomer = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
      .description("name; i.e. Usaid AKA"),
    phone: Joi.string()
      .min(6)
      .max(20)
      .regex(/^0/, "Phone should to start with 0")
      .required()
      .description("phone; i.e. 089652441231"),
    address: Joi.string()
      .min(6)
      .max(200)
      .required()
      .description("address; i.e. Jl TB Simatupang"),
  });
  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const updateCustomer = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(20)
      .optional()
      .description("name; i.e. Usaid AKA"),
    phone: Joi.string()
      .min(6)
      .max(20)
      .regex(/^0/, "Phone should to start with 0")
      .optional()
      .description("phone; i.e. 089652441231"),
    address: Joi.string()
      .min(6)
      .max(200)
      .optional()
      .description("address; i.e. Jl TB Simatupang"),
  });
  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const createBook = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(20)
      .required()
      .description("name; i.e. Usaid AKA"),
    author: Joi.string()
      .min(3)
      .max(20)
      .required()
      .description("author; i.e. Tere Liye"),
    idCategory: Joi.number()
      .required()
      .description("address; i.e. Jl TB Simatupang"),
  });
  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const updateBook = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(20)
      .optional()
      .description("name; i.e. Usaid AKA"),
    author: Joi.string()
      .min(3)
      .max(20)
      .optional()
      .description("author; i.e. Tere Liye"),
    idCategory: Joi.number()
      .optional()
      .description("address; i.e. Jl TB Simatupang"),
  });
  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const createLending = (data) => {
  const schema = Joi.object({
    customerName: Joi.string()
      .min(3)
      .max(20)
      .required()
      .description("name; i.e. Usaid AKA"),
    bookName: Joi.string()
      .min(3)
      .max(20)
      .required()
      .description("author; i.e. Matahari Tenggelam Di Wajahmu"),
  });
  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  pokemonListValidation,
  createCustomer,
  updateCustomer,
  createBook,
  updateBook,
  createLending,
};
