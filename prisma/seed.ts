import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive mortgage CRM seed...');

  // Clear existing data
  await prisma.commission.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.application.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.product.deleteMany();
  await prisma.lender.deleteMany();
  await prisma.client.deleteMany();

  console.log('Creating Lenders...');
  
  const tdLender = await prisma.lender.create({
    data: {
      name: 'TD Canada Trust',
      contactName: 'Jennifer Wong',
      email: 'jennifer.wong@td.com',
      phone: '416-555-2000',
      portalUrl: 'https://broker.td.com',
      notes: 'Preferred lender for first-time buyers. Fast approval times.',
    },
  });

  const rbcLender = await prisma.lender.create({
    data: {
      name: 'RBC Royal Bank',
      contactName: 'Michael Chen',
      email: 'm.chen@rbc.com',
      phone: '905-555-3000',
      portalUrl: 'https://broker.rbc.com',
      notes: 'Great rates for high-value properties.',
    },
  });

  const scotiaLender = await prisma.lender.create({
    data: {
      name: 'Scotiabank',
      contactName: 'Sarah Johnson',
      email: 'sarah.j@scotiabank.com',
      phone: '647-555-4000',
      portalUrl: 'https://broker.scotiabank.com',
    },
  });

  const bmoLender = await prisma.lender.create({
    data: {
      name: 'BMO Bank of Montreal',
      contactName: 'David Lee',
      email: 'david.lee@bmo.com',
      phone: '416-555-5000',
      portalUrl: 'https://broker.bmo.com',
      notes: 'Excellent for investment properties.',
    },
  });

  const meridianLender = await prisma.lender.create({
    data: {
      name: 'Meridian Credit Union',
      contactName: 'Emily Brown',
      email: 'e.brown@meridiancu.ca',
      phone: '905-555-6000',
    },
  });

  console.log('Creating Products...');

  const tdFixed5 = await prisma.product.create({
    data: {
      lenderId: tdLender.id,
      name: 'TD 5-Year Fixed',
      rateType: 'Fixed',
      termYears: 5,
      interestRate: 5.49,
      minLtv: 5.00,
      maxLtv: 95.00,
      notes: 'Standard residential mortgage product',
    },
  });

  const tdVariable = await prisma.product.create({
    data: {
      lenderId: tdLender.id,
      name: 'TD Variable Rate',
      rateType: 'Variable',
      termYears: 5,
      interestRate: 5.70,
      minLtv: 20.00,
      maxLtv: 80.00,
    },
  });

  const rbcFixed3 = await prisma.product.create({
    data: {
      lenderId: rbcLender.id,
      name: 'RBC 3-Year Fixed Special',
      rateType: 'Fixed',
      termYears: 3,
      interestRate: 5.29,
      minLtv: 5.00,
      maxLtv: 95.00,
      notes: 'Promotional rate for new purchases',
    },
  });

  const rbcFixed5 = await prisma.product.create({
    data: {
      lenderId: rbcLender.id,
      name: 'RBC 5-Year Fixed',
      rateType: 'Fixed',
      termYears: 5,
      interestRate: 5.59,
      minLtv: 5.00,
      maxLtv: 95.00,
    },
  });

  const scotiaVariable = await prisma.product.create({
    data: {
      lenderId: scotiaLender.id,
      name: 'Scotia Total Equity Variable',
      rateType: 'Variable',
      termYears: 5,
      interestRate: 5.95,
      minLtv: 20.00,
      maxLtv: 80.00,
    },
  });

  const bmoInvestor = await prisma.product.create({
    data: {
      lenderId: bmoLender.id,
      name: 'BMO Investor Mortgage',
      rateType: 'Fixed',
      termYears: 5,
      interestRate: 5.79,
      minLtv: 20.00,
      maxLtv: 80.00,
      notes: 'For rental/investment properties',
    },
  });

  console.log('Creating Clients...');

  const client1 = await prisma.client.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '416-555-0101',
      type: 'Individual',
      tags: 'first-time, pre-approved',
      referralSource: 'Google',
      notes: 'Looking for a condo in downtown Toronto. Budget around $600k.',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '905-555-0202',
      type: 'Individual',
      tags: 'investor, repeat-client',
      referralSource: 'Realtor - Jane Doe',
      notes: 'Experienced investor. Owns 3 properties already.',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mchen@email.com',
      phone: '647-555-0303',
      type: 'Individual',
      tags: 'refinance',
      referralSource: 'Friend Referral',
      notes: 'Current rate is 4.5%, looking to refinance to lower rate.',
    },
  });

  const client4 = await prisma.client.create({
    data: {
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.w@email.com',
      phone: '416-555-0404',
      type: 'Individual',
      tags: 'first-time, young-professional',
      referralSource: 'Instagram',
      notes: 'First-time buyer. Works in tech, good income.',
    },
  });

  const client5 = await prisma.client.create({
    data: {
      firstName: 'David',
      lastName: 'Brown',
      email: 'dbrown@email.com',
      phone: '905-555-0505',
      type: 'Individual',
      tags: 'moving-up',
      referralSource: 'Past Client',
      notes: 'Selling current home to upgrade to larger property.',
    },
  });

  const client6 = await prisma.client.create({
    data: {
      firstName: 'Chen',
      lastName: 'Corporation Ltd.',
      email: 'info@chencorp.com',
      phone: '416-555-0606',
      type: 'Corporation',
      primaryContact: 'Robert Chen, CEO',
      tags: 'commercial, investor',
      referralSource: 'Lawyer Referral',
      notes: 'Looking to purchase commercial property for business expansion.',
    },
  });

  console.log('Creating Applications...');

  const app1 = await prisma.application.create({
    data: {
      clientId: client1.id,
      stage: 'Submitted',
      dealType: 'Purchase',
      purpose: 'Owner-occupied',
      
      propertyAddress: '123 King St W, Unit 1205',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostal: 'M5H 1A1',
      propertyType: 'Condo',
      occupancy: 'Owner',
      
      purchasePrice: 580000,
      mortgageAmount: 522000,
      downPayment: 58000,
      amortizationYears: 25,
      termYears: 5,
      rateType: 'Fixed',
      interestRate: 5.49,
      
      lenderId: tdLender.id,
      productId: tdFixed5.id,
      
      applicationDate: new Date('2024-11-01'),
      submissionDate: new Date('2024-11-10'),
      closingDate: new Date('2025-01-15'),
      
      maxQualification: 650000,
      gdsRatio: 28.5,
      tdsRatio: 36.2,
      qualificationSummary: 'Strong income, good credit score (750). Pre-approved.',
      
      notes: 'First-time buyer. Eager to close before Chinese New Year.',
    },
  });

  const app2 = await prisma.application.create({
    data: {
      clientId: client2.id,
      stage: 'Approval',
      dealType: 'Purchase',
      purpose: 'Rental',
      
      propertyAddress: '456 Queen St E',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostal: 'M5A 1T1',
      propertyType: 'Duplex',
      occupancy: 'Rental',
      
      purchasePrice: 950000,
      mortgageAmount: 665000,
      downPayment: 285000,
      amortizationYears: 25,
      termYears: 5,
      rateType: 'Fixed',
      interestRate: 5.79,
      
      lenderId: bmoLender.id,
      productId: bmoInvestor.id,
      
      applicationDate: new Date('2024-10-15'),
      submissionDate: new Date('2024-10-25'),
      approvalDate: new Date('2024-11-05'),
      closingDate: new Date('2024-12-20'),
      
      maxQualification: 1200000,
      gdsRatio: 32.0,
      tdsRatio: 38.5,
      qualificationSummary: 'Experienced investor. Strong rental income from other properties.',
      
      notes: 'Investment property #4. Has approved rental income calculations.',
    },
  });

  const app3 = await prisma.application.create({
    data: {
      clientId: client3.id,
      stage: 'App Taken/Background',
      dealType: 'Refinance',
      purpose: 'Owner-occupied',
      
      propertyAddress: '789 Yonge St',
      propertyCity: 'North York',
      propertyProvince: 'ON',
      propertyPostal: 'M2N 6K1',
      propertyType: 'House',
      occupancy: 'Owner',
      
      purchasePrice: 850000,
      mortgageAmount: 500000,
      downPayment: 0,
      amortizationYears: 22,
      termYears: 5,
      rateType: 'Variable',
      interestRate: 5.70,
      
      lenderId: tdLender.id,
      productId: tdVariable.id,
      
      applicationDate: new Date('2024-11-12'),
      
      maxQualification: 600000,
      gdsRatio: 25.8,
      tdsRatio: 33.1,
      qualificationSummary: 'Refinancing from current 4.5% rate. Looking to access equity.',
      
      notes: 'Current mortgage balance: $480k. Property value: $850k.',
    },
  });

  const app4 = await prisma.application.create({
    data: {
      clientId: client4.id,
      stage: 'Lead',
      dealType: 'Purchase',
      purpose: 'Owner-occupied',
      
      propertyCity: 'Mississauga',
      propertyProvince: 'ON',
      propertyType: 'Condo',
      occupancy: 'Owner',
      
      purchasePrice: 450000,
      mortgageAmount: 405000,
      downPayment: 45000,
      amortizationYears: 30,
      termYears: 5,
      rateType: 'Fixed',
      
      applicationDate: new Date('2024-11-14'),
      
      maxQualification: 500000,
      gdsRatio: 30.0,
      tdsRatio: 35.0,
      qualificationSummary: 'Tech worker. Strong income but limited down payment savings.',
      
      notes: 'Still looking for the right property. Pre-qual done.',
    },
  });

  const app5 = await prisma.application.create({
    data: {
      clientId: client5.id,
      stage: 'Funded',
      dealType: 'Purchase',
      purpose: 'Owner-occupied',
      
      propertyAddress: '321 Main St',
      propertyCity: 'Oakville',
      propertyProvince: 'ON',
      propertyPostal: 'L6H 2R1',
      propertyType: 'House',
      occupancy: 'Owner',
      
      purchasePrice: 1250000,
      mortgageAmount: 750000,
      downPayment: 500000,
      amortizationYears: 25,
      termYears: 3,
      rateType: 'Fixed',
      interestRate: 5.29,
      
      lenderId: rbcLender.id,
      productId: rbcFixed3.id,
      
      applicationDate: new Date('2024-09-01'),
      submissionDate: new Date('2024-09-15'),
      approvalDate: new Date('2024-09-25'),
      closingDate: new Date('2024-10-30'),
      fundedDate: new Date('2024-10-30'),
      renewalDate: new Date('2027-10-30'),
      
      maxQualification: 1500000,
      gdsRatio: 26.0,
      tdsRatio: 31.5,
      qualificationSummary: 'Excellent credit. Large down payment from sale of previous home.',
      
      notes: 'Successfully funded last month. Happy client.',
    },
  });

  const app6 = await prisma.application.create({
    data: {
      clientId: client6.id,
      stage: 'Lead',
      dealType: 'Commercial',
      purpose: 'Business',
      
      propertyAddress: '555 Industrial Rd',
      propertyCity: 'Brampton',
      propertyProvince: 'ON',
      propertyPostal: 'L6T 4X3',
      propertyType: 'Commercial',
      
      purchasePrice: 2500000,
      mortgageAmount: 1750000,
      downPayment: 750000,
      amortizationYears: 20,
      termYears: 5,
      
      applicationDate: new Date('2024-11-15'),
      
      notes: 'Commercial property for manufacturing facility. Still in early discussions.',
    },
  });

  console.log('Creating Bank Accounts...');

  await prisma.bankAccount.create({
    data: {
      clientId: client1.id,
      bankName: 'TD Canada Trust',
      accountNickname: 'Primary Chequing',
      maskedAccountNumber: '****7891',
      accountType: 'Chequing',
      ownerName: 'John Smith',
      mainUser: 'Self',
      usedFor: 'Salary deposits, bill payments, daily expenses',
      openedDate: new Date('2018-03-15'),
      status: 'Active',
      currency: 'CAD',
      notes: 'Main operating account',
    },
  });

  await prisma.bankAccount.create({
    data: {
      clientId: client1.id,
      bankName: 'Scotiabank',
      accountNickname: 'Savings Account',
      maskedAccountNumber: '****4523',
      accountType: 'Savings',
      ownerName: 'John Smith',
      mainUser: 'Self',
      usedFor: 'Emergency fund and down payment savings',
      openedDate: new Date('2019-06-10'),
      status: 'Active',
      currency: 'CAD',
      notes: 'Building down payment funds',
    },
  });

  await prisma.bankAccount.create({
    data: {
      clientId: client2.id,
      bankName: 'RBC Royal Bank',
      accountNickname: 'Business Account',
      maskedAccountNumber: '****9012',
      accountType: 'Business',
      ownerName: 'Sarah Johnson',
      mainUser: 'Self',
      usedFor: 'Rental income deposits, property expenses',
      openedDate: new Date('2017-01-20'),
      status: 'Active',
      currency: 'CAD',
      notes: 'For rental property management',
    },
  });

  await prisma.bankAccount.create({
    data: {
      clientId: client2.id,
      bankName: 'TD Canada Trust',
      accountNickname: 'Investment Account',
      maskedAccountNumber: '****3456',
      accountType: 'Savings',
      ownerName: 'Sarah Johnson',
      mainUser: 'Self',
      usedFor: 'Investment property down payments',
      openedDate: new Date('2019-05-12'),
      status: 'Active',
      currency: 'CAD',
    },
  });

  await prisma.bankAccount.create({
    data: {
      clientId: client3.id,
      bankName: 'CIBC',
      accountNickname: 'Family Joint Account',
      maskedAccountNumber: '****6789',
      accountType: 'Joint',
      ownerName: 'Michael Chen & Spouse',
      mainUser: 'Both',
      usedFor: 'Mortgage payments, household bills, family expenses',
      openedDate: new Date('2015-08-05'),
      status: 'Active',
      currency: 'CAD',
      notes: 'Joint account with spouse',
    },
  });

  console.log('Creating Documents...');

  await prisma.document.create({
    data: {
      applicationId: app1.id,
      type: 'Notice of Assessment',
      required: true,
      received: true,
      receivedDate: new Date('2024-11-05'),
      conditionGroup: 'Income',
      conditionStatus: 'Satisfied',
      notes: '2023 NOA - income verified',
    },
  });

  await prisma.document.create({
    data: {
      applicationId: app1.id,
      type: 'Job Letter',
      required: true,
      received: true,
      receivedDate: new Date('2024-11-03'),
      conditionGroup: 'Income',
      conditionStatus: 'Satisfied',
      notes: 'Employment confirmed with ABC Corp',
    },
  });

  await prisma.document.create({
    data: {
      applicationId: app1.id,
      type: 'Bank Statements',
      required: true,
      received: false,
      conditionGroup: 'Down Payment',
      conditionStatus: 'Pending',
      notes: 'Need last 90 days - requested from client',
    },
  });

  await prisma.document.create({
    data: {
      applicationId: app2.id,
      type: 'Purchase Agreement',
      required: true,
      received: true,
      receivedDate: new Date('2024-10-20'),
      conditionGroup: 'Property',
      conditionStatus: 'Sent to lender',
      notes: 'Firm offer on duplex',
    },
  });

  await prisma.document.create({
    data: {
      applicationId: app2.id,
      type: 'Rental Income Calculation',
      required: true,
      received: true,
      receivedDate: new Date('2024-10-28'),
      conditionGroup: 'Income',
      conditionStatus: 'Satisfied',
      notes: 'Rental income from 3 other properties verified',
    },
  });

  await prisma.document.create({
    data: {
      applicationId: app3.id,
      type: 'Property Appraisal',
      required: true,
      received: false,
      conditionGroup: 'Property',
      conditionStatus: 'Pending',
      notes: 'Appraisal ordered - scheduled for Nov 20',
    },
  });

  console.log('Creating Tasks...');

  await prisma.task.create({
    data: {
      title: 'Follow up on bank statements',
      description: 'Client needs to provide last 90 days of bank statements for down payment verification',
      clientId: client1.id,
      applicationId: app1.id,
      dueDate: new Date('2024-11-18'),
      priority: 'High',
      status: 'Open',
      createdForStage: 'Submitted',
    },
  });

  await prisma.task.create({
    data: {
      title: 'Order appraisal',
      description: 'Contact appraiser to schedule property valuation',
      clientId: client3.id,
      applicationId: app3.id,
      dueDate: new Date('2024-11-17'),
      priority: 'High',
      status: 'In Progress',
      createdForStage: 'App Taken/Background',
    },
  });

  await prisma.task.create({
    data: {
      title: 'Submit final conditions to lender',
      description: 'Upload all outstanding documents to BMO portal',
      clientId: client2.id,
      applicationId: app2.id,
      dueDate: new Date('2024-11-20'),
      priority: 'High',
      status: 'Open',
      createdForStage: 'Approval',
    },
  });

  await prisma.task.create({
    data: {
      title: 'Schedule pre-approval meeting',
      description: 'Meet with Emily to discuss pre-approval and property search',
      clientId: client4.id,
      applicationId: app4.id,
      dueDate: new Date('2024-11-19'),
      priority: 'Medium',
      status: 'Open',
      createdForStage: 'Lead',
    },
  });

  await prisma.task.create({
    data: {
      title: 'Send renewal reminder',
      description: 'David\'s mortgage renews in 3 years - add to renewal tracking',
      clientId: client5.id,
      applicationId: app5.id,
      dueDate: new Date('2024-12-01'),
      priority: 'Low',
      status: 'Open',
      createdForStage: 'Funded',
    },
  });

  await prisma.task.create({
    data: {
      title: 'Call back overdue client',
      description: 'Client from last week - haven\'t heard back',
      dueDate: new Date('2024-11-10'),
      priority: 'Medium',
      status: 'Open',
    },
  });

  console.log('Creating Communications...');

  await prisma.communication.create({
    data: {
      clientId: client1.id,
      applicationId: app1.id,
      date: new Date('2024-11-01'),
      type: 'Call',
      contactName: 'John Smith',
      summary: 'Initial consultation. Discussed condo purchase options and pre-approval process.',
      nextFollowUp: new Date('2024-11-15'),
    },
  });

  await prisma.communication.create({
    data: {
      clientId: client1.id,
      applicationId: app1.id,
      date: new Date('2024-11-10'),
      type: 'Email',
      contactName: 'John Smith',
      summary: 'Sent document checklist. Confirmed submission to TD. Awaiting bank statements.',
      nextFollowUp: new Date('2024-11-18'),
    },
  });

  await prisma.communication.create({
    data: {
      clientId: client2.id,
      applicationId: app2.id,
      date: new Date('2024-11-05'),
      type: 'Meeting',
      contactName: 'Sarah Johnson',
      summary: 'Conditional approval received from BMO. Reviewed outstanding conditions.',
      nextFollowUp: new Date('2024-11-20'),
    },
  });

  await prisma.communication.create({
    data: {
      clientId: client3.id,
      applicationId: app3.id,
      date: new Date('2024-11-12'),
      type: 'Call',
      contactName: 'Michael Chen',
      summary: 'Discussed refinance options. Decided on variable rate to save on penalties.',
    },
  });

  await prisma.communication.create({
    data: {
      clientId: client5.id,
      applicationId: app5.id,
      date: new Date('2024-10-30'),
      type: 'Email',
      contactName: 'David Brown',
      summary: 'Congratulations on funding! Sent final paperwork and renewal date reminder.',
      nextFollowUp: new Date('2027-07-30'),
    },
  });

  console.log('Creating Commissions...');

  await prisma.commission.create({
    data: {
      applicationId: app5.id,
      expectedAmount: 7500,
      actualAmount: 7500,
      brokerSplitPct: 80,
      myShare: 6000,
      referralFee: 0,
      expectedDate: new Date('2024-11-15'),
      receivedDate: new Date('2024-11-12'),
      reconciled: true,
      notes: 'RBC commission received on time. Excellent deal.',
    },
  });

  await prisma.commission.create({
    data: {
      applicationId: app2.id,
      expectedAmount: 6650,
      brokerSplitPct: 80,
      myShare: 5320,
      referralFee: 500,
      expectedDate: new Date('2025-01-05'),
      reconciled: false,
      notes: 'Commission expected 2 weeks after funding. $500 referral to realtor.',
    },
  });

  await prisma.commission.create({
    data: {
      applicationId: app1.id,
      expectedAmount: 5220,
      brokerSplitPct: 80,
      myShare: 4176,
      referralFee: 0,
      expectedDate: new Date('2025-02-01'),
      reconciled: false,
      notes: 'TD commission - expected after funding in January',
    },
  });

  console.log('Seed completed successfully!');
  console.log('');
  console.log('Summary:');
  console.log('- 5 Lenders created');
  console.log('- 6 Products created');
  console.log('- 6 Clients created');
  console.log('- 6 Applications created (across all pipeline stages)');
  console.log('- 5 Bank Accounts created');
  console.log('- 6 Documents created');
  console.log('- 6 Tasks created');
  console.log('- 5 Communications created');
  console.log('- 3 Commissions created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
