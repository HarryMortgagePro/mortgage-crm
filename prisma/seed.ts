import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const client1 = await prisma.client.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '416-555-0101',
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
      tags: 'moving-up',
      referralSource: 'Past Client',
      notes: 'Selling current home to upgrade to larger property.',
    },
  });

  const app1 = await prisma.application.create({
    data: {
      clientId: client1.id,
      applicationType: 'Mortgage',
      purpose: 'Purchase',
      status: 'Submitted',
      propertyAddress: '123 King St W, Unit 1205',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyType: 'Condo',
      purchasePrice: 580000,
      mortgageAmount: 464000,
      downPaymentAmount: 116000,
      interestRate: 5.49,
      rateType: 'Fixed',
      termYears: 5,
      amortizationYears: 25,
      lenderName: 'TD Bank',
      brokerFee: 4640,
      lenderFee: 0,
      applicationDate: new Date('2024-10-15'),
      conditionsDueDate: new Date('2024-11-30'),
      closingDate: new Date('2024-12-15'),
      notes: 'Pre-approval in place. Property inspection scheduled.',
    },
  });

  const app2 = await prisma.application.create({
    data: {
      clientId: client2.id,
      applicationType: 'Mortgage',
      purpose: 'Purchase',
      status: 'Conditional Approval',
      propertyAddress: '456 Queen St E',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyType: 'Multi-unit',
      purchasePrice: 1200000,
      mortgageAmount: 900000,
      downPaymentAmount: 300000,
      interestRate: 5.89,
      rateType: 'Variable',
      termYears: 5,
      amortizationYears: 30,
      lenderName: 'RBC',
      brokerFee: 9000,
      lenderFee: 0,
      applicationDate: new Date('2024-10-20'),
      conditionsDueDate: new Date('2024-11-25'),
      closingDate: new Date('2024-12-20'),
      notes: 'Investment property. Rental income to be verified.',
    },
  });

  const app3 = await prisma.application.create({
    data: {
      clientId: client3.id,
      applicationType: 'Mortgage',
      purpose: 'Refinance',
      status: 'Final Approval',
      propertyAddress: '789 Dundas St W',
      propertyCity: 'Mississauga',
      propertyProvince: 'ON',
      propertyType: 'Detached',
      purchasePrice: null,
      mortgageAmount: 450000,
      downPaymentAmount: null,
      interestRate: 4.99,
      rateType: 'Fixed',
      termYears: 5,
      amortizationYears: 20,
      lenderName: 'Scotia Bank',
      brokerFee: 4500,
      lenderFee: 0,
      applicationDate: new Date('2024-09-01'),
      conditionsDueDate: new Date('2024-10-15'),
      closingDate: new Date('2024-11-18'),
      notes: 'Refinancing to consolidate debt and lower payments.',
    },
  });

  const app4 = await prisma.application.create({
    data: {
      clientId: client4.id,
      applicationType: 'Mortgage',
      purpose: 'Pre-Approval',
      status: 'Lead',
      propertyAddress: null,
      propertyCity: null,
      propertyProvince: null,
      propertyType: null,
      purchasePrice: null,
      mortgageAmount: 400000,
      downPaymentAmount: 100000,
      interestRate: 5.39,
      rateType: 'Fixed',
      termYears: 5,
      amortizationYears: 25,
      lenderName: 'BMO',
      brokerFee: null,
      lenderFee: null,
      applicationDate: new Date('2024-11-10'),
      conditionsDueDate: null,
      closingDate: null,
      notes: 'Pre-approval valid for 120 days.',
    },
  });

  const app5 = await prisma.application.create({
    data: {
      clientId: client5.id,
      applicationType: 'Mortgage',
      purpose: 'Purchase',
      status: 'Docs Pending',
      propertyAddress: '321 Lakeshore Blvd',
      propertyCity: 'Oakville',
      propertyProvince: 'ON',
      propertyType: 'Townhouse',
      purchasePrice: 850000,
      mortgageAmount: 595000,
      downPaymentAmount: 255000,
      interestRate: 5.29,
      rateType: 'Fixed',
      termYears: 5,
      amortizationYears: 25,
      lenderName: 'CIBC',
      brokerFee: 5950,
      lenderFee: 0,
      applicationDate: new Date('2024-10-25'),
      conditionsDueDate: new Date('2024-11-28'),
      closingDate: new Date('2024-12-22'),
      notes: 'Waiting on job letter and recent pay stubs.',
    },
  });

  const app6 = await prisma.application.create({
    data: {
      clientId: client2.id,
      applicationType: 'HELOC',
      purpose: 'Equity Take-Out',
      status: 'Funded',
      propertyAddress: '88 Yonge St',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyType: 'Condo',
      purchasePrice: null,
      mortgageAmount: 150000,
      downPaymentAmount: null,
      interestRate: 6.45,
      rateType: 'Variable',
      termYears: null,
      amortizationYears: null,
      lenderName: 'TD Bank',
      brokerFee: 1500,
      lenderFee: 0,
      applicationDate: new Date('2024-08-15'),
      conditionsDueDate: new Date('2024-09-01'),
      closingDate: new Date('2024-09-20'),
      fundedDate: new Date('2024-09-20'),
      notes: 'HELOC funded for home renovations.',
    },
  });

  const app7 = await prisma.application.create({
    data: {
      clientId: client1.id,
      applicationType: 'Mortgage',
      purpose: 'Renewal',
      status: 'Declined',
      propertyAddress: '555 Bay St',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyType: 'Condo',
      purchasePrice: null,
      mortgageAmount: 300000,
      downPaymentAmount: null,
      interestRate: null,
      rateType: null,
      termYears: 5,
      amortizationYears: null,
      lenderName: 'Alternative Lender',
      brokerFee: null,
      lenderFee: null,
      applicationDate: new Date('2024-09-10'),
      conditionsDueDate: null,
      closingDate: null,
      notes: 'Declined due to credit issues. Exploring other options.',
    },
  });

  const task1 = await prisma.task.create({
    data: {
      title: 'Follow up on property inspection',
      description: 'Call client to confirm inspection results and next steps',
      dueDate: new Date('2024-11-20'),
      status: 'Open',
      priority: 'High',
      category: 'Follow-up',
      clientId: client1.id,
      applicationId: app1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Request rental income verification',
      description: 'Contact client for lease agreements and rent roll',
      dueDate: new Date('2024-11-18'),
      status: 'In Progress',
      priority: 'High',
      category: 'Documents',
      clientId: client2.id,
      applicationId: app2.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Send final approval documents',
      description: 'Email commitment letter and closing instructions',
      dueDate: new Date('2024-11-16'),
      status: 'Done',
      priority: 'Medium',
      category: 'Documents',
      clientId: client3.id,
      applicationId: app3.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Schedule meeting with Emily',
      description: 'Discuss pre-approval and next steps for house hunting',
      dueDate: new Date('2024-11-22'),
      status: 'Open',
      priority: 'Medium',
      category: 'Follow-up',
      clientId: client4.id,
      applicationId: app4.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Collect job letter and pay stubs',
      description: 'Follow up with David for required employment documents',
      dueDate: new Date('2024-11-17'),
      status: 'Open',
      priority: 'High',
      category: 'Documents',
      clientId: client5.id,
      applicationId: app5.id,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: 'Review compliance checklist',
      description: 'Ensure all regulatory requirements are met for submission',
      dueDate: new Date('2024-11-19'),
      status: 'In Progress',
      priority: 'Medium',
      category: 'Compliance',
      clientId: client2.id,
      applicationId: app2.id,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      title: 'Contact lender about conditions',
      description: 'Clarify outstanding conditions from CIBC',
      dueDate: new Date('2024-11-15'),
      status: 'Open',
      priority: 'High',
      category: 'Lender',
      clientId: client5.id,
      applicationId: app5.id,
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app1.id,
      docType: 'T1 General',
      status: 'Received',
      notes: '2023 tax return',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app1.id,
      docType: 'NOA',
      status: 'Received',
      notes: 'Notice of Assessment 2023',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app1.id,
      docType: 'Job Letter',
      status: 'Received',
      notes: 'Employment letter dated Oct 1, 2024',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app1.id,
      docType: 'Bank Statements',
      status: 'Received',
      notes: 'Last 3 months',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app2.id,
      docType: 'T1 General',
      status: 'Received',
      notes: '2023 tax return',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app2.id,
      docType: 'Lease Agreements',
      status: 'Requested',
      notes: 'Need current lease agreements for all units',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app2.id,
      docType: 'Appraisal',
      status: 'Requested',
      notes: 'Appraisal ordered, pending completion',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app3.id,
      docType: 'T1 General',
      status: 'Received',
      notes: '2023 tax return',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app3.id,
      docType: 'Job Letter',
      status: 'Received',
      notes: 'Employment confirmation',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app3.id,
      docType: 'Appraisal',
      status: 'Received',
      notes: 'Property valued at $650,000',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app5.id,
      docType: 'T1 General',
      status: 'Received',
      notes: '2023 tax return',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app5.id,
      docType: 'Job Letter',
      status: 'Requested',
      notes: 'Waiting for employer',
    },
  });

  await prisma.documentRecord.create({
    data: {
      applicationId: app5.id,
      docType: 'Bank Statements',
      status: 'Requested',
      notes: 'Need last 3 months',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
