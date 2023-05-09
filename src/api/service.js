import {DARK_COLOR, DOCX_LIST_TYPE} from "../constants.js";
import {formatDate} from "../utils/format-date.js";
import pkg from "docx";
import {openAiTransport} from "../utils/openapi.js";

const {ExternalHyperlink, TextRun, Paragraph} = pkg;

function generateMainTitle({countCollects, blogCompany}){
    return  `This newsletter collects ${countCollects} latest engineering blogs from ${blogCompany}. You also can go to `
}

/**
 *
 * @param {Array<Record<string, *>>}data
 * @returns {string}
 */
export function generateCompanyString(data) {
    const companies = [...new Set(data.map((item) => item.company_name))];
    if (companies.length <= 2) {
        return companies.join(", ");
    } else {
        const lastTwo = companies.splice(companies.length - 2, 2);
        const allButLastTwo = companies.join(", ");
        return `${allButLastTwo}, ${lastTwo.join(", and ")}`;
    }
}

/**
 *
 * @param {Record<string, *>}articles
 * @returns {Record<string, *>}
 */
export const generateHeader = (articles) => {
    return new Paragraph({
        text: '',
        children: [
            new TextRun({
                color: DARK_COLOR,
                text: generateMainTitle({countCollects: articles.length, blogCompany: generateCompanyString(articles)})
            }),
            new ExternalHyperlink({
                children: [
                    new TextRun({
                        text: `Tech Blog Search site`,
                        style: "Hyperlink",
                    }),
                ],
                link: "https://www.techblogsearch.dev/",
            }),
            new TextRun({
                color: DARK_COLOR,
                text: ' to search engineering blogs from different IT companies.'
            })
        ]
    })
}


function generateListItem({company_name, posted_date, title, url}) {
    return [
        new TextRun({
            text: `[${company_name}] [${formatDate(posted_date)}] `,
        }),
        new ExternalHyperlink({
            children: [
                new TextRun({
                    text: title,
                    style: "Hyperlink",
                }),
            ],
            link: url,
        }),
    ]
}

function generateList(dataArray) {
    return dataArray.map(({title, url, company_name, posted_date}) => {
        return new Paragraph({
            numbering: {
                reference: DOCX_LIST_TYPE.numeric,
                level: 0,
            },
            children: generateListItem({title, url, company_name, posted_date})
        });
    })
}

async function generateBlogPostParagraph(dataArray) {
    let suggestions = []
    let instance = 1;
    // If run through Promise.all, a rate limit error is possible
    for (const {title, url, company_name, posted_date} of dataArray) {
        const summary = await openAiTransport(`give me a summary within 50 words on this webpage: ${url}`);
        const item = [
            new Paragraph({
                children: generateListItem({title, url, company_name, posted_date})
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'TL; DR',
                        color: DARK_COLOR,
                    })
                ]
            }),
            new Paragraph({
                numbering: {
                    reference: DOCX_LIST_TYPE.numeric,
                    level: 0,
                    instance,
                    custom: true
                },
                children: [
                    new TextRun({
                        text: summary,
                        color: DARK_COLOR,
                    })
                ]
            }),
        ]

        instance = instance + 1
        suggestions = [...suggestions, ...item]
    }
    return suggestions
}

export async function generateParagraphs(dataArray) {
    const header = generateHeader(dataArray);
    const list = generateList(dataArray);
    const blogPostParagraphs = await generateBlogPostParagraph(dataArray);

    return [header, ...list, ...blogPostParagraphs];
}