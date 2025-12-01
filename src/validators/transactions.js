const Joi = require("joi");

exports.transactionSchema = Joi.object({
  accountId: Joi.string().optional(),  
  fromAccount: Joi.string().optional(),
  toAccount: Joi.string().optional(),

  type: Joi.string().valid("INCOME", "EXPENSE", "TRANSFER").required(),

  amount: Joi.number().positive().required(),

  description: Joi.string().max(200).optional()
});