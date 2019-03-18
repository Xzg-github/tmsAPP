import express from 'express';
import apiDataSet from './dataset';
import apiModeOutputDesign from './modeOutputDesign';
import apiPublicAuthority from './publicAuthority';
import apiAccountManager from './accountManager';
import apiTenantAuthorityDistribution from './tenantAuthorityDistribution';
import apiRoleAuthorityDistribution from './roleAuthorityDistribution';
import apiDatalib from './datalib';
import apiTenantapi from './tenantapi';
import apiModeinput from './modeinput';
import apiEmailAccept from './emailAccept';
import apiCustomersArchives from './customersArchives';
import apiSuppliersArchives from './suppliersArchives';
import apiModeOutput from './modeOutput';
import customerContact from './customerContact';
import customerFactory from './customerFactory';
import customerTax from './customerTax';
import customerCost from './customerCost';
import supplierContact from './supplierContact';
import supplierCar from './supplierCar';
import supplierDriver from './supplierDriver';
import supplierSupervisor from './supplierSupervisor';
import supplierCost from './supplierCost';
import insideFactory from './insideFactory';
import insideCar from './insideCar';
import insideDriver from './insideDriver';
import insideSupervisor from './insideSupervisor';
import customerPrice from './customerPrice';
import supplierPrice from './supplierPrice';
import supplierTax from './supplierTax';
import customerService from './customerService';
import carManager from './carManager';
import corporation from './corporation';
import bank from './bank';
import customerInvoice from './customerInvoice';
import position from './position';
import customerPriceDetail from './customerPriceDetail';
import supplierPriceDetail from './supplierPriceDetail';
import customerTask from './customerTask';

let api = express.Router();
api.use('/dataset', apiDataSet);
api.use('/mode_output_design', apiModeOutputDesign);
api.use('/public_authority', apiPublicAuthority);
api.use('/account_manager', apiAccountManager);
api.use('/tenant_authority_distribution', apiTenantAuthorityDistribution);
api.use('/role_authority_distribution', apiRoleAuthorityDistribution);
api.use('/datalib', apiDatalib);
api.use('/tenantapi', apiTenantapi);
api.use('/modeinput', apiModeinput);
api.use('/emailAccept', apiEmailAccept);
api.use('/customersArchives', apiCustomersArchives);
api.use('/suppliersArchives', apiSuppliersArchives);
api.use('/mode_output', apiModeOutput);
api.use('/customer_contact', customerContact);
api.use('/customer_factory', customerFactory);
api.use('/customer_tax', customerTax);
api.use('/customer_cost', customerCost);
api.use('/supplier_contact', supplierContact);
api.use('/supplier_car', supplierCar);
api.use('/supplierDriver', supplierDriver);
api.use('/supplierSupervisor', supplierSupervisor);
api.use('/supplier_cost', supplierCost);
api.use('/inside_factory', insideFactory);
api.use('/inside_car', insideCar);
api.use('/insideDriver', insideDriver);
api.use('/insideSupervisor', insideSupervisor);
api.use('/customerPrice', customerPrice);
api.use('/supplierPrice', supplierPrice);
api.use('/supplier_tax', supplierTax);
api.use('/customer_service', customerService);
api.use('/car_manager', carManager);
api.use('/corporation', corporation);
api.use('/bank', bank);
api.use('/customer_invoice', customerInvoice);
api.use('/customer_task', customerTask);
api.use('/position', position);
api.use('/customerPriceDetail', customerPriceDetail);
api.use('/supplierPriceDetail', supplierPriceDetail);

export default api;
