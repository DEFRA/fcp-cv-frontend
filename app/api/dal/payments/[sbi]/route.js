import { ecsFormat } from '@elastic/ecs-pino-format'
import pino from 'pino'

const logger = pino({ ...ecsFormat() })

const payments = [
  {
    reference: '1234567890',
    date: '2021-01-01',
    amount: 100.99,
    line_items: [
      {
        agreement_reference: 'AG00001234',
        claim_number: '1234567890',
        scheme: 'Agreement Payment',
        marketing_year: '2021',
        description: 'Agreement Payment',
        amount: 50.99
      },
      {
        agreement_reference: 'AG00001234',
        claim_number: '1234567890',
        scheme: 'Agreement Payment',
        marketing_year: '2021',
        description: 'Agreement Payment',
        amount: 50.99
      }
    ]
  },
  {
    reference: '2345678901',
    date: '2021-03-15',
    amount: 250.75,
    line_items: [
      {
        agreement_reference: 'AG00002345',
        claim_number: '2345678901',
        scheme: 'Environmental Stewardship',
        marketing_year: '2021',
        description: 'Countryside Stewardship Payment',
        amount: 150.25
      },
      {
        agreement_reference: 'AG00002345',
        claim_number: '2345678901',
        scheme: 'Environmental Stewardship',
        marketing_year: '2021',
        description: 'Habitat Management',
        amount: 100.5
      }
    ]
  },
  {
    reference: '3456789012',
    date: '2021-06-30',
    amount: 75.5,
    line_items: [
      {
        agreement_reference: 'AG00003456',
        claim_number: '3456789012',
        scheme: 'Basic Payment Scheme',
        marketing_year: '2021',
        description: 'BPS Entitlement Payment',
        amount: 75.5
      }
    ]
  },
  {
    reference: '4567890123',
    date: '2021-09-12',
    amount: 425.33,
    line_items: [
      {
        agreement_reference: 'AG00004567',
        claim_number: '4567890123',
        scheme: 'Sustainable Farming Incentive',
        marketing_year: '2021',
        description: 'Arable and Horticultural Soils',
        amount: 200.0
      },
      {
        agreement_reference: 'AG00004567',
        claim_number: '4567890123',
        scheme: 'Sustainable Farming Incentive',
        marketing_year: '2021',
        description: 'Improved Grassland Soils',
        amount: 125.33
      },
      {
        agreement_reference: 'AG00004567',
        claim_number: '4567890123',
        scheme: 'Sustainable Farming Incentive',
        marketing_year: '2021',
        description: 'Moorland and Rough Grazing',
        amount: 100.0
      }
    ]
  }
]

const onHold = true

export async function GET(_request, ctx) {
  const { sbi } = await ctx.params
  logger.info(`GET /api/dal/payments/${sbi}`)
  return Response.json({ payments, onHold })
}
