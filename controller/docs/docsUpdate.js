const pool = require("../../config/db");
const {
  validateParameterString,
  validateParameterInteger,
} = require("../../functions/validate");

function validateParams(datas) {
  const docId = Object.prototype.hasOwnProperty.call(datas, "doc_id")
    ? validateParameterString(datas.doc_id)
    : false;
  const userId = Object.prototype.hasOwnProperty.call(datas, "user_id")
    ? validateParameterInteger(datas.user_id)
    : false;
  const title = Object.prototype.hasOwnProperty.call(datas, "title")
    ? validateParameterString(datas.title, false)
    : undefined;
  const content = Object.prototype.hasOwnProperty.call(datas, "content")
    ? datas.content
    : undefined;

  if (
    docId === false ||
    userId === false ||
    title === false ||
    content === false
  ) {
    throw Error("Params invalid!");
  }

  return {
    doc_id: docId,
    title,
    content,
  };
}

async function queryDocsUpdate(params) {
  let queryIndex = 2;
  let queryFilter =
    params.content !== undefined ? `content = $${queryIndex++},` : "";
  queryFilter += params.title !== undefined ? `title = $${queryIndex++},` : "";
  queryFilter = queryFilter.slice(0, -1);
  const queryResult = await pool.query(
    `
        UPDATE user_docs SET
        ${queryFilter}
        WHERE doc_id = $1 
    `,
    [params.doc_id, params.title, params.content].filter((i) => i !== undefined)
  );
  return queryResult.rows[0];
}

async function docsUpdate(datas) {
  try {
    const params = validateParams(datas);
    const doc = await queryDocsUpdate(params);
  } catch (err) {
    console.error(err);
  }
}

module.exports = docsUpdate;
