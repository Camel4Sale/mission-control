// Mock Data Seed for Elysium Property Dashboard
import { PrismaClient, PropertyType, PropertyStatus, LeaseStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏠 Seeding Elysium Property Database...');

  // Clear existing data
  await prisma.communication.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.valueHistory.deleteMany();
  await prisma.document.deleteMany();
  await prisma.dueDiligence.deleteMany();
  await prisma.financing.deleteMany();
  await prisma.acquisition.deleteMany();
  await prisma.property.deleteMany();

  console.log('✓ Cleared existing data');

  // ============================================
  // PROPERTY 1: Karlsruhe - Mehrfamilienhaus
  // ============================================
  const karlsruheMFH = await prisma.property.create({
    data: {
      name: 'Gartenstadt Residenz',
      address: 'Gartenstraße 45-47',
      city: 'Karlsruhe',
      zipCode: '76135',
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.RENTED,
      size: 680,
      rooms: 24,
      yearBuilt: 1985,
      purchasePrice: 1250000,
      currentValue: 1580000,
      monthlyRent: 8400,
      units: 8,
      description: 'Attraktives Mehrfamilienhaus mit 8 Wohneinheiten in ruhiger Lage. Voll vermietet.',
      images: ['/images/karlsruhe-mfh-1.jpg', '/images/karlsruhe-mfh-2.jpg'],
      valueHistory: {
        create: [
          { date: new Date('2023-01-01'), value: 1450000, source: 'Market Estimate' },
          { date: new Date('2024-01-01'), value: 1520000, source: 'Appraisal' },
          { date: new Date('2025-01-01'), value: 1580000, source: 'Market Estimate' },
        ]
      },
      transactions: {
        create: [
          { type: 'INCOME', category: 'RENT', amount: 8400, date: new Date('2025-02-01'), description: 'Mietzahlung Februar 2025' },
          { type: 'EXPENSE', category: 'MAINTENANCE', amount: 1200, date: new Date('2025-02-05'), description: 'Heizungsreparatur' },
          { type: 'EXPENSE', category: 'INSURANCE', amount: 450, date: new Date('2025-02-01'), description: 'Gebäudeversicherung' },
        ]
      },
      maintenance: {
        create: [
          {
            type: 'MAINTENANCE',
            priority: 'MEDIUM',
            status: 'COMPLETED',
            title: 'Jährliche Heizungsprüfung',
            description: 'Wartung der Zentralheizungsanlage',
            scheduledDate: new Date('2025-02-15'),
            completedDate: new Date('2025-02-15'),
            estimatedCost: 800,
            actualCost: 750,
          }
        ]
      },
    }
  });

  // Tenants for Karlsruhe
  const tenant1 = await prisma.tenant.create({
    data: {
      firstName: 'Michael',
      lastName: 'Weber',
      email: 'm.weber@email.de',
      phone: '+49 721 123456',
      dateOfBirth: new Date('1978-05-12'),
      leases: {
        create: {
          propertyId: karlsruheMFH.id,
          startDate: new Date('2022-03-01'),
          endDate: new Date('2027-02-28'),
          monthlyRent: 1050,
          deposit: 2100,
          status: LeaseStatus.ACTIVE,
          renewalDate: new Date('2027-02-28'),
          noticePeriod: 3,
        }
      }
    }
  });

  await prisma.payment.create({
    data: {
      leaseId: (await prisma.lease.findFirst({ where: { tenantId: tenant1.id } }))!.id,
      amount: 1050,
      dueDate: new Date('2025-03-01'),
      status: PaymentStatus.PENDING,
    }
  });

  console.log('✓ Karlsruhe property created');

  // ============================================
  // PROPERTY 2: Stuttgart - Einfamilienhaus
  // ============================================
  const stuttgartEFH = await prisma.property.create({
    data: {
      name: 'Villa Killesberg',
      address: 'Heilmannstraße 23',
      city: 'Stuttgart',
      zipCode: '70192',
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.RENTED,
      size: 185,
      rooms: 6,
      yearBuilt: 1965,
      purchasePrice: 680000,
      currentValue: 890000,
      monthlyRent: 2400,
      units: 1,
      description: 'Charmantes Einfamilienhaus mit Garten in bevorzugter Wohnlage.',
      images: ['/images/stuttgart-efh-1.jpg'],
      valueHistory: {
        create: [
          { date: new Date('2023-01-01'), value: 820000 },
          { date: new Date('2024-01-01'), value: 860000 },
          { date: new Date('2025-01-01'), value: 890000 },
        ]
      },
    }
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Müller',
      email: 'sarah.mueller@email.de',
      phone: '+49 711 987654',
      leases: {
        create: {
          propertyId: stuttgartEFH.id,
          startDate: new Date('2023-06-01'),
          endDate: new Date('2028-05-31'),
          monthlyRent: 2400,
          deposit: 4800,
          status: LeaseStatus.ACTIVE,
          noticePeriod: 3,
        }
      }
    }
  });

  console.log('✓ Stuttgart property created');

  // ============================================
  // PROPERTY 3: München - Wohnung
  // ============================================
  const muenchenWohnung = await prisma.property.create({
    data: {
      name: 'Schwabing Loft',
      address: 'Leopoldstraße 89/3',
      city: 'München',
      zipCode: '80802',
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.RENTED,
      size: 80,
      rooms: 3,
      yearBuilt: 2015,
      purchasePrice: 520000,
      currentValue: 615000,
      monthlyRent: 1680,
      units: 1,
      description: 'Modernes Loft in bester Schwabinger Lage. Hochwertig ausgestattet.',
      images: ['/images/muenchen-wohnung-1.jpg', '/images/muenchen-wohnung-2.jpg'],
      valueHistory: {
        create: [
          { date: new Date('2023-01-01'), value: 580000 },
          { date: new Date('2024-01-01'), value: 600000 },
          { date: new Date('2025-01-01'), value: 615000 },
        ]
      },
    }
  });

  const tenant3 = await prisma.tenant.create({
    data: {
      firstName: 'Thomas',
      lastName: 'Schmidt',
      email: 't.schmidt@email.de',
      phone: '+49 89 555666',
      leases: {
        create: {
          propertyId: muenchenWohnung.id,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2026-12-31'),
          monthlyRent: 1680,
          deposit: 3360,
          status: LeaseStatus.ACTIVE,
          noticePeriod: 3,
        }
      }
    }
  });

  console.log('✓ München property created');

  // ============================================
  // PROPERTY 4: Heidelberg - Gewerbe (Büro)
  // ============================================
  const heidelbergBuro = await prisma.property.create({
    data: {
      name: 'Neuenheimer Bürocenter',
      address: 'Neuenheimer Landstraße 12',
      city: 'Heidelberg',
      zipCode: '69120',
      propertyType: PropertyType.COMMERCIAL,
      status: PropertyStatus.RENTED,
      size: 320,
      yearBuilt: 2008,
      purchasePrice: 1150000,
      currentValue: 1380000,
      monthlyRent: 4800,
      units: 4,
      description: 'Modernes Bürogebäude mit 4 Einheiten. Ideal für Tech-Startups.',
      images: ['/images/heidelberg-buro-1.jpg'],
      valueHistory: {
        create: [
          { date: new Date('2023-01-01'), value: 1280000 },
          { date: new Date('2024-01-01'), value: 1340000 },
          { date: new Date('2025-01-01'), value: 1380000 },
        ]
      },
    }
  });

  console.log('✓ Heidelberg property created');

  // ============================================
  // PROPERTY 5: Mannheim - Ladenlokal
  // ============================================
  const mannheimLaden = await prisma.property.create({
    data: {
      name: 'Planken Store',
      address: 'Planken 7',
      city: 'Mannheim',
      zipCode: '68161',
      propertyType: PropertyType.COMMERCIAL,
      status: PropertyStatus.RENTED,
      size: 145,
      yearBuilt: 1970,
      purchasePrice: 420000,
      currentValue: 485000,
      monthlyRent: 2200,
      units: 1,
      description: 'Frequenzstarkes Ladenlokal in bester Innenstadtlage.',
      images: ['/images/mannheim-laden-1.jpg'],
      valueHistory: {
        create: [
          { date: new Date('2023-01-01'), value: 460000 },
          { date: new Date('2024-01-01'), value: 475000 },
          { date: new Date('2025-01-01'), value: 485000 },
        ]
      },
    }
  });

  console.log('✓ Mannheim property created');

  // ============================================
  // PROPERTY 6: Freiburg - Wohnung (VACANT)
  // ============================================
  const freiburgWohnung = await prisma.property.create({
    data: {
      name: 'Altstadt Apartment',
      address: 'Salzstraße 14/2',
      city: 'Freiburg',
      zipCode: '79098',
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.VACANT,
      size: 65,
      rooms: 2,
      yearBuilt: 1890,
      purchasePrice: 340000,
      currentValue: 395000,
      monthlyRent: 1100,
      units: 1,
      description: 'Charmante Altbauwohnung in der Freiburger Altstadt. Renovierungsbedürftig.',
      images: ['/images/freiburg-wohnung-1.jpg'],
      maintenance: {
        create: {
          type: 'RENOVATION',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          title: 'Komplettsanierung',
          description: 'Boden, Küche, Bad, Elektrik',
          scheduledDate: new Date('2025-03-01'),
          dueDate: new Date('2025-05-31'),
          estimatedCost: 45000,
        }
      },
    }
  });

  console.log('✓ Freiburg property created');

  // ============================================
  // PROPERTY 7: Karlsruhe - Acquisition Pipeline
  // ============================================
  const karlsruheAcquisition = await prisma.property.create({
    data: {
      name: 'Projekt Weststadt',
      address: 'Moltkestraße 88',
      city: 'Karlsruhe',
      zipCode: '76133',
      propertyType: PropertyType.RESIDENTIAL,
      status: PropertyStatus.FOR_SALE,
      size: 450,
      yearBuilt: 1975,
      purchasePrice: 0,
      currentValue: 920000,
      units: 6,
      description: 'Mehrfamilienhaus in Acquisition-Pipeline. Aktuell in Due Diligence.',
      acquisition: {
        create: {
          status: 'DUE_DILIGENCE',
          listingPrice: 950000,
          offerPrice: 880000,
          financing: {
            create: {
              bank: 'Sparkasse Karlsruhe',
              loanAmount: 704000,
              interestRate: 3.25,
              term: 25,
              downPayment: 176000,
              approvalStatus: 'Pre-approved',
            }
          },
          dueDiligence: {
            create: {
              titleSearch: true,
              inspection: true,
              appraisal: false,
              environmental: true,
              zoning: true,
              financials: true,
              legalReview: false,
              insurance: false,
            }
          },
        }
      },
    }
  });

  console.log('✓ Acquisition property created');

  // ============================================
  // PROPERTY 8: Pforzheim - Mixed Use
  // ============================================
  const pforzheimMixed = await prisma.property.create({
    data: {
      name: 'Altstadt Komplex',
      address: 'Westliche Karl-Friedrich-Straße 34',
      city: 'Pforzheim',
      zipCode: '75172',
      propertyType: PropertyType.MIXED_USE,
      status: PropertyStatus.RENTED,
      size: 520,
      yearBuilt: 1960,
      purchasePrice: 780000,
      currentValue: 865000,
      monthlyRent: 5600,
      units: 5,
      description: 'Mixed-Use: 3 Wohnungen + 2 Gewerbeeinheiten. Voll vermietet.',
      images: ['/images/pforzheim-mixed-1.jpg'],
      valueHistory: {
        create: [
          { date: new Date('2023-01-01'), value: 810000 },
          { date: new Date('2024-01-01'), value: 840000 },
          { date: new Date('2025-01-01'), value: 865000 },
        ]
      },
    }
  });

  console.log('✓ Pforzheim property created');

  // ============================================
  // COMMUNICATIONS (Sample)
  // ============================================
  await prisma.communication.create({
    data: {
      tenantId: tenant1.id,
      type: 'EMAIL',
      subject: 'Heizungsausfall',
      content: 'Mieter meldet Ausfall der Heizung in Wohnung 3.',
      direction: 'INBOUND',
      priority: 'HIGH',
      resolved: true,
      resolvedAt: new Date('2025-02-10'),
    }
  });

  await prisma.communication.create({
    data: {
      tenantId: tenant2.id,
      type: 'PHONE',
      subject: 'Mietvertrag Verlängerung',
      content: 'Telefonat bezüglich Vertragsverlängerung.',
      direction: 'OUTBOUND',
      priority: 'MEDIUM',
      resolved: true,
      resolvedAt: new Date('2025-02-12'),
    }
  });

  console.log('✓ Communications created');

  // ============================================
  // SUMMARY
  // ============================================
  const propertyCount = await prisma.property.count();
  const tenantCount = await prisma.tenant.count();
  const leaseCount = await prisma.lease.count();

  console.log('\n🎉 Seeding complete!');
  console.log(`   Properties: ${propertyCount}`);
  console.log(`   Tenants: ${tenantCount}`);
  console.log(`   Leases: ${leaseCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
