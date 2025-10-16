export const loanDecisionSchema = {
  type: 'object',
  properties: {
    riskScore: { type: 'number' },
    riskLevel: { type: 'string' },
    riskPeriods: {
      type: 'array',
      items: { type: 'number' },
    },
    riskDecision: { type: 'string' },
    applicationId: { type: 'string' },
  },
  required: ['riskScore', 'riskLevel', 'riskPeriods', 'riskDecision'],
}
