import BaseRepository from "./baseRepository.ts";
import RenewPasswordOtpCode from "../models/renewPasswordOtpCode.ts";
import {IRenewPasswordOtpCode} from "../types";

class RenewPasswordOtpCodeRepository extends BaseRepository<IRenewPasswordOtpCode> {
    constructor() {
        super(RenewPasswordOtpCode);
    }
}

export default new RenewPasswordOtpCodeRepository();