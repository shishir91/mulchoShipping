import jwt from "jsonwebtoken";

let generateToken;
export default generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
