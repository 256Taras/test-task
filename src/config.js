import * as dotenv from 'dotenv'
dotenv.config();
import pkg from "docx";
const {AlignmentType} = pkg;

import {DOCX_LIST_TYPE} from "./constants.js";

export const config  = {
    multipart: {
        files: 1,
        limits: {
            fileSize: 1024 * 1024 * 10, // 10 MB
        },
    },
    server: {
        port: process.env.PORT || 3000
    },
    openapi:{
        apiKey: process.env.OPENAI_API_KEY
    },
    numbering: {
    config: [
        {
            reference: DOCX_LIST_TYPE.numeric,
            levels: [
                {
                    level: 0,
                    format: "decimal",
                    text: "%1.",
                    start: 1,
                    alignment: AlignmentType.START,
                    style: {
                        paragraph: {
                            indent: { left: 720, hanging: 260 },
                        },
                    },
                },
            ],
        },
    ],
},
}