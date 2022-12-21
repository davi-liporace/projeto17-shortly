import joi from "joi";

export const encurtaUrlSchema = joi.object({
  url: joi.string().uri().required(),
});
