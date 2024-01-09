import {IUserModel} from "../types";
import BaseRepository from "./baseRepository.ts";
import User from "../models/user.ts";

class UserRepository extends BaseRepository<IUserModel> {
    constructor() {
        super(User);
    }
}

export default new UserRepository();