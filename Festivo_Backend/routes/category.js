const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* POST - Add New Category */
router.post('/add', (req, res) => {
  const { category_name, category_description } = req.body;
  const categoryImage = req.file;

  // Validation
  if (!category_name || !category_description) {
    return res.status(400).json({
      success: false,
      message: 'Category name and description are required'
    });
  }

  // Validate category name length
  if (category_name.trim().length < 3 || category_name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Category name must be between 3 and 100 characters'
    });
  }

  // Validate description length
  if (category_description.trim().length < 10 || category_description.trim().length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Description must be between 10 and 500 characters'
    });
  }

  // Check if image is provided
  if (!categoryImage) {
    return res.status(400).json({
      success: false,
      message: 'Category image is required'
    });
  }

  // Check if category already exists
  const checkQuery = 'SELECT * FROM tbl_category WHERE category_name = ?';
  db.query(checkQuery, [category_name.trim()], (err, results) => {
    if (err) {
      console.error('Database error while checking category:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Insert new category
    const insertQuery = `
      INSERT INTO tbl_category (category_name, category_description, category_image)
      VALUES (?, ?, ?)
    `;

    db.query(
      insertQuery,
      [category_name.trim(), category_description.trim(), categoryImage.filename],
      (err, results) => {
        if (err) {
          console.error('Error inserting category:', err);
          return res.status(500).json({
            success: false,
            message: 'Error creating category'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Category added successfully',
          categoryId: results.insertId,
          data: {
            category_id: results.insertId,
            category_name: category_name.trim(),
            category_description: category_description.trim(),
            category_image: categoryImage.filename
          }
        });
      }
    );
  });
});

/* GET - Get All Categories */
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM tbl_category ORDER BY category_id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    res.status(200).json({
      success: true,
      data: results,
      total: results.length
    });
  });
});

/* GET - Get Category by ID */
router.get('/:categoryId', (req, res) => {
  const { categoryId } = req.params;

  const query = 'SELECT * FROM tbl_category WHERE category_id = ?';
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: results[0]
    });
  });
});

/* PUT - Update Category */
router.put('/update/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { category_name, category_description } = req.body;
  const categoryImage = req.file;

  // Validation
  if (!category_name || !category_description) {
    return res.status(400).json({
      success: false,
      message: 'Category name and description are required'
    });
  }

  if (categoryImage) {
    const updateQuery = `
      UPDATE tbl_category
      SET category_name = ?, category_description = ?, category_image = ?
      WHERE category_id = ?
    `;

    db.query(
      updateQuery,
      [category_name.trim(), category_description.trim(), categoryImage.filename, categoryId],
      (err, results) => {
        if (err) {
          console.error('Error updating category:', err);
          return res.status(500).json({
            success: false,
            message: 'Error updating category'
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Category updated successfully'
        });
      }
    );
  } else {
    const updateQuery = `
      UPDATE tbl_category
      SET category_name = ?, category_description = ?
      WHERE category_id = ?
    `;

    db.query(
      updateQuery,
      [category_name.trim(), category_description.trim(), categoryId],
      (err, results) => {
        if (err) {
          console.error('Error updating category:', err);
          return res.status(500).json({
            success: false,
            message: 'Error updating category'
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Category updated successfully'
        });
      }
    );
  }
});

/* DELETE - Delete Category */
router.delete('/delete/:categoryId', (req, res) => {
  const { categoryId } = req.params;

  const deleteQuery = 'DELETE FROM tbl_category WHERE category_id = ?';

  db.query(deleteQuery, [categoryId], (err, results) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting category'
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  });
});

module.exports = router;

/* GET - Get All Categories */
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM tbl_category ORDER BY category_id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    res.status(200).json({
      success: true,
      data: results,
      total: results.length
    });
  });
});

/* GET - Get Category by ID */
router.get('/:categoryId', (req, res) => {
  const { categoryId } = req.params;

  const query = 'SELECT * FROM tbl_category WHERE categoryId = ?';
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: results[0]
    });
  });
});

/* PUT - Update Category */
router.put('/update/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { categoryName, description, status } = req.body;

  // Validation
  if (!categoryName || !description || !status) {
    return res.status(400).json({
      success: false,
      message: 'Category name, description, and status are required'
    });
  }

  const updateQuery = `
    UPDATE tbl_category
    SET categoryName = ?, description = ?, status = ?, updatedAt = NOW()
    WHERE categoryId = ?
  `;

  db.query(
    updateQuery,
    [categoryName.trim(), description.trim(), status, categoryId],
    (err, results) => {
      if (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({
          success: false,
          message: 'Error updating category'
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Category updated successfully'
      });
    }
  );
});

/* DELETE - Delete Category */
router.delete('/delete/:categoryId', (req, res) => {
  const { categoryId } = req.params;

  const deleteQuery = 'DELETE FROM tbl_category WHERE categoryId = ?';

  db.query(deleteQuery, [categoryId], (err, results) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting category'
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  });
});

module.exports = router;
