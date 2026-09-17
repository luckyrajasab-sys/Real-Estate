import { useState, useMemo } from "react";

export function formatINR(val) {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function EMICalculator({ propertyPriceNum = 10000000, title = "Home" }) {
  const [price, setPrice] = useState(propertyPriceNum > 0 ? propertyPriceNum : 10000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const calculations = useMemo(() => {
    const downPayment = (price * downPaymentPercent) / 100;
    const principal = Math.max(0, price - downPayment);
    const monthlyRate = interestRate / (12 * 100);
    const months = tenureYears * 12;

    let emi = 0;
    if (principal > 0 && monthlyRate > 0) {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayable = emi * months;
    const totalInterest = Math.max(0, totalPayable - principal);
    const principalPercent = totalPayable > 0 ? Math.round((principal / totalPayable) * 100) : 50;

    return {
      downPayment,
      principal,
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      principalPercent,
      interestPercent: 100 - principalPercent,
    };
  }, [price, downPaymentPercent, interestRate, tenureYears]);

  return (
    <div className="card emi-calculator-card">
      <div className="emi-card-head">
        <div>
          <span className="eyebrow-note" style={{ marginBottom: "0.25rem" }}>Finance Estimate</span>
          <h3 style={{ margin: 0 }}>EMI & Loan Calculator</h3>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.88rem" }}>
            Estimated monthly payment for {title}
          </p>
        </div>
      </div>

      <div className="emi-result-box">
        <div className="emi-result-label">Estimated Monthly EMI</div>
        <div className="emi-result-amount">{formatINR(calculations.emi)}/mo</div>
        <div className="emi-breakdown-bar" role="progressbar" aria-label="Principal vs Interest Ratio">
          <div
            className="emi-bar-principal"
            style={{ width: `${calculations.principalPercent}%` }}
            title={`Principal: ${calculations.principalPercent}%`}
          />
          <div
            className="emi-bar-interest"
            style={{ width: `${calculations.interestPercent}%` }}
            title={`Interest: ${calculations.interestPercent}%`}
          />
        </div>
        <div className="emi-bar-legend">
          <span><span className="legend-dot principal" /> Principal: {formatINR(calculations.principal)}</span>
          <span><span className="legend-dot interest" /> Interest: {formatINR(calculations.totalInterest)}</span>
        </div>
      </div>

      <div className="emi-controls-grid">
        <div className="field">
          <div className="field-head-row">
            <label htmlFor="emi-down">Down payment ({downPaymentPercent}%)</label>
            <span className="field-val-hint">{formatINR(calculations.downPayment)}</span>
          </div>
          <input
            id="emi-down"
            type="range"
            min="10"
            max="60"
            step="5"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="field">
          <div className="field-head-row">
            <label htmlFor="emi-rate">Interest rate (p.a.)</label>
            <span className="field-val-hint">{interestRate}%</span>
          </div>
          <input
            id="emi-rate"
            type="range"
            min="7"
            max="14"
            step="0.25"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <div className="field-head-row">
            <label htmlFor="emi-tenure">Loan tenure</label>
            <span className="field-val-hint">{tenureYears} Years</span>
          </div>
          <input
            id="emi-tenure"
            type="range"
            min="5"
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="slider"
          />
          <div className="slider-ticks">
            <span>5 yrs</span>
            <span>10 yrs</span>
            <span>15 yrs</span>
            <span>20 yrs</span>
            <span>25 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>
      </div>

      <div className="emi-summary-strip">
        <div className="emi-summary-item">
          <span className="lbl">Total loan amount</span>
          <span className="val">{formatINR(calculations.principal)}</span>
        </div>
        <div className="emi-summary-item">
          <span className="lbl">Total payable</span>
          <span className="val">{formatINR(calculations.totalPayable)}</span>
        </div>
      </div>
    </div>
  );
}
