// App State Management
const STATE_KEYS = {
  SETTINGS: 'invoice_flow_settings',
  PARTIES: 'invoice_flow_parties',
  INVOICES: 'invoice_flow_invoices',
  THEME: 'invoice_flow_theme'
};

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

let state = {
  theme: 'light',
  settings: null,
  parties: [],
  invoicesHistory: [],
  currentInvoice: {
    partyName: '',
    partyPhone: '',
    partyEmail: '',
    partyAddressLine1: '',
    partyAddressLine2: '',
    partyCity: '',
    partyDistrict: '',
    partyPincode: '',
    partyCountry: '',
    partyCountryCode: '',
    partyTaxId: '',
    items: [],
    invoiceNumber: '',
    date: '',
    dueDate: '',
    currency: 'INR',
    paymentTerms: 'Due on receipt',
    status: 'Pending',
    shipping: 0,
    packaging: 0,
    adjustment: 0,
    roundOffActive: true
  },
  activeView: 'invoices-view',
  historyActive: false,
  editingInvoiceId: null
};

// DOM Elements cache
const DOM = {
  body: document.body,
  navItems: document.querySelectorAll('.nav-item'),
  sections: document.querySelectorAll('.view-section'),
  themeToggle: document.getElementById('dark-theme-toggle'),
  
  // Section Invoices
  invoiceWorkspaceTitle: document.getElementById('invoice-workspace-title'),
  btnToggleHistory: document.getElementById('btn-toggle-history'),
  btnNewInvoice: document.getElementById('btn-new-invoice'),
  invoiceCreationWorkspace: document.getElementById('invoice-creation-workspace'),
  invoiceHistoryWorkspace: document.getElementById('invoice-history-workspace'),
  searchInvoices: document.getElementById('search-invoices'),
  invoiceHistoryBody: document.getElementById('invoice-history-body'),
  
  // Step 1 Elements
  partyName: document.getElementById('party-name'),
  partyPhone: document.getElementById('party-phone'),
  partyEmail: document.getElementById('party-email'),
  partyAddressSearch: document.getElementById('party-address-search'),
  partyAddressAutocomplete: document.getElementById('party-address-autocomplete'),
  partyAddressLine1: document.getElementById('party-address-line1'),
  partyAddressLine2: document.getElementById('party-address-line2'),
  partyCity: document.getElementById('party-city'),
  partyDistrict: document.getElementById('party-district'),
  partyPincode: document.getElementById('party-pincode'),
  partyCountry: document.getElementById('party-country'),
  partyTaxId: document.getElementById('party-tax-id'),
  partyAutocomplete: document.getElementById('party-autocomplete'),
  
  // Step 2 Elements
  btnOpenAddItem: document.getElementById('btn-open-add-item'),
  editorItemsBody: document.getElementById('editor-items-body'),
  
  // Step 3 Elements
  invoiceNumber: document.getElementById('invoice-number'),
  invoiceDate: document.getElementById('invoice-date'),
  invoiceDueDate: document.getElementById('invoice-due-date'),
  currencySelect: document.getElementById('currency-select'),
  btnOpenCharges: document.getElementById('btn-open-charges'),
  btnGenerateInvoice: document.getElementById('btn-generate-invoice'),
  paymentTerms: document.getElementById('payment-terms'),
  invoiceStatus: document.getElementById('invoice-status'),
  
  // Live Preview Elements
  prevCompanyName: document.getElementById('prev-company-name'),
  prevCompanyTagline: document.getElementById('prev-company-tagline'),
  prevCompanyAddress: document.getElementById('prev-company-address'),
  prevCompanyContact: document.getElementById('prev-company-contact'),
  prevCompanyTax: document.getElementById('prev-company-tax'),
  prevCompanyLogo: document.getElementById('prev-company-logo'),
  prevInvNum: document.getElementById('prev-inv-num'),
  prevInvDate: document.getElementById('prev-inv-date'),
  prevInvDue: document.getElementById('prev-inv-due'),
  prevFromCompanyName: document.getElementById('prev-from-company-name'),
  prevFromContact: document.getElementById('prev-from-contact'),
  prevFromCin: document.getElementById('prev-from-cin'),
  prevPartyName: document.getElementById('prev-party-name'),
  prevPartyAddress: document.getElementById('prev-party-address'),
  prevPartyContact: document.getElementById('prev-party-contact'),
  prevPartyTax: document.getElementById('prev-party-tax'),
  prevItemsBody: document.getElementById('prev-items-body'),
  prevPaymentBlock: document.getElementById('prev-payment-block'),
  prevBankBlock: document.getElementById('prev-bank-block'),
  prevBankNameVal: document.getElementById('prev-bank-name-val'),
  prevBankHolderVal: document.getElementById('prev-bank-holder-val'),
  prevBankAcVal: document.getElementById('prev-bank-ac-val'),
  prevBankIfscVal: document.getElementById('prev-bank-ifsc-val'),
  prevBankBranchVal: document.getElementById('prev-bank-branch-val'),
  prevBankTypeVal: document.getElementById('prev-bank-type-val'),
  prevBankSwiftVal: document.getElementById('prev-bank-swift-val'),
  prevBankSwiftRow: document.getElementById('prev-bank-swift-row'),
  prevPaymentAmount: document.getElementById('prev-payment-amount'),
  prevPaymentQrUpiText: document.getElementById('prev-payment-qr-upi-text'),
  prevUpiBlock: document.getElementById('prev-upi-block'),
  prevPaymentQr: document.getElementById('prev-payment-qr'),
  prevPaymentUpi: document.getElementById('prev-payment-upi'),
  prevWordsContainer: document.getElementById('prev-words-container'),
  prevWordsText: document.getElementById('prev-words-text'),
  prevSigLineText: document.getElementById('prev-sig-line-text'),
  prevSubtotal: document.getElementById('prev-subtotal'),
  prevShippingRow: document.getElementById('prev-shipping-row'),
  prevShippingVal: document.getElementById('prev-shipping-val'),
  prevPackagingRow: document.getElementById('prev-packaging-row'),
  prevPackagingVal: document.getElementById('prev-packaging-val'),
  prevAdjustmentRow: document.getElementById('prev-adjustment-row'),
  prevAdjustmentVal: document.getElementById('prev-adjustment-val'),
  prevTaxSummaryRow: document.getElementById('prev-tax-summary-row'),
  prevTaxVal: document.getElementById('prev-tax-val'),
  prevDiscountSummaryRow: document.getElementById('prev-discount-summary-row'),
  prevDiscountVal: document.getElementById('prev-discount-val'),
  prevRoundRow: document.getElementById('prev-round-row'),
  prevRoundVal: document.getElementById('prev-round-val'),
  prevGrandTotal: document.getElementById('prev-grand-total'),
  prevTerms: document.getElementById('prev-terms'),
  prevSigContainer: document.getElementById('prev-sig-container'),
  prevSigImg: document.getElementById('prev-sig-img'),
  prevPaymentTerms: document.getElementById('prev-payment-terms'),
  prevInvoiceStatus: document.getElementById('prev-invoice-status'),
  prevPlaceSupply: document.getElementById('prev-place-supply'),
  prevSigPersonName: document.getElementById('prev-sig-person-name'),
  prevSigPersonDesignation: document.getElementById('prev-sig-person-designation'),
  prevSigCompanyName: document.getElementById('prev-sig-company-name'),
  prevTaxesTbody: document.getElementById('prev-taxes-tbody'),
  prevTaxableVal: document.getElementById('prev-taxable-val'),
  prevTaxableRow: document.getElementById('prev-taxable-row'),
  prevNotesText: document.getElementById('prev-notes-text'),
  prevThanksText: document.getElementById('prev-thanks-text'),
  
  // Drawer Add Item
  drawerBackdrop: document.getElementById('drawer-backdrop'),
  addItemDrawer: document.getElementById('add-item-drawer'),
  btnCloseDrawer: document.getElementById('btn-close-drawer'),
  itemName: document.getElementById('item-name'),
  itemDescription: document.getElementById('item-description'),
  itemQty: document.getElementById('item-qty'),
  itemUnit: document.getElementById('item-unit'),
  itemPrice: document.getElementById('item-price'),
  itemTaxApplicable: document.getElementById('item-tax-applicable'),
  taxFieldsContainer: document.getElementById('tax-fields-container'),
  itemTaxType: document.getElementById('item-tax-type'),
  itemTaxPercent: document.getElementById('item-tax-percent'),
  itemDiscountApplicable: document.getElementById('item-discount-applicable'),
  discountFieldsContainer: document.getElementById('discount-fields-container'),
  itemDiscountType: document.getElementById('item-discount-type'),
  itemDiscountValue: document.getElementById('item-discount-value'),
  itemKeepOpen: document.getElementById('item-keep-open'),
  btnDrawerAdd: document.getElementById('btn-drawer-add'),
  
  // Modal Charges
  modalBackdrop: document.getElementById('modal-backdrop'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  chargeShipping: document.getElementById('charge-shipping'),
  chargePackaging: document.getElementById('charge-packaging'),
  chargeAdjustment: document.getElementById('charge-adjustment'),
  chargeRoundoff: document.getElementById('charge-roundoff'),
  btnSaveCharges: document.getElementById('btn-save-charges'),
  
  // Parties View
  btnAddParty: document.getElementById('btn-add-party'),
  searchParties: document.getElementById('search-parties'),
  partiesTableBody: document.getElementById('parties-table-body'),
  
  // Settings View
  settCompanyName: document.getElementById('sett-company-name'),
  settCompanyTagline: document.getElementById('sett-company-tagline'),
  settCompanyTax: document.getElementById('sett-company-tax'),
  settCompanyCin: document.getElementById('sett-company-cin'),
  settCompanyPhone: document.getElementById('sett-company-phone'),
  settCompanyEmail: document.getElementById('sett-company-email'),
  settAddressSearch: document.getElementById('sett-address-search'),
  settAddressAutocomplete: document.getElementById('sett-address-autocomplete'),
  settAddressLine1: document.getElementById('sett-address-line1'),
  settAddressLine2: document.getElementById('sett-address-line2'),
  settCity: document.getElementById('sett-city'),
  settDistrict: document.getElementById('sett-district'),
  settPincode: document.getElementById('sett-pincode'),
  settCountry: document.getElementById('sett-country'),
  settBankName: document.getElementById('sett-bank-name'),
  settBankHolder: document.getElementById('sett-bank-holder'),
  settBankAc: document.getElementById('sett-bank-ac'),
  settBankIfsc: document.getElementById('sett-bank-ifsc'),
  settBankBranch: document.getElementById('sett-bank-branch'),
  settBankType: document.getElementById('sett-bank-type'),
  settBankSwift: document.getElementById('sett-bank-swift'),
  settUpiEnable: document.getElementById('sett-upi-enable'),
  settUpiContainer: document.getElementById('sett-upi-container'),
  settUpiId: document.getElementById('sett-upi-id'),
  settQrEnable: document.getElementById('sett-qr-enable'),
  settQrUploadContainer: document.getElementById('sett-qr-upload-container'),
  settLogoInput: document.getElementById('sett-logo-input'),
  settLogoPreview: document.getElementById('sett-logo-preview'),
  btnRemoveLogo: document.getElementById('btn-remove-logo'),
  settSigInput: document.getElementById('sett-sig-input'),
  settSigPreview: document.getElementById('sett-sig-preview'),
  settSigName: document.getElementById('sett-sig-name'),
  settSigDesignation: document.getElementById('sett-sig-designation'),
  btnRemoveSig: document.getElementById('btn-remove-sig'),
  settQrInput: document.getElementById('sett-qr-input'),
  settQrPreview: document.getElementById('sett-qr-preview'),
  btnRemoveQr: document.getElementById('btn-remove-qr'),
  settDefaultTerms: document.getElementById('sett-default-terms'),
  btnSaveSettings: document.getElementById('btn-save-settings'),
  
  // Setup Wizard
  setupWizard: document.getElementById('setup-wizard'),
  btnSaveWizard: document.getElementById('btn-save-wizard'),
  wizCompanyName: document.getElementById('wiz-company-name'),
  wizCompanyTagline: document.getElementById('wiz-company-tagline'),
  wizCompanyTax: document.getElementById('wiz-company-tax'),
  wizCompanyCin: document.getElementById('wiz-company-cin'),
  wizCompanyPhone: document.getElementById('wiz-company-phone'),
  wizCompanyEmail: document.getElementById('wiz-company-email'),
  wizAddressSearch: document.getElementById('wiz-address-search'),
  wizAddressAutocomplete: document.getElementById('wiz-address-autocomplete'),
  wizAddressLine1: document.getElementById('wiz-address-line1'),
  wizAddressLine2: document.getElementById('wiz-address-line2'),
  wizCity: document.getElementById('wiz-city'),
  wizDistrict: document.getElementById('wiz-district'),
  wizPincode: document.getElementById('wiz-pincode'),
  wizCountry: document.getElementById('wiz-country'),
  wizBankName: document.getElementById('wiz-bank-name'),
  wizBankHolder: document.getElementById('wiz-bank-holder'),
  wizBankAc: document.getElementById('wiz-bank-ac'),
  wizBankIfsc: document.getElementById('wiz-bank-ifsc'),
  wizBankBranch: document.getElementById('wiz-bank-branch'),
  wizBankType: document.getElementById('wiz-bank-type'),
  wizBankSwift: document.getElementById('wiz-bank-swift'),
  wizUpiEnable: document.getElementById('wiz-upi-enable'),
  wizUpiContainer: document.getElementById('wiz-upi-container'),
  wizUpiId: document.getElementById('wiz-upi-id'),
  wizQrEnable: document.getElementById('wiz-qr-enable'),
  wizQrUploadContainer: document.getElementById('wiz-qr-upload-container'),
  wizLogoInput: document.getElementById('wiz-logo-input'),
  wizLogoPreview: document.getElementById('wiz-logo-preview'),
  wizSigInput: document.getElementById('wiz-sig-input'),
  wizSigPreview: document.getElementById('wiz-sig-preview'),
  wizSigName: document.getElementById('wiz-sig-name'),
  wizSigDesignation: document.getElementById('wiz-sig-designation'),
  wizQrInput: document.getElementById('wiz-qr-input'),
  wizQrPreview: document.getElementById('wiz-qr-preview')
};

// Temp image uploads state for Setup Wizard
let tempWizardUploads = {
  logo: '',
  signature: '',
  qr: ''
};

// --- INITIALIZATION ---
function init() {
  loadData();
  setupEventListeners();
  checkBusinessSetup();
  initTheme();
  initInvoiceDates();
  
  // Start with default clean invoice
  resetInvoiceForm();
}

// Load data from LocalStorage
function loadData() {
  const storedSettings = localStorage.getItem(STATE_KEYS.SETTINGS);
  state.settings = storedSettings ? JSON.parse(storedSettings) : null;
  
  // Data migration for business settings address
  if (state.settings && state.settings.companyAddress && !state.settings.companyAddressLine1) {
    state.settings.companyAddressLine1 = state.settings.companyAddress;
    delete state.settings.companyAddress;
    localStorage.setItem(STATE_KEYS.SETTINGS, JSON.stringify(state.settings));
  }
  
  const storedParties = localStorage.getItem(STATE_KEYS.PARTIES);
  state.parties = storedParties ? JSON.parse(storedParties) : [];
  
  // Data migration for saved parties address
  let partiesUpdated = false;
  state.parties.forEach(p => {
    if (p.address && !p.addressLine1) {
      p.addressLine1 = p.address;
      delete p.address;
      partiesUpdated = true;
    }
  });
  if (partiesUpdated) {
    localStorage.setItem(STATE_KEYS.PARTIES, JSON.stringify(state.parties));
  }
  
  const storedInvoices = localStorage.getItem(STATE_KEYS.INVOICES);
  state.invoicesHistory = storedInvoices ? JSON.parse(storedInvoices) : [];
  
  // Data migration for invoice history addresses
  let historyUpdated = false;
  state.invoicesHistory.forEach(inv => {
    if (inv.partyAddress && !inv.partyAddressLine1) {
      inv.partyAddressLine1 = inv.partyAddress;
      delete inv.partyAddress;
      historyUpdated = true;
    }
  });
  if (historyUpdated) {
    localStorage.setItem(STATE_KEYS.INVOICES, JSON.stringify(state.invoicesHistory));
  }
  
  const storedTheme = localStorage.getItem(STATE_KEYS.THEME);
  state.theme = storedTheme || 'light';
}

// Check if Business setup is complete, otherwise show wizard
function checkBusinessSetup() {
  if (!state.settings) {
    DOM.setupWizard.style.display = 'flex';
  } else {
    DOM.setupWizard.style.display = 'none';
    populateSettingsForm();
  }
}

// Populate Settings UI from current Settings state
function populateSettingsForm() {
  if (!state.settings) return;
  const s = state.settings;
  
  DOM.settCompanyName.value = s.companyName || '';
  DOM.settCompanyTagline.value = s.companyTagline || '';
  DOM.settCompanyTax.value = s.companyTax || '';
  DOM.settCompanyCin.value = s.companyCin || '';
  DOM.settCompanyPhone.value = s.companyPhone || '';
  DOM.settCompanyEmail.value = s.companyEmail || '';
  
  DOM.settAddressSearch.value = '';
  DOM.settAddressLine1.value = s.companyAddressLine1 || '';
  DOM.settAddressLine2.value = s.companyAddressLine2 || '';
  DOM.settCity.value = s.companyCity || '';
  DOM.settDistrict.value = s.companyDistrict || '';
  DOM.settPincode.value = s.companyPincode || '';
  DOM.settCountry.value = s.companyCountry || '';
  
  DOM.settBankName.value = s.bankName || '';
  DOM.settBankHolder.value = s.bankHolder || '';
  DOM.settBankAc.value = s.bankAc || '';
  DOM.settBankIfsc.value = s.bankIfsc || '';
  DOM.settBankBranch.value = s.bankBranch || '';
  DOM.settBankType.value = s.bankType || '';
  DOM.settBankSwift.value = s.bankSwift || '';
  
  DOM.settUpiEnable.checked = s.upiEnable || false;
  DOM.settUpiContainer.style.display = s.upiEnable ? 'grid' : 'none';
  DOM.settUpiId.value = s.upiId || '';
  DOM.settQrEnable.checked = s.qrEnable || false;
  DOM.settQrUploadContainer.style.display = (s.upiEnable && s.qrEnable) ? 'block' : 'none';
  
  DOM.settDefaultTerms.value = s.defaultTerms || '';
  DOM.settSigName.value = s.companySignatoryName || '';
  DOM.settSigDesignation.value = s.companySignatoryDesignation || '';
  
  updateLogoPreview(s.logo, 'sett');
  updateSigPreview(s.signature, 'sett');
  updateQrPreview(s.qr, 'sett');
}

// Handle file loading previews
function updateLogoPreview(base64Str, prefix = 'sett') {
  const container = DOM[`${prefix}LogoPreview`];
  if (base64Str) {
    container.querySelector('.upload-preview-img').src = base64Str;
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
  }
}

function updateSigPreview(base64Str, prefix = 'sett') {
  const container = DOM[`${prefix}SigPreview`];
  if (base64Str) {
    container.querySelector('.upload-preview-img').src = base64Str;
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
  }
}

function updateQrPreview(base64Str, prefix = 'sett') {
  const container = DOM[`${prefix}QrPreview`];
  if (base64Str) {
    container.querySelector('.upload-preview-img').src = base64Str;
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
  }
}

// --- THEME ---
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  DOM.themeToggle.checked = (state.theme === 'dark');
}

