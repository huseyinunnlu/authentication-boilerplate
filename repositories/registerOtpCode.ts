import BaseRepository from "./baseRepository.ts";
import {IRegisterOtpCodeModel} from "../types";
import RegisterOtpCode from "../models/registerOtpCode.ts";

class RegisterOtpCodeRepository extends BaseRepository<IRegisterOtpCodeModel> {
    constructor() {
        super(RegisterOtpCode);
    }
}

export default new RegisterOtpCodeRepository();