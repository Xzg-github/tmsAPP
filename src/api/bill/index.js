import express from 'express';
import receiveMake from './receiveMake';
import receiveChange from './receiveChange';
import receiveBill from './receiveBill';
import receiveMonthlyBill from './receiveMonthlyBill';
import receiveApply from './receiveApply';
import payMake from './payMake';
import payChange from './payChange';
import payBill from './payBill';
import payMonthlyBill from './payMonthlyBill';
import audit from './audit';
import extraApply from './extraApply';
import append from './append';

let api = express.Router();
api.use('/receiveMake', receiveMake);
api.use('/receive_change', receiveChange);
api.use('/receiveBill', receiveBill);
api.use('/receive_monthly_bill', receiveMonthlyBill);
api.use('/receiveApply', receiveApply);
api.use('/payMake', payMake);
api.use('/pay_change', payChange);
api.use('/payBill', payBill);
api.use('/pay_monthly_bill', payMonthlyBill);
api.use('/audit', audit);
api.use('/extraApply', extraApply);
api.use('/append', append);

export default api;