function toggleTheme(e) {
  state.theme = e.target.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem(STATE_KEYS.THEME, state.theme);
}

// --- DATE INITIALIZATION ---
function initInvoiceDates() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 15); // Default 15 days credit
  const dueStr = dueDate.toISOString().split('T')[0];
  
  DOM.invoiceDate.value = dateStr;
  DOM.invoiceDueDate.value = dueStr;
  
  state.currentInvoice.date = dateStr;
  state.currentInvoice.dueDate = dueStr;
}

// --- CORE LOGIC: CALCULATIONS ---
function calculateInvoice() {
  const inv = state.currentInvoice;
  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;
  
  // Calculate itemized details
  inv.items.forEach(item => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const baseVal = qty * price;
    
    // Calculate Discount
    let discount = 0;
    if (item.discountApplicable) {
      const dVal = parseFloat(item.discountValue) || 0;
      if (item.discountType === 'percent') {
        discount = baseVal * (dVal / 100);
      } else {
        discount = dVal;
      }
      // Caps discount at base price
      discount = Math.min(discount, baseVal);
    }
    
    const taxableVal = baseVal - discount;
    
    // Calculate Tax
    let tax = 0;
    if (item.taxApplicable) {
      const taxPercent = parseFloat(item.taxPercent) || 0;
      tax = taxableVal * (taxPercent / 100);
    }
    
    item.total = taxableVal + tax;
    
    subtotal += baseVal;
    discountTotal += discount;
    taxTotal += tax;
  });
  
  // Additions
  const shipping = parseFloat(inv.shipping) || 0;
  const packaging = parseFloat(inv.packaging) || 0;
  const adjustment = parseFloat(inv.adjustment) || 0;
  
  const taxableAmount = subtotal - discountTotal;
  const preRoundTotal = taxableAmount + taxTotal + shipping + packaging + adjustment;
  
  let grandTotal = preRoundTotal;
  let roundOff = 0;
  
  if (inv.roundOffActive) {
    grandTotal = Math.round(preRoundTotal);
    roundOff = grandTotal - preRoundTotal;
  }
  
  inv.subtotal = subtotal;
  inv.taxableAmount = taxableAmount;
  inv.taxTotal = taxTotal;
  inv.discountTotal = discountTotal;
  inv.roundOff = roundOff;
  inv.grandTotal = Math.max(0, grandTotal);
  
  renderLivePreview();
  renderEditorItemsTable();
}
// --- RENDER LIVE PREVIEW ---
function renderLivePreview() {
  const inv = state.currentInvoice;
  const sett = state.settings || {};
  const sym = CURRENCY_SYMBOLS[inv.currency] || '₹';
  
  // Company info (Header Brand)
  DOM.prevCompanyName.textContent = sett.companyName || 'Your Company Name';
  if (DOM.prevCompanyTagline) {
    DOM.prevCompanyTagline.textContent = sett.companyTagline || '';
    DOM.prevCompanyTagline.style.display = sett.companyTagline ? 'block' : 'none';
  }
  
  const companyFlagUrl = sett.companyCountryCode ? `https://flagcdn.com/w20/${sett.companyCountryCode.toLowerCase()}.png` : '';
  const companyFlagHtml = companyFlagUrl ? `<img src="${companyFlagUrl}" alt="Flag" style="width: 14px; height: 10px; margin-left: 4px; vertical-align: middle; border: 1px solid #cbd5e1;">` : '';
  
  let compAddrHtml = '';
  if (sett.companyAddressLine1) compAddrHtml += `<div>${escapeHtml(sett.companyAddressLine1)}</div>`;
  if (sett.companyAddressLine2) compAddrHtml += `<div>${escapeHtml(sett.companyAddressLine2)}</div>`;
  if (sett.companyCity || sett.companyDistrict || sett.companyPincode) {
    let line = `${sett.companyCity || ''}${sett.companyCity && sett.companyDistrict ? ', ' : ''}${sett.companyDistrict || ''}`;
    if (sett.companyPincode) line += ` - ${sett.companyPincode}`;
    compAddrHtml += `<div>${escapeHtml(line)}</div>`;
  }
  if (sett.companyCountry) compAddrHtml += `<div>${escapeHtml(sett.companyCountry)}${companyFlagHtml}</div>`;
  DOM.prevCompanyAddress.innerHTML = compAddrHtml || 'Company Address';

  if (DOM.prevCompanyContact) {
    let companyContact = '';
    if (sett.companyPhone && sett.companyEmail) {
      companyContact = `${sett.companyPhone} · ${sett.companyEmail}`;
    } else {
      companyContact = sett.companyPhone || sett.companyEmail || '';
    }
    DOM.prevCompanyContact.textContent = companyContact;
    DOM.prevCompanyContact.style.display = companyContact ? 'block' : 'none';
  }
  
  const compTaxLabel = getTaxLabel(sett.companyTax);
  DOM.prevCompanyTax.textContent = sett.companyTax ? `${compTaxLabel}: ${sett.companyTax}` : '';
  DOM.prevCompanyTax.style.display = sett.companyTax ? 'block' : 'none';

  const prevCompanyCin = document.getElementById('prev-company-cin');
  if (prevCompanyCin) {
    prevCompanyCin.textContent = sett.companyCin ? `CIN: ${sett.companyCin}` : '';
    prevCompanyCin.style.display = sett.companyCin ? 'block' : 'none';
  }
  
  const prevLogoText = document.getElementById('prev-logo-text');
  const logoBox = document.querySelector('.preview-logo-box');
  if (sett.logo) {
    DOM.prevCompanyLogo.src = sett.logo;
    DOM.prevCompanyLogo.style.display = 'block';
    if (logoBox) logoBox.style.display = 'block';
    if (prevLogoText) prevLogoText.style.display = 'none';
  } else {
    DOM.prevCompanyLogo.style.display = 'none';
    if (logoBox) logoBox.style.display = 'none';
    if (prevLogoText) prevLogoText.style.display = 'none';
  }
  if (logoBox) {
    logoBox.closest('.preview-company-brand')?.classList.toggle('has-logo', !!sett.logo);
  }
  
  // Invoice details (Header Meta)
  DOM.prevInvNum.textContent = inv.invoiceNumber ? inv.invoiceNumber : '-';
  DOM.prevInvDate.textContent = formatDate(inv.date);
  DOM.prevInvDue.textContent = formatDate(inv.dueDate);
  
  if (DOM.prevPlaceSupply) {
    DOM.prevPlaceSupply.textContent = inv.partyDistrict || inv.partyCity || '-';
    const container = document.getElementById('prev-place-supply-container');
    if (container) {
      container.style.display = (inv.partyDistrict || inv.partyCity) ? 'block' : 'none';
    }
  }
  
  // Status is intentionally omitted from the printable invoice preview.
  if (DOM.prevInvoiceStatus) {
    DOM.prevInvoiceStatus.textContent = '';
    DOM.prevInvoiceStatus.className = 'badge';
    DOM.prevInvoiceStatus.closest('.preview-status-badge-container')?.style.setProperty('display', 'none');
  }
  
  // BILL FROM Column
  if (DOM.prevFromCompanyName) {
    DOM.prevFromCompanyName.textContent = sett.companyName || 'Company Name';
    
    let fromContact = '';
    if (sett.companyEmail && sett.companyPhone) {
      fromContact = `${sett.companyEmail} · ${sett.companyPhone}`;
    } else {
      fromContact = sett.companyEmail || sett.companyPhone || '';
    }
    DOM.prevFromContact.textContent = fromContact;
    DOM.prevFromContact.style.display = fromContact ? 'block' : 'none';
    
    DOM.prevFromCin.textContent = sett.companyCin ? `CIN: ${sett.companyCin}` : '';
    DOM.prevFromCin.style.display = sett.companyCin ? 'block' : 'none';
  }
  
  // BILL TO Column
  DOM.prevPartyName.textContent = inv.partyName || 'Customer Name';
  
  const partyFlagUrl = inv.partyCountryCode ? `https://flagcdn.com/w20/${inv.partyCountryCode.toLowerCase()}.png` : '';
  const partyFlagHtml = partyFlagUrl ? `<img src="${partyFlagUrl}" alt="Flag" style="width: 14px; height: 10px; margin-left: 4px; vertical-align: middle; border: 1px solid #cbd5e1;">` : '';
  
  let partyAddrHtml = '';
  if (inv.partyAddressLine1) partyAddrHtml += `<div>${escapeHtml(inv.partyAddressLine1)}</div>`;
  if (inv.partyAddressLine2) partyAddrHtml += `<div>${escapeHtml(inv.partyAddressLine2)}</div>`;
  if (inv.partyCity || inv.partyDistrict || inv.partyPincode) {
    let line = `${inv.partyCity || ''}${inv.partyCity && inv.partyDistrict ? ', ' : ''}${inv.partyDistrict || ''}`;
    if (inv.partyPincode) line += ` - ${inv.partyPincode}`;
    partyAddrHtml += `<div>${escapeHtml(line)}</div>`;
  }
  if (inv.partyCountry) partyAddrHtml += `<div>${escapeHtml(inv.partyCountry)}${partyFlagHtml}</div>`;
  DOM.prevPartyAddress.innerHTML = partyAddrHtml || '';
  
  let partyContact = '';
  if (inv.partyEmail && inv.partyPhone) {
    partyContact = `${inv.partyEmail} · ${inv.partyPhone}`;
  } else {
    partyContact = inv.partyEmail || inv.partyPhone || '';
  }
  DOM.prevPartyContact.textContent = partyContact;
  DOM.prevPartyContact.style.display = partyContact ? 'block' : 'none';
  
  const partyTaxLabel = getTaxLabel(inv.partyTaxId);
  DOM.prevPartyTax.textContent = inv.partyTaxId ? `${partyTaxLabel}: ${inv.partyTaxId}` : '';
  DOM.prevPartyTax.style.display = inv.partyTaxId ? 'block' : 'none';
  
  // Items Table
  DOM.prevItemsBody.innerHTML = '';
  if (inv.items.length === 0) {
    DOM.prevItemsBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: #94a3b8; padding: 24px 0;">No items added yet.</td></tr>`;
  } else {
    inv.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      const baseVal = qty * price;
      
      // Calculate Discount details
      let discountText = '';
      let discount = 0;
      if (item.discountApplicable) {
        const dVal = parseFloat(item.discountValue) || 0;
        if (item.discountType === 'percent') {
          discount = baseVal * (dVal / 100);
          discountText = `Discount: ${dVal}% (-${sym}${formatNumber(discount)})`;
        } else {
          discount = dVal;
          discountText = `Discount: -${sym}${formatNumber(discount)}`;
        }
      }
      
      // Calculate Tax details
      let taxText = '';
      if (item.taxApplicable) {
        const taxPercent = parseFloat(item.taxPercent) || 0;
        const taxAmount = (baseVal - discount) * (taxPercent / 100);
        taxText = `Tax: ${taxPercent}% ${item.taxType} (${sym}${formatNumber(taxAmount)})`;
      }
      
      let extraDetails = '';
      if (discountText && taxText) {
        extraDetails = `<span style="display:block; font-size: 8px; color: #64748b; margin-top: 2px;">• ${discountText} · ${taxText}</span>`;
      } else if (discountText) {
        extraDetails = `<span style="display:block; font-size: 8px; color: #64748b; margin-top: 2px;">• ${discountText}</span>`;
      } else if (taxText) {
        extraDetails = `<span style="display:block; font-size: 8px; color: #64748b; margin-top: 2px;">• ${taxText}</span>`;
      }
      
      const qtyText = item.unit ? `${item.qty} ${item.unit}` : `${item.qty}`;
      
      tr.innerHTML = `
        <td style="text-align: left; vertical-align: top;">
          <strong style="display:block; color:var(--paper-text); font-size: 10px;">${escapeHtml(item.name)}</strong>
          ${item.description ? `<span style="font-size: 9px; color: var(--paper-text-muted); display: block; margin-top: 2px; line-height: 1.3;">${escapeHtml(item.description)}</span>` : ''}
          ${extraDetails}
        </td>
        <td style="text-align: center; vertical-align: top; font-size: 10px;">${qtyText}</td>
        <td style="text-align: right; vertical-align: top; font-size: 10px;">${sym}${formatNumber(item.price)}</td>
        <td style="text-align: right; vertical-align: top; font-size: 10px;"><strong>${sym}${formatNumber(item.total)}</strong></td>
      `;
      DOM.prevItemsBody.appendChild(tr);
    });
  }
  
  // Payments block
  const hasBank = !!(sett.bankName || sett.bankAc || sett.bankIfsc);
  const hasUpi = !!(sett.upiEnable && sett.upiId);
  const hasSig = !!(sett.signature || sett.companySignatoryName);
  
  if (hasBank || hasUpi || hasSig) {
    DOM.prevPaymentBlock.style.display = 'grid';
    
    // Set layout grid template dynamically based on visible cards
    const paymentBlock = DOM.prevPaymentBlock;
    if (paymentBlock) {
      const visibleCount = (hasBank ? 1 : 0) + (hasUpi ? 1 : 0) + (hasSig ? 1 : 0);
      if (visibleCount === 3) {
        paymentBlock.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
      } else if (visibleCount === 2) {
        paymentBlock.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
      } else {
        paymentBlock.style.gridTemplateColumns = '1fr';
      }
    }
    
    if (hasBank) {
      DOM.prevBankHolderVal.textContent = sett.bankHolder || sett.companyName || '-';
      DOM.prevBankNameVal.textContent = sett.bankName || '-';
      DOM.prevBankAcVal.textContent = sett.bankAc || '-';
      DOM.prevBankIfscVal.textContent = sett.bankIfsc || '-';
      DOM.prevBankBranchVal.textContent = sett.bankBranch || '-';
      
      if (DOM.prevBankTypeVal) {
        DOM.prevBankTypeVal.textContent = sett.bankType || '-';
      }
      if (DOM.prevBankSwiftVal) {
        DOM.prevBankSwiftVal.textContent = sett.bankSwift || '-';
        const row = document.getElementById('prev-bank-swift-row');
        if (row) row.style.display = sett.bankSwift ? 'block' : 'none';
      }
      
      DOM.prevBankBlock.style.display = 'flex';
    } else {
      DOM.prevBankBlock.style.display = 'none';
    }
    
    if (hasUpi) {
      DOM.prevPaymentUpi.textContent = sett.upiId;
      if (DOM.prevPaymentAmount) {
        DOM.prevPaymentAmount.textContent = `${sym}${formatNumber(inv.grandTotal)}`;
      }
      const qrUpiText = document.getElementById('prev-payment-qr-upi-text');
      if (qrUpiText) {
        qrUpiText.textContent = sett.upiId;
      }
      
      DOM.prevUpiBlock.style.display = 'flex';
      
      // Control QR code visibility based on qrEnable checkbox
      const qrBox = DOM.prevPaymentBlock.querySelector('.upi-qr-box');
      if (sett.qrEnable) {
        if (qrBox) qrBox.style.display = 'flex';
        if (sett.qr) {
          DOM.prevPaymentQr.src = sett.qr;
          DOM.prevPaymentQr.style.display = 'block';
        } else {
          const companyNameEncoded = encodeURIComponent(sett.companyName || 'Seller');
          const upiUrl = `upi://pay?pa=${encodeURIComponent(sett.upiId)}&pn=${companyNameEncoded}&am=${inv.grandTotal}`;
          DOM.prevPaymentQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`;
          DOM.prevPaymentQr.style.display = 'block';
        }
      } else {
        if (qrBox) qrBox.style.display = 'none';
        DOM.prevPaymentQr.style.display = 'none';
      }
    } else {
      DOM.prevUpiBlock.style.display = 'none';
    }
    
    if (hasSig) {
      if (sett.signature) {
        DOM.prevSigImg.src = sett.signature;
        DOM.prevSigImg.style.display = 'block';
      } else {
        DOM.prevSigImg.style.display = 'none';
      }
      
      DOM.prevSigPersonName.textContent = sett.companySignatoryName || '';
      DOM.prevSigPersonDesignation.textContent = sett.companySignatoryDesignation || '';
      DOM.prevSigCompanyName.textContent = `Signed: ${formatDate(inv.date)}`;
      DOM.prevSigContainer.style.display = 'flex';
    } else {
      DOM.prevSigContainer.style.display = 'none';
    }
  } else {
    DOM.prevPaymentBlock.style.display = 'none';
  }
  
  // Footer, terms & thanks
  DOM.prevTerms.innerHTML = (sett.defaultTerms || '1. Payment is due within standard terms.').replace(/\n/g, '<br>');
  
  const thanksSubtitle = document.getElementById('prev-thanks-subtitle');
  if (thanksSubtitle) {
    thanksSubtitle.textContent = sett.companyName ? `We appreciate your trust in ${sett.companyName}.` : 'We appreciate your trust.';
  }
  
  const emailStr = sett.companyEmail ? `contact ${sett.companyEmail}` : '';
  const phoneStr = sett.companyPhone ? ` or call ${sett.companyPhone}` : '';
  const contactStr = emailStr || phoneStr ? `For queries, ${emailStr}${phoneStr}. ` : '';
  const invStr = inv.invoiceNumber ? `Please reference invoice #${inv.invoiceNumber} in all communications.` : '';
  DOM.prevThanksText.textContent = `This is a computer-generated invoice. ${contactStr}${invStr}`;
  
  // Calculations Preview
  DOM.prevSubtotal.textContent = `${sym}${formatNumber(inv.subtotal)}`;
  
  // Taxable Amount (Subtotal - Discount)
  togglePreviewRow(DOM.prevTaxableRow, DOM.prevTaxableVal, inv.discountTotal > 0 ? inv.taxableAmount : 0, sym);
  
  // Render grouped CGST / SGST split for GST tax type
  DOM.prevTaxesTbody.innerHTML = '';
  if (inv.taxTotal > 0) {
    const taxGroups = {};
    inv.items.forEach(item => {
      if (item.taxApplicable && item.taxPercent > 0) {
        const key = `${item.taxType}_${item.taxPercent}`;
        if (!taxGroups[key]) {
          taxGroups[key] = {
            type: item.taxType,
            percent: item.taxPercent,
            amount: 0
          };
        }
        
        const qty = parseFloat(item.qty) || 0;
        const price = parseFloat(item.price) || 0;
        const baseVal = qty * price;
        let discount = 0;
        if (item.discountApplicable) {
          const dVal = parseFloat(item.discountValue) || 0;
          discount = item.discountType === 'percent' ? baseVal * (dVal / 100) : dVal;
          discount = Math.min(discount, baseVal);
        }
        const taxableVal = baseVal - discount;
        const tax = taxableVal * (item.taxPercent / 100);
        taxGroups[key].amount += tax;
      }
    });
    
    Object.values(taxGroups).forEach(group => {
      if (group.type === 'GST') {
        const halfPercent = group.percent / 2;
        const halfAmount = group.amount / 2;
        
        const trCGST = document.createElement('tr');
        trCGST.innerHTML = `<td>CGST (${halfPercent}%)</td><td class="text-right">${sym}${formatNumber(halfAmount)}</td>`;
        DOM.prevTaxesTbody.appendChild(trCGST);
        
        const trSGST = document.createElement('tr');
        trSGST.innerHTML = `<td>SGST (${halfPercent}%)</td><td class="text-right">${sym}${formatNumber(halfAmount)}</td>`;
        DOM.prevTaxesTbody.appendChild(trSGST);
      } else {
        const trTax = document.createElement('tr');
        trTax.innerHTML = `<td>${group.type} (${group.percent}%)</td><td class="text-right">${sym}${formatNumber(group.amount)}</td>`;
        DOM.prevTaxesTbody.appendChild(trTax);
      }
    });
  }
  
  // Conditionally hide zero values to keep layout premium
  togglePreviewRow(DOM.prevShippingRow, DOM.prevShippingVal, inv.shipping, sym);
  togglePreviewRow(DOM.prevPackagingRow, DOM.prevPackagingVal, inv.packaging, sym);
  togglePreviewRow(DOM.prevAdjustmentRow, DOM.prevAdjustmentVal, inv.adjustment, sym);
  togglePreviewRow(DOM.prevDiscountSummaryRow, DOM.prevDiscountVal, inv.discountTotal, sym, true); // true for minus representation
  togglePreviewRow(DOM.prevRoundRow, DOM.prevRoundVal, inv.roundOff, sym);
  
  DOM.prevGrandTotal.textContent = `${sym}${formatNumber(inv.grandTotal)}`;
  
  // Convert grand total to words
  if (inv.grandTotal > 0) {
    DOM.prevWordsText.textContent = numberToWords(inv.grandTotal, inv.currency);
    DOM.prevWordsContainer.style.display = 'block';
  } else {
    DOM.prevWordsContainer.style.display = 'none';
  }
}

function togglePreviewRow(rowEl, valEl, val, symbol, isMinus = false) {
  const numVal = parseFloat(val) || 0;
  if (numVal !== 0) {
    const prefix = isMinus ? '(-) ' : '';
    valEl.textContent = `${prefix}${symbol}${formatNumber(Math.abs(numVal))}`;
    rowEl.style.display = 'table-row';
  } else {
    rowEl.style.display = 'none';
  }
}

// --- RENDER EDITOR ITEMS TABLE ---
function renderEditorItemsTable() {
  DOM.editorItemsBody.innerHTML = '';
  const inv = state.currentInvoice;
  const sym = CURRENCY_SYMBOLS[inv.currency] || '₹';
  
  if (inv.items.length === 0) {
    DOM.editorItemsBody.innerHTML = `
      <tr>
        <td colspan="5" class="editor-table-empty">
          Click "Add Item" to add products or services to this invoice.
        </td>
      </tr>
    `;
    return;
  }
  
  inv.items.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong style="display:block; color:var(--text-primary);">${escapeHtml(item.name)}</strong>
        <span style="font-size:11px; color:var(--text-muted);">${item.taxApplicable ? `${item.taxType} (${item.taxPercent}%)` : 'No Tax'}</span>
      </td>
      <td style="text-align: center;">
        <div class="editor-item-actions" style="justify-content: center;">
          <button class="qty-btn btn-minus" data-index="${index}">-</button>
          <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.qty}</span>
          <button class="qty-btn btn-plus" data-index="${index}">+</button>
        </div>
      </td>
      <td style="text-align: right;">${sym} ${formatNumber(item.price)}</td>
      <td style="text-align: right; font-weight:600;">${sym} ${formatNumber(item.total)}</td>
      <td style="text-align: right;">
        <button class="btn-icon-delete btn-delete-item" data-index="${index}" title="Remove Item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </td>
    `;
    DOM.editorItemsBody.appendChild(tr);
  });
  
  // Attach fast-event actions to list buttons
  DOM.editorItemsBody.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      if (inv.items[idx].qty > 1) {
        inv.items[idx].qty--;
        calculateInvoice();
      }
    });
  });
  
  DOM.editorItemsBody.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      inv.items[idx].qty++;
      calculateInvoice();
    });
  });
  
  DOM.editorItemsBody.querySelectorAll('.btn-delete-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      inv.items.splice(idx, 1);
      calculateInvoice();
    });
  });
}

// --- RESET & AUTO-GENERATE NUMBER ---
function resetInvoiceForm() {
  state.editingInvoiceId = null;
  DOM.invoiceWorkspaceTitle.textContent = 'Create Invoice';
  DOM.btnNewInvoice.style.display = 'none';
  
  // Auto-increment Invoice number
  const nextNum = state.invoicesHistory.length + 1;
  const year = new Date().getFullYear();
  const padNum = String(nextNum).padStart(4, '0');
  
  state.currentInvoice = {
    partyName: '',
    partyPhone: '',
    partyEmail: '',
    partyAddressLine1: '',
    partyAddressLine2: '',
    partyCity: '',
    partyDistrict: '',
    partyPincode: '',
    partyCountry: '',
    partyCountryCode: '',
    partyTaxId: '',
    items: [],
    invoiceNumber: `INV-${year}-${padNum}`,
    date: '',
    dueDate: '',
    currency: 'INR',
    paymentTerms: 'Due on receipt',
    status: 'Pending',
    shipping: 0,
    packaging: 0,
    adjustment: 0,
    roundOffActive: true
  };
  
  // Sync to form inputs
  DOM.partyName.value = '';
  DOM.partyPhone.value = '';
  DOM.partyEmail.value = '';
  DOM.partyAddressSearch.value = '';
  DOM.partyAddressLine1.value = '';
  DOM.partyAddressLine2.value = '';
  DOM.partyCity.value = '';
  DOM.partyDistrict.value = '';
  DOM.partyPincode.value = '';
  DOM.partyCountry.value = '';
  DOM.partyTaxId.value = '';
  DOM.invoiceNumber.value = state.currentInvoice.invoiceNumber;
  DOM.currencySelect.value = 'INR';
  DOM.paymentTerms.value = 'Due on receipt';
  DOM.invoiceStatus.value = 'Pending';
  
  DOM.chargeShipping.value = 0;
  DOM.chargePackaging.value = 0;
  DOM.chargeAdjustment.value = 0;
  DOM.chargeRoundoff.checked = true;
  
  initInvoiceDates();
  calculateInvoice();
}

// Load an existing invoice from history for viewing/re-editing
function loadInvoiceToEditor(inv) {
  state.editingInvoiceId = inv.id;
  DOM.invoiceWorkspaceTitle.textContent = `Invoice ${inv.invoiceNumber}`;
  DOM.btnNewInvoice.style.display = 'inline-flex';
  
  state.currentInvoice = JSON.parse(JSON.stringify(inv)); // deep copy
  
  // Sync fields
  DOM.partyName.value = inv.partyName || '';
  DOM.partyPhone.value = inv.partyPhone || '';
  DOM.partyEmail.value = inv.partyEmail || '';
  DOM.partyAddressSearch.value = '';
  DOM.partyAddressLine1.value = inv.partyAddressLine1 || '';
  DOM.partyAddressLine2.value = inv.partyAddressLine2 || '';
  DOM.partyCity.value = inv.partyCity || '';
  DOM.partyDistrict.value = inv.partyDistrict || '';
  DOM.partyPincode.value = inv.partyPincode || '';
  DOM.partyCountry.value = inv.partyCountry || '';
  DOM.partyTaxId.value = inv.partyTaxId || '';
  DOM.invoiceNumber.value = inv.invoiceNumber || '';
  DOM.invoiceDate.value = inv.date || '';
  DOM.invoiceDueDate.value = inv.dueDate || '';
  DOM.currencySelect.value = inv.currency || 'INR';
  DOM.paymentTerms.value = inv.paymentTerms || 'Due on receipt';
  DOM.invoiceStatus.value = inv.status || 'Pending';
  
  DOM.chargeShipping.value = inv.shipping || 0;
  DOM.chargePackaging.value = inv.packaging || 0;
  DOM.chargeAdjustment.value = inv.adjustment || 0;
  DOM.chargeRoundoff.checked = inv.roundOffActive !== false;
  
  // Switch sub view to creator if currently in history
  if (state.historyActive) {
    toggleHistoryWorkspace();
  }
  
  calculateInvoice();
}

// --- EVENT LISTENERS SETUP ---
function setupEventListeners() {
  // Theme Toggle
  DOM.themeToggle.addEventListener('change', toggleTheme);
  
  // Sidebar navigation switching
  DOM.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetView = e.currentTarget.getAttribute('data-target');
      switchView(targetView);
      
      DOM.navItems.forEach(nav => nav.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
  
  // Toggle Creator vs History list
  DOM.btnToggleHistory.addEventListener('click', toggleHistoryWorkspace);
  DOM.btnNewInvoice.addEventListener('click', resetInvoiceForm);
  
  // Step 1 input sync
  const step1Inputs = [
    DOM.partyName, DOM.partyPhone, DOM.partyEmail,
    DOM.partyAddressLine1, DOM.partyAddressLine2,
    DOM.partyCity, DOM.partyDistrict, DOM.partyPincode,
    DOM.partyCountry, DOM.partyTaxId
  ];
  step1Inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const fieldId = e.target.id;
      // map element id to state field
      const fieldMap = {
        'party-name': 'partyName',
        'party-phone': 'partyPhone',
        'party-email': 'partyEmail',
        'party-address-line1': 'partyAddressLine1',
        'party-address-line2': 'partyAddressLine2',
        'party-city': 'partyCity',
        'party-district': 'partyDistrict',
        'party-pincode': 'partyPincode',
        'party-country': 'partyCountry',
        'party-tax-id': 'partyTaxId'
      };
      const stateField = fieldMap[fieldId];
      if (stateField) {
        state.currentInvoice[stateField] = e.target.value;
        calculateInvoice();
      }
    });
  });
  
  // Autocomplete registry search
  DOM.partyName.addEventListener('input', handlePartyAutocomplete);
  
  // Autocomplete address searches
  DOM.partyAddressSearch.addEventListener('input', debounce((e) => {
    handleAddressAutocomplete(e.target.value, DOM.partyAddressAutocomplete, (parsed) => {
      DOM.partyAddressLine1.value = parsed.line1;
      DOM.partyAddressLine2.value = parsed.line2;
      DOM.partyCity.value = parsed.city;
      DOM.partyDistrict.value = parsed.district;
      DOM.partyPincode.value = parsed.pincode;
      DOM.partyCountry.value = parsed.country;
      
      state.currentInvoice.partyAddressLine1 = parsed.line1;
      state.currentInvoice.partyAddressLine2 = parsed.line2;
      state.currentInvoice.partyCity = parsed.city;
      state.currentInvoice.partyDistrict = parsed.district;
      state.currentInvoice.partyPincode = parsed.pincode;
      state.currentInvoice.partyCountry = parsed.country;
      state.currentInvoice.partyCountryCode = parsed.countryCode;
      
      calculateInvoice();
    });
  }, 400));

  DOM.settAddressSearch.addEventListener('input', debounce((e) => {
    handleAddressAutocomplete(e.target.value, DOM.settAddressAutocomplete, (parsed) => {
      DOM.settAddressLine1.value = parsed.line1;
      DOM.settAddressLine2.value = parsed.line2;
      DOM.settCity.value = parsed.city;
      DOM.settDistrict.value = parsed.district;
      DOM.settPincode.value = parsed.pincode;
      DOM.settCountry.value = parsed.country;
      
      if (!state.settings) state.settings = {};
      state.settings.companyAddressLine1 = parsed.line1;
      state.settings.companyAddressLine2 = parsed.line2;
      state.settings.companyCity = parsed.city;
      state.settings.companyDistrict = parsed.district;
      state.settings.companyPincode = parsed.pincode;
      state.settings.companyCountry = parsed.country;
      state.settings.companyCountryCode = parsed.countryCode;
    });
  }, 400));

  DOM.wizAddressSearch.addEventListener('input', debounce((e) => {
    handleAddressAutocomplete(e.target.value, DOM.wizAddressAutocomplete, (parsed) => {
      DOM.wizAddressLine1.value = parsed.line1;
      DOM.wizAddressLine2.value = parsed.line2;
      DOM.wizCity.value = parsed.city;
      DOM.wizDistrict.value = parsed.district;
      DOM.wizPincode.value = parsed.pincode;
      DOM.wizCountry.value = parsed.country;
      
      tempWizardUploads.countryCode = parsed.countryCode;
    });
  }, 400));

  document.addEventListener('click', (e) => {
    if (!DOM.partyName.contains(e.target) && !DOM.partyAutocomplete.contains(e.target)) {
      DOM.partyAutocomplete.style.display = 'none';
    }
    if (!DOM.partyAddressSearch.contains(e.target) && !DOM.partyAddressAutocomplete.contains(e.target)) {
      DOM.partyAddressAutocomplete.style.display = 'none';
    }
    if (!DOM.settAddressSearch.contains(e.target) && !DOM.settAddressAutocomplete.contains(e.target)) {
      DOM.settAddressAutocomplete.style.display = 'none';
    }
    if (!DOM.wizAddressSearch.contains(e.target) && !DOM.wizAddressAutocomplete.contains(e.target)) {
      DOM.wizAddressAutocomplete.style.display = 'none';
    }
  });
  
  // Step 3 input sync
  DOM.invoiceNumber.addEventListener('input', (e) => {
    state.currentInvoice.invoiceNumber = e.target.value;
    calculateInvoice();
  });
  DOM.invoiceDate.addEventListener('input', (e) => {
    state.currentInvoice.date = e.target.value;
    calculateInvoice();
  });
  DOM.invoiceDueDate.addEventListener('input', (e) => {
    state.currentInvoice.dueDate = e.target.value;
    calculateInvoice();
  });
  DOM.currencySelect.addEventListener('change', (e) => {
    state.currentInvoice.currency = e.target.value;
    calculateInvoice();
  });
  DOM.paymentTerms.addEventListener('change', (e) => {
    state.currentInvoice.paymentTerms = e.target.value;
    calculateInvoice();
  });
  DOM.invoiceStatus.addEventListener('change', (e) => {
    state.currentInvoice.status = e.target.value;
    calculateInvoice();
  });
  
  // UPI Enable Toggle binds
  DOM.settUpiEnable.addEventListener('change', (e) => {
    DOM.settUpiContainer.style.display = e.target.checked ? 'grid' : 'none';
    if (!e.target.checked) {
      DOM.settQrEnable.checked = false;
      DOM.settQrUploadContainer.style.display = 'none';
    }
  });
  DOM.settQrEnable.addEventListener('change', (e) => {
    DOM.settQrUploadContainer.style.display = e.target.checked ? 'block' : 'none';
  });
  DOM.wizUpiEnable.addEventListener('change', (e) => {
    DOM.wizUpiContainer.style.display = e.target.checked ? 'grid' : 'none';
    if (!e.target.checked) {
      DOM.wizQrEnable.checked = false;
      DOM.wizQrUploadContainer.style.display = 'none';
    }
  });
  DOM.wizQrEnable.addEventListener('change', (e) => {
    DOM.wizQrUploadContainer.style.display = e.target.checked ? 'block' : 'none';
  });
  
  // Drawer Toggles
  DOM.btnOpenAddItem.addEventListener('click', openAddItemDrawer);
  DOM.btnCloseDrawer.addEventListener('click', closeAddItemDrawer);
  DOM.drawerBackdrop.addEventListener('click', closeAddItemDrawer);
  
  DOM.itemTaxApplicable.addEventListener('change', (e) => {
    DOM.taxFieldsContainer.style.display = e.target.checked ? 'grid' : 'none';
  });
  DOM.itemDiscountApplicable.addEventListener('change', (e) => {
    DOM.discountFieldsContainer.style.display = e.target.checked ? 'grid' : 'none';
  });
  
  DOM.btnDrawerAdd.addEventListener('click', handleAddItemSubmit);
  
  // Modal Toggles
  DOM.btnOpenCharges.addEventListener('click', openChargesModal);
  DOM.btnCloseModal.addEventListener('click', closeChargesModal);
  DOM.modalBackdrop.addEventListener('click', (e) => {
    if (e.target === DOM.modalBackdrop) closeChargesModal();
  });
  DOM.btnSaveCharges.addEventListener('click', handleSaveChargesSubmit);
  
  // Generate & Print Invoice
  DOM.btnGenerateInvoice.addEventListener('click', handleGenerateInvoice);
  
  // Settings Tab File uploads
  DOM.settLogoInput.addEventListener('change', (e) => handleImageUpload(e, 'logo', 'sett'));
  DOM.settSigInput.addEventListener('change', (e) => handleImageUpload(e, 'signature', 'sett'));
  DOM.settQrInput.addEventListener('change', (e) => handleImageUpload(e, 'qr', 'sett'));
  
  DOM.btnRemoveLogo.addEventListener('click', () => removeUploadedImage('logo', 'sett'));
  DOM.btnRemoveSig.addEventListener('click', () => removeUploadedImage('signature', 'sett'));
  DOM.btnRemoveQr.addEventListener('click', () => removeUploadedImage('qr', 'sett'));
  
  DOM.btnSaveSettings.addEventListener('click', saveSettingsFromForm);
  
  // Setup Wizard Image upload binds
  DOM.wizLogoInput.addEventListener('change', (e) => handleImageUpload(e, 'logo', 'wiz'));
  DOM.wizSigInput.addEventListener('change', (e) => handleImageUpload(e, 'signature', 'wiz'));
  DOM.wizQrInput.addEventListener('change', (e) => handleImageUpload(e, 'qr', 'wiz'));
  DOM.btnSaveWizard.addEventListener('click', handleSaveWizardSubmit);
  
  // Parties List Views
  DOM.btnAddParty.addEventListener('click', handleAddPartyPrompt);
  DOM.searchParties.addEventListener('input', renderPartiesRegistry);
  DOM.searchInvoices.addEventListener('input', renderInvoiceHistory);
}

// --- NAVIGATION ACTIONS ---
function switchView(viewId) {
  state.activeView = viewId;
  DOM.sections.forEach(section => {
    section.classList.remove('active');
    if (section.id === viewId) {
      section.classList.add('active');
    }
  });
  
  // Trigger secondary renders if entering tabs
  if (viewId === 'parties-view') {
    renderPartiesRegistry();
  } else if (viewId === 'invoices-view' && state.historyActive) {
    renderInvoiceHistory();
  } else if (viewId === 'settings-view') {
    populateSettingsForm();
  }
}

function toggleHistoryWorkspace() {
  state.historyActive = !state.historyActive;
  
  if (state.historyActive) {
    DOM.invoiceCreationWorkspace.style.display = 'none';
    DOM.invoiceHistoryWorkspace.style.display = 'flex';
    DOM.btnToggleHistory.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      Create Invoice
    `;
    renderInvoiceHistory();
  } else {
    DOM.invoiceCreationWorkspace.style.display = 'flex';
    DOM.invoiceHistoryWorkspace.style.display = 'none';
    DOM.btnToggleHistory.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Invoice History
    `;
  }
}

// --- DRAWER ACTIONS ---
function openAddItemDrawer() {
  DOM.drawerBackdrop.style.display = 'block';
  setTimeout(() => {
    DOM.drawerBackdrop.classList.add('active');
    DOM.addItemDrawer.classList.add('active');
  }, 10);
  
  // Clear drawer fields
  DOM.itemName.value = '';
  DOM.itemDescription.value = '';
  DOM.itemQty.value = 1;
  DOM.itemUnit.value = 'Nos';
  DOM.itemPrice.value = '';
  DOM.itemTaxApplicable.checked = false;
  DOM.taxFieldsContainer.style.display = 'none';
  DOM.itemDiscountApplicable.checked = false;
  DOM.discountFieldsContainer.style.display = 'none';
  DOM.itemName.focus();
}

function closeAddItemDrawer() {
  DOM.drawerBackdrop.classList.remove('active');
  DOM.addItemDrawer.classList.remove('active');
  setTimeout(() => {
    DOM.drawerBackdrop.style.display = 'none';
  }, 300);
}

function handleAddItemSubmit() {
  const name = DOM.itemName.value.trim();
  const description = DOM.itemDescription.value.trim();
  const qty = parseInt(DOM.itemQty.value) || 0;
  const unit = DOM.itemUnit.value.trim() || 'Nos';
  const price = parseFloat(DOM.itemPrice.value) || 0;
  
  if (!name) {
    alert('Please enter a product or service name.');
    DOM.itemName.focus();
    return;
  }
  if (qty <= 0) {
    alert('Quantity must be greater than 0.');
    DOM.itemQty.focus();
    return;
  }
  if (price < 0) {
    alert('Price cannot be negative.');
    DOM.itemPrice.focus();
    return;
  }
  
  const taxApplicable = DOM.itemTaxApplicable.checked;
  const taxType = DOM.itemTaxType.value;
  const taxPercent = parseFloat(DOM.itemTaxPercent.value) || 0;
  
  const discountApplicable = DOM.itemDiscountApplicable.checked;
  const discountType = DOM.itemDiscountType.value;
  const discountValue = parseFloat(DOM.itemDiscountValue.value) || 0;
  
  const newItem = {
    name,
    description,
    qty,
    unit,
    price,
    taxApplicable,
    taxType,
    taxPercent,
    discountApplicable,
    discountType,
    discountValue,
    total: 0 // Will be calculated
  };
  
  state.currentInvoice.items.push(newItem);
  calculateInvoice();
  
  // Check if keep open is toggled
  if (DOM.itemKeepOpen.checked) {
    // Keep open and clear fields for next entry
    DOM.itemName.value = '';
    DOM.itemQty.value = 1;
    DOM.itemPrice.value = '';
    DOM.itemName.focus();
  } else {
    closeAddItemDrawer();
  }
}

// --- MODAL ACTIONS ---
function openChargesModal() {
  const inv = state.currentInvoice;
  
  DOM.chargeShipping.value = inv.shipping || '';
  DOM.chargePackaging.value = inv.packaging || '';
  DOM.chargeAdjustment.value = inv.adjustment || '';
  DOM.chargeRoundoff.checked = inv.roundOffActive !== false;
  
  DOM.modalBackdrop.style.display = 'flex';
  setTimeout(() => {
    DOM.modalBackdrop.classList.add('active');
  }, 10);
}

function closeChargesModal() {
  DOM.modalBackdrop.classList.remove('active');
  setTimeout(() => {
    DOM.modalBackdrop.style.display = 'none';
  }, 300);
}

function handleSaveChargesSubmit() {
  const inv = state.currentInvoice;
  inv.shipping = parseFloat(DOM.chargeShipping.value) || 0;
  inv.packaging = parseFloat(DOM.chargePackaging.value) || 0;
  inv.adjustment = parseFloat(DOM.chargeAdjustment.value) || 0;
  inv.roundOffActive = DOM.chargeRoundoff.checked;
  
  calculateInvoice();
  closeChargesModal();
}

// --- AUTOCOMPLETE PARTY REGISTRY ---
function handlePartyAutocomplete(e) {
  const query = e.target.value.toLowerCase().trim();
  DOM.partyAutocomplete.innerHTML = '';
  
  if (!query) {
    DOM.partyAutocomplete.style.display = 'none';
    return;
  }
  
  const matches = state.parties.filter(p => p.name.toLowerCase().includes(query));
  
  if (matches.length === 0) {
    DOM.partyAutocomplete.style.display = 'none';
    return;
  }
  
  matches.forEach(party => {
    const div = document.createElement('div');
    div.className = 'autocomplete-item';
    div.textContent = party.name;
    div.addEventListener('click', () => {
      // Autofill step 1 details
      DOM.partyName.value = party.name;
      DOM.partyPhone.value = party.phone || '';
      DOM.partyEmail.value = party.email || '';
      DOM.partyAddressSearch.value = '';
      DOM.partyAddressLine1.value = party.addressLine1 || '';
      DOM.partyAddressLine2.value = party.addressLine2 || '';
      DOM.partyCity.value = party.city || '';
      DOM.partyDistrict.value = party.district || '';
      DOM.partyPincode.value = party.pincode || '';
      DOM.partyCountry.value = party.country || '';
      DOM.partyTaxId.value = party.taxId || '';
      
      // Update state
      const inv = state.currentInvoice;
      inv.partyName = party.name;
      inv.partyPhone = party.phone || '';
      inv.partyEmail = party.email || '';
      inv.partyAddressLine1 = party.addressLine1 || '';
      inv.partyAddressLine2 = party.addressLine2 || '';
      inv.partyCity = party.city || '';
      inv.partyDistrict = party.district || '';
      inv.partyPincode = party.pincode || '';
      inv.partyCountry = party.country || '';
      inv.partyCountryCode = party.countryCode || '';
      inv.partyTaxId = party.taxId || '';
      
      calculateInvoice();
      DOM.partyAutocomplete.style.display = 'none';
    });
    DOM.partyAutocomplete.appendChild(div);
  });
  
  DOM.partyAutocomplete.style.display = 'block';
}

// --- IMAGE FILE READERS ---
function handleImageUpload(e, imageType, prefix) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file (PNG, JPG, SVG, WebP).');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64Str = evt.target.result;
    
    if (prefix === 'wiz') {
      tempWizardUploads[imageType] = base64Str;
      // Show mini preview in wizard
      const container = DOM[`wiz${capitalize(imageType)}Preview`];
      container.querySelector('.upload-preview-img').src = base64Str;
      container.style.display = 'flex';
    } else {
      // Direct state setting for setting tab
      if (!state.settings) state.settings = {};
      state.settings[imageType] = base64Str;
      
      // Update preview and save
      const container = DOM[`sett${capitalize(imageType)}Preview`];
      container.querySelector('.upload-preview-img').src = base64Str;
      container.style.display = 'flex';
      
      saveSettings(state.settings);
      calculateInvoice();
    }
  };
  reader.readAsDataURL(file);
}

function removeUploadedImage(imageType, prefix) {
  if (prefix === 'sett' && state.settings) {
    state.settings[imageType] = '';
    saveSettings(state.settings);
    DOM[`sett${capitalize(imageType)}Preview`].style.display = 'none';
    calculateInvoice();
  }
}

// --- WIZARD SUBMIT ---
function handleSaveWizardSubmit() {
  const name = DOM.wizCompanyName.value.trim();
  if (!name) {
    alert('Company Name is required.');
    DOM.wizCompanyName.focus();
    return;
  }
  
  const newSettings = {
    companyName: name,
    companyTagline: DOM.wizCompanyTagline.value.trim(),
    companyTax: DOM.wizCompanyTax.value.trim(),
    companyCin: DOM.wizCompanyCin.value.trim(),
    companyPhone: DOM.wizCompanyPhone.value.trim(),
    companyEmail: DOM.wizCompanyEmail.value.trim(),
    companyAddressLine1: DOM.wizAddressLine1.value.trim(),
    companyAddressLine2: DOM.wizAddressLine2.value.trim(),
    companyCity: DOM.wizCity.value.trim(),
    companyDistrict: DOM.wizDistrict.value.trim(),
    companyPincode: DOM.wizPincode.value.trim(),
    companyCountry: DOM.wizCountry.value.trim(),
    companyCountryCode: tempWizardUploads.countryCode || '',
    bankName: DOM.wizBankName.value.trim(),
    bankHolder: DOM.wizBankHolder.value.trim(),
    bankAc: DOM.wizBankAc.value.trim(),
    bankIfsc: DOM.wizBankIfsc.value.trim(),
    bankBranch: DOM.wizBankBranch.value.trim(),
    bankType: DOM.wizBankType.value.trim(),
    bankSwift: DOM.wizBankSwift.value.trim(),
    upiEnable: DOM.wizUpiEnable.checked,
    upiId: DOM.wizUpiId.value.trim(),
    qrEnable: DOM.wizQrEnable.checked,
    companySignatoryName: DOM.wizSigName.value.trim(),
    companySignatoryDesignation: DOM.wizSigDesignation.value.trim(),
    logo: tempWizardUploads.logo || '',
    signature: tempWizardUploads.signature || '',
    qr: tempWizardUploads.qr || '',
    defaultTerms: '1. Payment is due within specified credit days.\n2. Please mention the invoice number in your bank transfer.'
  };
  
  state.settings = newSettings;
  saveSettings(newSettings);
  
  DOM.setupWizard.style.display = 'none';
  populateSettingsForm();
  calculateInvoice();
}

// --- SETTINGS SAVE ---
function saveSettings(settingsObj) {
  localStorage.setItem(STATE_KEYS.SETTINGS, JSON.stringify(settingsObj));
}

function saveSettingsFromForm() {
  const name = DOM.settCompanyName.value.trim();
  if (!name) {
    alert('Company Name is required.');
    DOM.settCompanyName.focus();
    return;
  }
  
  const updatedSettings = {
    companyName: name,
    companyTagline: DOM.settCompanyTagline.value.trim(),
    companyTax: DOM.settCompanyTax.value.trim(),
    companyCin: DOM.settCompanyCin.value.trim(),
    companyPhone: DOM.settCompanyPhone.value.trim(),
    companyEmail: DOM.settCompanyEmail.value.trim(),
    companyAddressLine1: DOM.settAddressLine1.value.trim(),
    companyAddressLine2: DOM.settAddressLine2.value.trim(),
    companyCity: DOM.settCity.value.trim(),
    companyDistrict: DOM.settDistrict.value.trim(),
    companyPincode: DOM.settPincode.value.trim(),
    companyCountry: DOM.settCountry.value.trim(),
    companyCountryCode: state.settings ? (state.settings.companyCountryCode || '') : '',
    bankName: DOM.settBankName.value.trim(),
    bankHolder: DOM.settBankHolder.value.trim(),
    bankAc: DOM.settBankAc.value.trim(),
    bankIfsc: DOM.settBankIfsc.value.trim(),
    bankBranch: DOM.settBankBranch.value.trim(),
    bankType: DOM.settBankType.value.trim(),
    bankSwift: DOM.settBankSwift.value.trim(),
    upiEnable: DOM.settUpiEnable.checked,
    upiId: DOM.settUpiId.value.trim(),
    qrEnable: DOM.settQrEnable.checked,
    defaultTerms: DOM.settDefaultTerms.value.trim(),
    companySignatoryName: DOM.settSigName.value.trim(),
    companySignatoryDesignation: DOM.settSigDesignation.value.trim(),
    // Preserve existing uploads if not replaced
    logo: state.settings ? state.settings.logo : '',
    signature: state.settings ? state.settings.signature : '',
    qr: state.settings ? state.settings.qr : ''
  };
  
  state.settings = updatedSettings;
  saveSettings(updatedSettings);
  
  alert('Settings saved successfully!');
  calculateInvoice();
}

// --- GENERATE / PRINT INVOICE ---
function handleGenerateInvoice() {
  const inv = state.currentInvoice;
  
  if (!inv.partyName.trim()) {
    alert('Step 1 Required: Please enter a Party / Customer Name.');
    DOM.partyName.focus();
    return;
  }
  
  if (inv.items.length === 0) {
    alert('Step 2 Required: Please add at least one item to the invoice.');
    DOM.btnOpenAddItem.focus();
    return;
  }
  
  // Check if this is a new invoice or updating an existing one
  if (state.editingInvoiceId) {
    const idx = state.invoicesHistory.findIndex(i => i.id === state.editingInvoiceId);
    if (idx !== -1) {
      state.invoicesHistory[idx] = JSON.parse(JSON.stringify(inv));
    }
  } else {
    // Generate new unique ID
    inv.id = 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    state.invoicesHistory.push(JSON.parse(JSON.stringify(inv)));
  }
  
  // Save invoice to database history
  localStorage.setItem(STATE_KEYS.INVOICES, JSON.stringify(state.invoicesHistory));
  
  // Proactively save party to Parties Registry if it's a new name
  const partyExists = state.parties.some(p => p.name.toLowerCase() === inv.partyName.toLowerCase());
  if (!partyExists) {
    const newParty = {
      id: 'party_' + Date.now(),
      name: inv.partyName.trim(),
      phone: inv.partyPhone.trim(),
      email: inv.partyEmail.trim(),
      addressLine1: inv.partyAddressLine1 ? inv.partyAddressLine1.trim() : '',
      addressLine2: inv.partyAddressLine2 ? inv.partyAddressLine2.trim() : '',
      city: inv.partyCity ? inv.partyCity.trim() : '',
      district: inv.partyDistrict ? inv.partyDistrict.trim() : '',
      pincode: inv.partyPincode ? inv.partyPincode.trim() : '',
      country: inv.partyCountry ? inv.partyCountry.trim() : '',
      countryCode: inv.partyCountryCode ? inv.partyCountryCode.trim() : '',
      taxId: inv.partyTaxId.trim()
    };
    state.parties.push(newParty);
    localStorage.setItem(STATE_KEYS.PARTIES, JSON.stringify(state.parties));
  }
  
  // Trigger system Print dialog (styled perfectly via CSS media print)
  window.print();
  
  // Prompt user to clear for next invoice if it was a new creation
  if (!state.editingInvoiceId) {
    setTimeout(() => {
      if (confirm('Invoice printed successfully. Start a new clean invoice?')) {
        resetInvoiceForm();
      }
    }, 500);
  }
}

// --- PARTIES REGISTRY LIST MANAGEMENT ---
function renderPartiesRegistry() {
  DOM.partiesTableBody.innerHTML = '';
  const searchVal = DOM.searchParties.value.toLowerCase().trim();
  
  // Filter parties list
  const filtered = state.parties.filter(p => {
    const addrStr = `${p.addressLine1 || ''} ${p.addressLine2 || ''} ${p.city || ''} ${p.district || ''} ${p.pincode || ''} ${p.country || ''}`.toLowerCase();
    return p.name.toLowerCase().includes(searchVal) ||
      (p.phone && p.phone.includes(searchVal)) ||
      addrStr.includes(searchVal);
  });
  
  if (filtered.length === 0) {
    DOM.partiesTableBody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <h3>No parties found</h3>
            <p>Add customers here to save their billing details for fast access during invoice creation.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  filtered.forEach(p => {
    const tr = document.createElement('tr');
    const fullAddr = [
      p.addressLine1,
      p.addressLine2,
      p.city,
      p.district ? `${p.district}${p.pincode ? ' - ' + p.pincode : ''}` : p.pincode,
      p.country
    ].filter(Boolean).join(', ');
    
    tr.innerHTML = `
      <td><strong>${escapeHtml(p.name)}</strong></td>
      <td>
        ${p.phone ? `<div>Phone: ${escapeHtml(p.phone)}</div>` : ''}
        ${p.email ? `<div>Email: ${escapeHtml(p.email)}</div>` : ''}
        ${!p.phone && !p.email ? '<span style="color:var(--text-muted)">-</span>' : ''}
      </td>
      <td><span style="font-size:12px; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(fullAddr || '-')}</span></td>
      <td>${p.taxId ? `<code style="background:var(--bg-input);padding:2px 6px;border-radius:4px;">${escapeHtml(p.taxId)}</code>` : '<span style="color:var(--text-muted)">-</span>'}</td>
      <td style="text-align: right;">
        <div class="table-row-actions">
          <button class="btn btn-secondary btn-sm btn-party-select" data-id="${p.id}" title="Select for New Invoice">Use</button>
          <button class="btn btn-secondary btn-sm btn-party-delete" data-id="${p.id}" style="color:var(--danger)" title="Remove Party">Delete</button>
        </div>
      </td>
    `;
    DOM.partiesTableBody.appendChild(tr);
  });
  
  // Select button action
  DOM.partiesTableBody.querySelectorAll('.btn-party-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pId = e.currentTarget.getAttribute('data-id');
      const party = state.parties.find(p => p.id === pId);
      if (party) {
        resetInvoiceForm();
        
        DOM.partyName.value = party.name;
        DOM.partyPhone.value = party.phone || '';
        DOM.partyEmail.value = party.email || '';
        DOM.partyAddressSearch.value = '';
        DOM.partyAddressLine1.value = party.addressLine1 || '';
        DOM.partyAddressLine2.value = party.addressLine2 || '';
        DOM.partyCity.value = party.city || '';
        DOM.partyDistrict.value = party.district || '';
        DOM.partyPincode.value = party.pincode || '';
        DOM.partyCountry.value = party.country || '';
        DOM.partyTaxId.value = party.taxId || '';
        
        state.currentInvoice.partyName = party.name;
        state.currentInvoice.partyPhone = party.phone || '';
        state.currentInvoice.partyEmail = party.email || '';
        state.currentInvoice.partyAddressLine1 = party.addressLine1 || '';
        state.currentInvoice.partyAddressLine2 = party.addressLine2 || '';
        state.currentInvoice.partyCity = party.city || '';
        state.currentInvoice.partyDistrict = party.district || '';
        state.currentInvoice.partyPincode = party.pincode || '';
        state.currentInvoice.partyCountry = party.country || '';
        state.currentInvoice.partyCountryCode = party.countryCode || '';
        state.currentInvoice.partyTaxId = party.taxId || '';
        
        calculateInvoice();
        switchView('invoices-view');
        // ensure creation split pane is visible
        if (state.historyActive) {
          toggleHistoryWorkspace();
        }
      }
    });
  });
  
  // Delete action
  DOM.partiesTableBody.querySelectorAll('.btn-party-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pId = e.currentTarget.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this customer registry?')) {
        state.parties = state.parties.filter(p => p.id !== pId);
        localStorage.setItem(STATE_KEYS.PARTIES, JSON.stringify(state.parties));
        renderPartiesRegistry();
      }
    });
  });
}

function handleAddPartyPrompt() {
  const name = prompt('Enter Customer / Party Name*:');
  if (!name || !name.trim()) return;
  
  const phone = prompt('Enter Phone Number (optional):') || '';
  const email = prompt('Enter Email Address (optional):') || '';
  const address = prompt('Enter Billing Address (optional):') || '';
  const taxId = prompt('Enter Tax ID / GSTIN (optional):') || '';
  
  const newParty = {
    id: 'party_' + Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    addressLine1: address.trim(),
    addressLine2: '',
    city: '',
    district: '',
    pincode: '',
    country: '',
    countryCode: '',
    taxId: taxId.trim()
  };
  
  state.parties.push(newParty);
  localStorage.setItem(STATE_KEYS.PARTIES, JSON.stringify(state.parties));
  renderPartiesRegistry();
}

// --- INVOICE HISTORY LIST MANAGEMENT ---
function renderInvoiceHistory() {
  DOM.invoiceHistoryBody.innerHTML = '';
  const searchVal = DOM.searchInvoices.value.toLowerCase().trim();
  
  // Sort by date/id descending (newest first)
  const sortedHistory = [...state.invoicesHistory].reverse();
  
  const filtered = sortedHistory.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchVal) ||
    inv.partyName.toLowerCase().includes(searchVal)
  );
  
  if (filtered.length === 0) {
    DOM.invoiceHistoryBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>No past invoices found</h3>
            <p>Invoices you generate will appear here. You can view, print, edit, or delete them anytime.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  filtered.forEach(inv => {
    const tr = document.createElement('tr');
    const sym = CURRENCY_SYMBOLS[inv.currency] || '₹';
    tr.innerHTML = `
      <td><strong style="color:var(--primary); font-family:var(--font-secondary);">${escapeHtml(inv.invoiceNumber)}</strong></td>
      <td><strong>${escapeHtml(inv.partyName)}</strong></td>
      <td>${formatDate(inv.date)}</td>
      <td>${formatDate(inv.dueDate)}</td>
      <td><strong>${sym} ${formatNumber(inv.grandTotal)}</strong></td>
      <td style="text-align: right;">
        <div class="table-row-actions">
          <button class="btn btn-secondary btn-sm btn-hist-edit" data-id="${inv.id}">Edit</button>
          <button class="btn btn-secondary btn-sm btn-hist-delete" data-id="${inv.id}" style="color:var(--danger)">Delete</button>
        </div>
      </td>
    `;
    DOM.invoiceHistoryBody.appendChild(tr);
  });
  
  // Edit past invoice click
  DOM.invoiceHistoryBody.querySelectorAll('.btn-hist-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const invId = e.currentTarget.getAttribute('data-id');
      const invoice = state.invoicesHistory.find(i => i.id === invId);
      if (invoice) {
        loadInvoiceToEditor(invoice);
      }
    });
  });
  
  // Delete past invoice click
  DOM.invoiceHistoryBody.querySelectorAll('.btn-hist-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const invId = e.currentTarget.getAttribute('data-id');
      if (confirm('Are you sure you want to permanently delete this invoice from history?')) {
        state.invoicesHistory = state.invoicesHistory.filter(i => i.id !== invId);
        localStorage.setItem(STATE_KEYS.INVOICES, JSON.stringify(state.invoicesHistory));
        renderInvoiceHistory();
        
        // If we deleted the invoice we were currently editing, reset form
        if (state.editingInvoiceId === invId) {
          resetInvoiceForm();
        }
      }
    });
  });
}

// --- HELPERS ---
function getTaxLabel(taxVal) {
  if (!taxVal) return 'Tax ID';
  const clean = taxVal.trim().replace(/[^a-zA-Z0-9]/g, '');
  return clean.length === 15 ? 'GSTIN' : 'Tax ID';
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  // returns DD-MM-YYYY format for readable desktop standard
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

function escapeHtml(string) {
  const matchHtmlRegExp = /["'&<>]/;
  const str = '' + string;
  const match = matchHtmlRegExp.exec(str);
  if (!match) return str;
  
  let escape;
  let html = '';
  let index = 0;
  let lastIndex = 0;
  
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }
    
    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escape;
  }
  
  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

// --- Autocomplete Helpers for OSM ---
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function handleAddressAutocomplete(query, dropdownEl, callback) {
  if (!query || query.trim().length < 3) {
    dropdownEl.innerHTML = '';
    dropdownEl.style.display = 'none';
    return;
  }
  
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`, {
    headers: {
      'Accept-Language': 'en'
    }
  })
    .then(res => res.json())
    .then(data => {
      dropdownEl.innerHTML = '';
      if (!data || data.length === 0) {
        dropdownEl.style.display = 'none';
        return;
      }
      
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.textContent = item.display_name;
        div.addEventListener('click', () => {
          const parsed = parseOSMAddress(item);
          callback(parsed);
          dropdownEl.style.display = 'none';
        });
        dropdownEl.appendChild(div);
      });
      dropdownEl.style.display = 'block';
    })
    .catch(err => {
      console.error('Error fetching address autocomplete:', err);
    });
}

