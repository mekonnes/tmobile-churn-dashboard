export function calculateChurnScore(customer) {
  let score = 0;

  // Service calls — strongest churn signal
  if (customer.serviceCalls >= 10) score += 20;
  else if (customer.serviceCalls >= 7) score += 15;
  else if (customer.serviceCalls >= 5) score += 10;
  else if (customer.serviceCalls >= 3) score += 5;

  // Payment failures
  if (customer.paymentFailures >= 5) score += 15;
  else if (customer.paymentFailures >= 3) score += 10;
  else if (customer.paymentFailures >= 1) score += 5;

  // Payment arrangements
  if (customer.paymentArrangements >= 4) score += 12;
  else if (customer.paymentArrangements >= 2) score += 8;
  else if (customer.paymentArrangements >= 1) score += 4;

  // Recent line cancellation
  if (customer.recentLineCancellation) score += 10;

  // Device age
  if (customer.deviceAge >= 6) score += 8;
  else if (customer.deviceAge >= 4) score += 5;
  else if (customer.deviceAge >= 3) score += 2;

  // Contract months left
  if (customer.contractMonthsLeft === 0) score += 8;
  else if (customer.contractMonthsLeft <= 3) score += 5;
  else if (customer.contractMonthsLeft <= 6) score += 2;

  // Last interaction days
  if (customer.lastInteractionDays >= 90) score += 6;
  else if (customer.lastInteractionDays >= 60) score += 4;
  else if (customer.lastInteractionDays >= 30) score += 2;

  // Data usage trend
  if (customer.dataUsageTrend <= -3) score += 6;
  else if (customer.dataUsageTrend <= -1) score += 3;
  else if (customer.dataUsageTrend > 2) score -= 4;
  else if (customer.dataUsageTrend > 4) score -= 7;

  // Tenure
  if (customer.tenure <= 3) score += 6;
  else if (customer.tenure <= 6) score += 4;
  else if (customer.tenure <= 12) score += 2;
  else if (customer.tenure >= 36) score -= 5;
  else if (customer.tenure >= 24) score -= 3;

  // Plan type
  if (customer.plan === 'Essentials') score += 4;
  else if (customer.plan === 'Experience Beyond') score -= 4;

  // Line count
  if (customer.lineCount === 1) score += 4;
  else if (customer.lineCount >= 4) score -= 4;
  else if (customer.lineCount >= 6) score -= 7;

  // Promotion used
  if (customer.promotionUsed) score += 3;

  // Customer service satisfaction
  if (customer.customerServiceSatisfaction === 1) score += 10;
  else if (customer.customerServiceSatisfaction === 2) score += 5;
  else if (customer.customerServiceSatisfaction === 4) score -= 3;
  else if (customer.customerServiceSatisfaction === 5) score -= 6;

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Assign risk level
  let riskLevel;
  if (score >= 60) riskLevel = 'High';
  else if (score >= 35) riskLevel = 'Medium';
  else riskLevel = 'Low';

  return { ...customer, churnScore: score, riskLevel };
}

export function scoreAllCustomers(customers) {
  return customers.map(calculateChurnScore);
}