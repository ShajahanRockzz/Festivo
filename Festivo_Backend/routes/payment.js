const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET - Fetch all plans */
router.get('/', (req, res) => {
  const query = 'SELECT * FROM tbl_plan ORDER BY days ASC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching plans:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching plans'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

/* GET - Fetch higher plans available for upgrade for a specific institution */
router.get('/higher-plans/:institutionId', (req, res) => {
  const { institutionId } = req.params;

  if (!institutionId || isNaN(institutionId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid institution ID'
    });
  }

  // First, get the current plan for the institution
  const currentPlanQuery = `
    SELECT tp.*, ts.renewaldate FROM tbl_plan tp
    JOIN tbl_subscription ts ON tp.plan_id = ts.planid
    WHERE ts.institutionid = ? 
    AND ts.renewaldate >= CURDATE()
    LIMIT 1
  `;

  db.query(currentPlanQuery, [institutionId], (err, currentPlanResults) => {
    if (err) {
      console.error('Error fetching current plan:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching current plan'
      });
    }

    // If no active subscription, fetch all plans as upgrades
    if (currentPlanResults.length === 0) {
      const allPlansQuery = 'SELECT * FROM tbl_plan ORDER BY days ASC';
      
      db.query(allPlansQuery, (err, allPlans) => {
        if (err) {
          console.error('Error fetching all plans:', err);
          return res.status(500).json({
            success: false,
            message: 'Error fetching plans'
          });
        }

        return res.json({
          success: true,
          data: {
            currentPlan: null,
            availablePlans: allPlans
          }
        });
      });
    } else {
      // Get plans that have more days than current plan
      const currentPlan = currentPlanResults[0];
      const higherPlansQuery = `
        SELECT * FROM tbl_plan 
        WHERE days > ? 
        ORDER BY days ASC
      `;

      db.query(higherPlansQuery, [currentPlan.days], (err, higherPlans) => {
        if (err) {
          console.error('Error fetching higher plans:', err);
          return res.status(500).json({
            success: false,
            message: 'Error fetching available plans'
          });
        }

        res.json({
          success: true,
          data: {
            currentPlan: currentPlan,
            availablePlans: higherPlans
          }
        });
      });
    }
  });
});

/* POST - Process payment and create subscription */
router.post('/process', (req, res) => {
  const { planId, institutionId, cardHolderName, cardNumber, amount } = req.body;

  // Validation
  if (!planId || !institutionId || !cardHolderName || !cardNumber || !amount) {
    return res.status(400).json({
      success: false,
      message: 'All payment fields are required'
    });
  }

  // Get plan details to calculate renewal date
  const getPlanQuery = 'SELECT days FROM tbl_plan WHERE plan_id = ?';
  
  db.query(getPlanQuery, [planId], (err, planResults) => {
    if (err) {
      console.error('Error fetching plan:', err);
      return res.status(500).json({
        success: false,
        message: 'Error processing payment'
      });
    }

    if (planResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    const plan = planResults[0];
    const subscriptionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + plan.days);
    const renewalDateStr = renewalDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Start transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({
          success: false,
          message: 'Error processing payment'
        });
      }

      // 1. Create payment record
      const paymentQuery = `
        INSERT INTO tbl_payment (payment_date, type, typeid, amount)
        VALUES (?, 'subscription', ?, ?)
      `;

      db.query(paymentQuery, [subscriptionDate, institutionId, amount], (err, paymentResults) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error creating payment record:', err);
            res.status(500).json({
              success: false,
              message: 'Error processing payment'
            });
          });
        }

        // 2. Create or update subscription
        const checkSubscriptionQuery = `
          SELECT subscriptionid FROM tbl_subscription 
          WHERE institutionid = ? AND renewaldate >= CURDATE()
        `;

        db.query(checkSubscriptionQuery, [institutionId], (err, subscriptionResults) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error checking subscription:', err);
              res.status(500).json({
                success: false,
                message: 'Error processing payment'
              });
            });
          }

          if (subscriptionResults.length > 0) {
            // Update existing subscription
            const updateSubscriptionQuery = `
              UPDATE tbl_subscription 
              SET planid = ?, subscriptiondate = ?, renewaldate = ?
              WHERE subscriptionid = ?
            `;

            db.query(
              updateSubscriptionQuery,
              [planId, subscriptionDate, renewalDateStr, subscriptionResults[0].subscriptionid],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error updating subscription:', err);
                    res.status(500).json({
                      success: false,
                      message: 'Error processing payment'
                    });
                  });
                }

                // Commit transaction
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error('Error committing transaction:', err);
                      res.status(500).json({
                        success: false,
                        message: 'Error processing payment'
                      });
                    });
                  }

                  res.json({
                    success: true,
                    message: 'Subscription updated successfully',
                    subscriptionId: subscriptionResults[0].subscriptionid,
                    renewalDate: renewalDateStr
                  });
                });
              }
            );
          } else {
            // Create new subscription
            const insertSubscriptionQuery = `
              INSERT INTO tbl_subscription (planid, institutionid, subscriptiondate, renewaldate)
              VALUES (?, ?, ?, ?)
            `;

            db.query(
              insertSubscriptionQuery,
              [planId, institutionId, subscriptionDate, renewalDateStr],
              (err, subscriptionInsertResults) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error creating subscription:', err);
                    res.status(500).json({
                      success: false,
                      message: 'Error processing payment'
                    });
                  });
                }

                // Commit transaction
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error('Error committing transaction:', err);
                      res.status(500).json({
                        success: false,
                        message: 'Error processing payment'
                      });
                    });
                  }

                  res.status(201).json({
                    success: true,
                    message: 'Subscription created successfully',
                    subscriptionId: subscriptionInsertResults.insertId,
                    renewalDate: renewalDateStr
                  });
                });
              }
            );
          }
        });
      });
    });
  });
});

/* GET - Fetch payments/revenue for a specific institution */
router.get('/institution/:institutionId', (req, res) => {
  const { institutionId } = req.params;

  if (!institutionId || isNaN(institutionId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid institution ID'
    });
  }

  // Fetch payments for subscriptions belonging to this institution
  const query = `
    SELECT 
      p.payment_id,
      p.payment_date,
      p.type,
      p.amount,
      s.planid,
      pl.plan_name
    FROM tbl_payment p
    LEFT JOIN tbl_subscription s ON p.typeid = s.subscriptionid
    LEFT JOIN tbl_plan pl ON s.planid = pl.plan_id
    WHERE s.institutionid = ? AND p.type = 'subscription'
    ORDER BY p.payment_date DESC
  `;

  db.query(query, [institutionId], (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching payments'
      });
    }

    res.json({
      success: true,
      data: results || []
    });
  });
});

module.exports = router;