function parseOSMAddress(osm) {
  const addr = osm.address || {};
  
  // Build Line 1: house/building number + road/street
  let line1Parts = [];
  const houseNum = addr.house_number || addr.building || addr.amenity || '';
  const road = addr.road || addr.pedestrian || '';
  if (houseNum) line1Parts.push(houseNum);
  if (road) line1Parts.push(road);
  const line1 = line1Parts.join(', ') || osm.display_name.split(',')[0] || '';
  
  // Build Line 2: neighbourhood, suburb, city_district
  let line2Parts = [];
  const neighbourhood = addr.neighbourhood || addr.suburb || '';
  const cityDistrict = addr.city_district || '';
  if (neighbourhood && neighbourhood !== road) line2Parts.push(neighbourhood);
  if (cityDistrict && cityDistrict !== neighbourhood && cityDistrict !== road) line2Parts.push(cityDistrict);
  const line2 = line2Parts.join(', ') || '';
  
  // City
  const city = addr.city || addr.town || addr.village || addr.municipality || '';
  
  // District/State
  const district = addr.state_district || addr.county || addr.state || '';
  
  // Pincode/ZIP
  const pincode = addr.postcode || '';
  
  // Country
  const country = addr.country || '';
  const countryCode = addr.country_code ? addr.country_code.toUpperCase() : '';
  
  return {
    line1,
    line2,
    city,
    district,
    pincode,
    country,
    countryCode
  };
}

