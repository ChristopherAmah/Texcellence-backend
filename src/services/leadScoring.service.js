const gradeForScore = (score) => score >= 80 ? 'HOT' : score >= 60 ? 'WARM' : score >= 40 ? 'NURTURE' : 'LOW_PRIORITY';

const points = {
  seniority: { EXECUTIVE: 20, SENIOR: 15, MID: 10, OTHER: 5 },
  companyFit: { HIGH: 20, MEDIUM: 12, LOW: 5 },
  engagement: { HIGH: 20, MEDIUM: 12, LOW: 5 },
  purchaseIntent: { '0_3_MONTHS': 25, '3_6_MONTHS': 18, '6_12_MONTHS': 12, RESEARCHING: 5 },
  decisionAuthority: { DECISION_MAKER: 15, INFLUENCER: 10, USER: 5 },
};

export const calculateLeadScore = (answers) => {
  const breakdown = Object.fromEntries(Object.entries(points).map(([category, values]) => [category, values[answers[category]] || 0]));
  const score = Object.values(breakdown).reduce((total, value) => total + value, 0);
  return { score, grade: gradeForScore(score), breakdown };
};