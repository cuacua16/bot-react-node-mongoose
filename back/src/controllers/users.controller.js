import UserService from "../services/users.service.js";
import User from "../models/user.model.js"
import { resLog } from "../utils/logger.js";
import BaseController from "./BaseController.class.js";

class UserController extends BaseController {
  constructor(service, name) {
    super(service, name)
  }
}

export default new UserController(new UserService({model: User}), "user");
