'use server';
/* auth */
import loginService from './auth/login';
import logoutService from './auth/logout';
import registerService from './auth/register';
/* debt */
import debtListService from './debt/debtListService';
import debtGetService from './debt/debtGetService';
import debtCreateService from './debt/debtCreateService';
import debtUpdateService from './debt/debtUpdateService';
import debtDeleteService from './debt/debtDeleteService';
/* payment plan */
import paymentPlanListService from './payment-plan/paymentPlanListService';
import paymentPlanUpdateService from './payment-plan/paymentPlanUpdateService';

export {
	// auth
	loginService,
	registerService,
	logoutService,
	// debt
	debtListService,
	debtGetService,
	debtCreateService,
	debtUpdateService,
	debtDeleteService,
	// payment plan
	paymentPlanListService,
	paymentPlanUpdateService,
};
