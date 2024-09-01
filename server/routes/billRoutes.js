const express = require('express');
const { createBill, getBillByUser, updateBill, deleteBill, upload} = require('../controllers/billsController');

const router = express.Router();

router.post('/bills', createBill);
router.get('/bills/:userId', getBillByUser);
router.delete('/bills/:billId', deleteBill);
router.patch('/bills/:billId',upload.single('image'), updateBill);


module.exports = router;