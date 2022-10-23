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

  if (docId === false || userId === false) {
    throw Error("Params invalid!");
  }

  return {
    doc_id: docId,
    user_id: userId,
  };
}

async function queryDocsById(params) {
  const queryResult = await pool.query(
    `
        SELECT content,
        title
        FROM user_docs
        WHERE doc_id = $1
    `,
    [params.doc_id]
  );
  return queryResult.rows[0];
}

async function queryInsertDocs(params) {
  const queryResult = await pool.query(
    `
        INSERT INTO user_docs (
            user_id,
            doc_id
        )
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING content,
                  title
    `,
    [params.user_id, params.doc_id]
  );
  return queryResult.rows[0];
}

async function docsById(datas) {
  try {
    const params = validateParams(datas);
    let document = await queryDocsById(params);
    if (document === undefined) {
      document = await queryInsertDocs(params);
    }
    return document;
  } catch (err) {
    console.error(err);
  }
}

module.exports = docsById;
