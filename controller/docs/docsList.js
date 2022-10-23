const pool = require("../../config/db");

async function queryProductCategoryList() {
  try {
    const queryResult = await pool.query(`
            SELECT * FROM product_category
            ORDER BY category ASC
        `);
    return queryResult.rows;
  } catch (err) {
    console.error(err);
  }
}

async function productCategoryList(req, res) {
  try {
    const products = await queryProductCategoryList();
    return res.json(products);
  } catch (err) {
    console.error(err);
  }
}

module.exports = productCategoryList;
