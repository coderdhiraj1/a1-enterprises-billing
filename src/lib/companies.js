export const COMPANY_DEFAULTS = {
  a1: {
    id: 'a1',
    name: 'A-1 Enterprises Fabrication Works',
    specialty: 'Fabrication Works Specialist',
    services: 'Gates, Grills, SS Railings, Rolling Shutters, Structural Works',
    phone: '+91-7759971969',
    email: 'enterprises.a1@gmail.com',
    address: 'Shani Mandir Road, Shivar Basti, Marunji, Pune, Maharashtra 411057',
    bankName: 'ICICI BANK',
    accountName: 'Rakesh Sharma',
    accountNumber: '329701501647',
    ifscCode: 'ICICI0003297',
    logo: '/logo.png',
    signoff: 'For A-1 Enterprises'
  },
  shiv_mahima: {
    id: 'shiv_mahima',
    name: 'Shiv Mahima Tensile & Car Parking Sheds',
    specialty: 'Tensile & Car Parking Sheds Specialist',
    services: 'Tensile Structures, Car Parking Sheds, Gazebos, Swimming Pool Sheds',
    phone: '+91-7759971969',
    email: 'enterprises.a1@gmail.com',
    address: 'Shani Mandir Road, Shivar Basti, Marunji, Pune, Maharashtra 411057',
    bankName: 'Central Bank of India',
    accountName: 'Shiv Mahima Tensile and Car Parking Shed',
    accountNumber: '4159152307',
    ifscCode: 'CBIN0283782',
    logo: '/logo-shiv-mahima.png',
    signoff: 'For Shiv Mahima Tensile & Car Parking Sheds',
    warranty: '10 Years Warranty on Tensile Structure & Fabric'
  }
};

export const getDefaultNotes = (companyId, docType, diffDays = 30) => {
  if (companyId === 'shiv_mahima') {
    if (docType === 'bill') {
      return 'Thank you for your business with us!\nWarranty: 10 Years Warranty on Tensile Structure & Fabric.';
    }
    return `Validity: This quotation is valid for ${diffDays} days. Payment terms: 50% advance, balance on delivery.\nWarranty: 10 Years Warranty on Tensile Structure & Fabric.`;
  }
  
  if (docType === 'bill') {
    return 'Thank you for your business with us!';
  }
  return `Validity: This quotation is valid for ${diffDays} days. Payment terms: 50% advance, balance on delivery.`;
};

