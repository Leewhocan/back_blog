import { body } from "express-validator";

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Минимальная длина пароля 5 символов").isLength({ min: 5 }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("AvatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const loginValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Минимальная длина пароля 5 символов").isLength({ min: 5 }),
];

export const PostCreateValidator = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тегов (укажите массивом)").optional().isArray(),
  body("ImageUrl", "Неверная ссылка на изображение").optional().isString(),
];
