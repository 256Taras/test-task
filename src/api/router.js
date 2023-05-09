import fastifyMultipart from "@fastify/multipart";
import {streamToArray} from "../utils/stream-to-array.js";
import pkg from 'docx';
import {parseArrayOfArrayToArrayOfObjects} from "../utils/parse-array-of-array-to-array-of-objects.js";

import {schema} from "./schema.js";
import {config} from "../config.js";
import {generateParagraphs} from "./service.js";

const {Document, Packer, SectionType} = pkg;

function ganareateFileName(){
    const date = new Date();
    const dateString = date.toISOString().substring(0, 10).replace(/:/g, '-');
    const filename = `${dateString}-Latest-Engineering-Blogs.docx`;
    return filename
}

export default async function router(app) {
    app.register(fastifyMultipart, config.multipart);
    app.post('/', {
        schema,
        attachValidation: true,
        async handler(req, reply) {
            try {
                const data = await req.file();
                if (!data.file) return reply.status(400).send('No file uploaded!')
                if (data.mimetype !== 'text/csv') return reply.status(400).send('The file must be in CSV format!')

                const csvResult = await streamToArray(data.file)

                const articlesInfo = parseArrayOfArrayToArrayOfObjects(csvResult)

                const doc = new Document({
                    numbering: config.numbering,
                    sections: [
                        {
                            properties:{
                                type: SectionType.CONTINUOUS,
                            },
                            children: await generateParagraphs(articlesInfo)
                        },
                    ],
                });

                reply
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                    .header("Content-Disposition", `attachment; filename="${ganareateFileName()}"`);

                return Packer.toBuffer(doc)
            } catch (err) {
                console.log(err)
                reply.status(500).send('Internal Server Error');
            }
        }
    });
}