function numberToWords(amount, currency = 'INR') {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion'];
  
  function helper(num) {
    if (num === 0) return '';
    else if (num < 20) return units[num] + ' ';
    else if (num < 100) return tens[Math.floor(num / 10)] + ' ' + units[num % 10] + ' ';
    else return units[Math.floor(num / 100)] + ' Hundred ' + helper(num % 100);
  }
  
  function convertIndian(num) {
    if (num === 0) return 'Zero';
    let words = '';
    
    // Crores
    if (Math.floor(num / 10000000) > 0) {
      words += helper(Math.floor(num / 10000000)) + 'Crore ';
      num %= 10000000;
    }
    // Lakhs
    if (Math.floor(num / 100000) > 0) {
      words += helper(Math.floor(num / 100000)) + 'Lakh ';
      num %= 100000;
    }
    // Thousands
    if (Math.floor(num / 1000) > 0) {
      words += helper(Math.floor(num / 1000)) + 'Thousand ';
      num %= 1000;
    }
    // Hundreds & units
    if (num > 0) {
      words += helper(num);
    }
    return words.trim();
  }
  
  function convertWestern(num) {
    if (num === 0) return 'Zero';
    let words = '';
    let scaleIndex = 0;
    
    while (num > 0) {
      if (num % 1000 !== 0) {
        words = helper(num % 1000) + scales[scaleIndex] + ' ' + words;
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }
    return words.trim();
  }
  
  const parts = parseFloat(amount).toFixed(2).split('.');
  const integerPart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);
  
  let majorName = 'Rupees';
  let minorName = 'Paise';
  
  switch (currency) {
    case 'USD':
      majorName = 'Dollars';
      minorName = 'Cents';
      break;
    case 'EUR':
      majorName = 'Euros';
      minorName = 'Cents';
      break;
    case 'GBP':
      majorName = 'Pounds';
      minorName = 'Pence';
      break;
    default:
      majorName = 'Rupees';
      minorName = 'Paise';
      break;
  }
  
  let result = '';
  if (currency === 'INR') {
    result = convertIndian(integerPart);
  } else {
    result = convertWestern(integerPart);
  }
  
  result += ' ' + majorName;
  
  if (decimalPart > 0) {
    let decimalWords = '';
    if (currency === 'INR') {
      decimalWords = convertIndian(decimalPart);
    } else {
      decimalWords = convertWestern(decimalPart);
    }
    result += ' and ' + decimalWords + ' ' + minorName;
  }
  
  return result + ' Only';
}

// Initialize Application on DOM content load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
