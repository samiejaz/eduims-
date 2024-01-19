export const ROUTE_URLS = {
  BUSINESS_TYPE: "/general/businesstype",
  DEPARTMENT: "/general/department",
  COUNTRY_ROUTE: "/general/country",
  TEHSIL_ROUTE: "/general/tehsil",
  BUSINESS_NATURE_ROUTE: "/general/businessnature",
  BUSINESS_SEGMENT_ROUTE: "/general/businesssegment",
  LEED_SOURCE_ROUTE: "/general/leadsource",
  LEAD_INTRODUCTION_ROUTE: "/general/leadintroduction",
  USER_ROUTE: "/general/users",
  DASHBOARD: "/dashboard",
  CUSTOMERS: {
    CUSTOMER_ENTRY: "/customer/customerentry",
    OLD_CUSTOMER_ENTRY: "/customer/oldcustomerentry",
    CUSTOMER_INVOICE: "/customer/customerinvoice",
    RECIEPT_VOUCHER_ROUTE: "/customer/reciepts",
  },
  GENERAL: {
    BUSINESS_UNITS: "/general/businessunits",
    SESSION_INFO: "/general/sessioninfo",
    PRODUCT_CATEGORY_ROUTE: "/general/productcategory",
    PRODUCT_INFO_ROUTE: "/general/productinfo",
    COMPANY_INFO_ROUTE: "/general/companyinfo",
    LEADS_INTROUDCTION_VIEWER_ROUTE: "/general/leadsview",
    LEADS_INTROUDCTION_DETAIL_VIEWER_ROUTE: "/general/leadsview/detail",
  },
  UTILITIES: {
    PRODUCT_CATEGORY_ROUTE: "/utilities/productcategory",
    PRODUCT_INFO_ROUTE: "/utilities/productinfo",
    INVOICE_DESCRIPTIONS: "/utilities/invoicedescription",
    APP_CONFIGURATION_ROUTE: "/utilities/appconfiguration",
  },
  ACCOUNTS: {
    BANK_ACCOUNT_OPENING: "/accounts/bankaccountopening",
    CUSTOMER_INVOICE: "/customer/customerinvoice",
    RECIEPT_VOUCHER_ROUTE: "/customer/reciepts",
  },
  LEADS: {
    LEADS_DASHBOARD: "/leads/dashboard",
    LEED_SOURCE_ROUTE: "/leads/leadsource",
    LEAD_INTRODUCTION_ROUTE: "/leads/leadintroduction",
  },
};

export const QUERY_KEYS = {
  BUSINESS_TYPE_QUERY_KEY: "businessTypes",
  BUSINESS_UNIT_QUERY_KEY: "businessUnits",
  DEPARTMENT_QUERY_KEY: "departments",
  COUNTRIES_QUERY_KEY: "countries",
  TEHSIL_QUERY_KEY: "tehsils",
  BUSINESS_NATURE_QUERY_KEY: "businessNature",
  BUSINESS_SEGMENT_QUERY_KEY: "businessSegments",
  LEED_SOURCE_QUERY_KEY: "leadSources",
  LEAD_INTRODUCTION_QUERY_KEY: "leadIntroduction",
  LEADS_CARD_DATA: "leadsCardData",
  LEADS_DEMO_DATA: "leadsDemoData",
  SESSION_INFO_QUERY_KEY: "sessions",
  // Select
  ALL_CUSTOMER_QUERY_KEY: "oldcustomers",
  CUSTOMER_ACCOUNTS_QUERY_KEY: "customerAccounts",
};

export const SELECT_QUERY_KEYS = {
  COUNTRIES_SELECT_QUERY_KEY: "countriesSelect",
  BUSINESS_TYPES_SELECT_QUERY_KEY: "businessTypesSelect",
  BUSINESS_NATURE_SELECT_QUERY_KEY: "businessNatureSelect",
  BUSINESS_SEGMENTS_SELECT_QUERY_KEY: "businessSegmentSelect",
  TEHSIL_SELECT_QUERY_KEY: "tehsilsSelect",
  LEAD_SOURCE_SELECT_QUERY_KEY: "leadSourcesSelect",
  DEPARTMENT_SELECT_QUERY_KEY: "departmentsSelect",
  USERS_SELECT_QUERY_KEY: "usersSelect",
  SESSION_SELECT_QUERY_KEY: "sessionsSelect",
  BANKS_SELECT_QUERY_KEY: "bankAccountsSelect",
};
