/* script.js */

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
  const tabButtons = document.querySelectorAll(".tablink");
  tabButtons.forEach(button => {
    button.addEventListener("click", function() {
      openTab(this.getAttribute("data-tab"), this);
    });
  });
  openTab("introTab", document.querySelector(".tablink"));
});

/** Tab Switching Function */
function openTab(tabId, btn) {
  const tabs = document.querySelectorAll(".tabcontent");
  tabs.forEach(tab => tab.style.display = "none");
  const tabButtons = document.querySelectorAll(".tablink");
  tabButtons.forEach(button => {
    button.classList.remove("active");
    button.setAttribute("aria-selected", "false");
  });
  document.getElementById(tabId).style.display = "block";
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");

  if (tabId === 'mrsTab') renderMRSChart();
  if (tabId === 'costsTab') renderCostsBenefits();
  if (tabId === 'probTab') renderUptakeChart();
}

/** Return currency symbol based on country */
function getCurrencySymbol(country) {
  return country === "Australia" ? "A$" : "€";
}

/** Coefficient estimates for vaccine mandate attributes */
const vaxCoefficients = {
  scopeAll: 0.5,          // Alternative: All occupations and public spaces
  threshold100: 0.4,     // Alternative: 100 cases/100k with 15% weekly increase
  threshold200: 0.7,     // Alternative: 200 cases/100k with 20% weekly increase
  coverageModerate: -0.4,  // Alternative: Moderate vaccine coverage (70%)
  coverageHigh: -0.8,      // Alternative: High vaccine coverage (90%)
  incentivePaid: 0.6,     // Alternative: Paid time off
  incentiveGovSub: 0.7,   // Alternative: Government subsidy/discount
  exemptionMedRel: 0.3,   // Alternative: Medical and religious exemptions
  exemptionAll: 0.5       // Alternative: Medical, religious and broad personal belief exemptions
};

/** Cost-of-living multipliers (targeted estimates) */
const colMultipliers = {
  Australia: 1.0,
  France: 0.95,
  Italy: 0.90
};

/** Country-specific cost parameters (in local currency) and rationale:
 *  - Fixed costs represent infrastructure expenses such as administration, enforcement, legal support,
 *    communication and monitoring costs incurred in implementing the mandate.
 *  - Variable costs represent costs incurred per compliant individual (e.g. time lost, additional testing,
 *    operational adjustments). */
const costParams = {
  Australia: { fixed: 200000, variable: 50, currency: "A$" },
  France: { fixed: 180000, variable: 45, currency: "€" },
  Italy: { fixed: 160000, variable: 40, currency: "€" }
};

/** Benefit scenarios (benefit per participant) in local currency.
 *  These represent assumed average monetary benefits per additional vaccinated individual,
 *  reflecting avoided healthcare costs and improved public health outcomes. Policy makers
 *  can select:
 *    - Low: 400 (conservative estimate)
 *    - Medium: 500 (central estimate)
 *    - High: 600 (optimistic estimate)
 */
const benefitScenarios = {
  low: 400,
  medium: 500,
  high: 600
};

/** Compute cost and benefit data based on country, participants, and cost-of-living adjustment.
 *  Rationale: Total cost = fixed cost (infrastructure) + (variable cost per participant × number of participants).
 *  Total benefit = benefit per participant (selected scenario) × number of participants.
 *  Net benefit = Total benefit − Total cost.
 */
function computeCostBenefits(country, participants, adjustCOL) {
  const params = costParams[country];
  const multiplier = (adjustCOL === "yes") ? colMultipliers[country] : 1;
  const fixedCost = params.fixed * multiplier;
  const variableCost = params.variable * participants * multiplier;
  const totalCost = fixedCost + variableCost;
  
  const benefitScenarioSelect = document.getElementById("benefitScenario");
  const benefitScenario = benefitScenarioSelect ? benefitScenarioSelect.value : "medium";
  const benefitPerParticipant = benefitScenarios[benefitScenario];
  const totalBenefit = benefitPerParticipant * participants;
  
  const netBenefit = totalBenefit - totalCost;
  return {
    fixedCost,
    variableCost,
    totalCost,
    benefitPerParticipant,
    totalBenefit,
    netBenefit
  };
}

/** Build scenario from inputs and compute cost benefits */
function buildScenarioFromInputs() {
  const country = document.getElementById("country_select").value;
  const adjustCOL = document.getElementById("adjustCOL").value; // "yes" or "no"
  
  // Scope: if radio for "all" is selected, alternative chosen; else Reference.
  const scopeRadio = document.querySelector('input[name="scope"]:checked');
  const scopeValue = scopeRadio ? 1 : 0;
  const scopeText = scopeRadio ? "All occupations and public spaces" : "High‑risk occupations only";
  
  // Infection Threshold: if none selected, use Reference.
  const thresholdRadio = document.querySelector('input[name="threshold"]:checked');
  let thresholdValue = 0;
  let thresholdText = "50 cases/100k with 10% weekly increase";
  if (thresholdRadio) {
    if (thresholdRadio.value === "100") {
      thresholdValue = 1;
      thresholdText = "100 cases/100k with 15% weekly increase";
    } else if (thresholdRadio.value === "200") {
      thresholdValue = 2;
      thresholdText = "200 cases/100k with 20% weekly increase";
    }
  }
  
  // Vaccine Coverage: if none selected, use Reference.
  const coverageRadio = document.querySelector('input[name="coverage"]:checked');
  let coverageValue = 0;
  let coverageText = "Low vaccine coverage (50%)";
  if (coverageRadio) {
    if (coverageRadio.value === "70") {
      coverageValue = 1;
      coverageText = "Moderate vaccine coverage (70%)";
    } else if (coverageRadio.value === "90") {
      coverageValue = 2;
      coverageText = "High vaccine coverage (90%)";
    }
  }
  
  // Incentives: if none selected, use Reference.
  const incentiveRadio = document.querySelector('input[name="incentive"]:checked');
  let incentiveValue = 0;
  let incentiveText = "None (No incentives)";
  if (incentiveRadio) {
    if (incentiveRadio.value === "paid") {
      incentiveValue = 1;
      incentiveText = "Paid time off for vaccination (1–3 days)";
    } else if (incentiveRadio.value === "govsub") {
      incentiveValue = 2;
      incentiveText = "Government subsidy/discount on services";
    }
  }
  
  // Exemption Policy: if none selected, use Reference.
  const exemptionRadio = document.querySelector('input[name="exemption"]:checked');
  let exemptionValue = 0;
  let exemptionText = "Medical exemptions only";
  if (exemptionRadio) {
    if (exemptionRadio.value === "medRel") {
      exemptionValue = 1;
      exemptionText = "Medical and religious exemptions";
    } else if (exemptionRadio.value === "all") {
      exemptionValue = 2;
      exemptionText = "Medical, religious and broad personal belief exemptions";
    }
  }
  
  // Calculate overall utility as sum of attribute effects.
  let utility = 0;
  utility += scopeValue * vaxCoefficients.scopeAll;
  if (thresholdValue === 1) {
    utility += vaxCoefficients.threshold100;
  } else if (thresholdValue === 2) {
    utility += vaxCoefficients.threshold200;
  }
  if (coverageValue === 1) {
    utility += vaxCoefficients.coverageModerate;
  } else if (coverageValue === 2) {
    utility += vaxCoefficients.coverageHigh;
  }
  if (incentiveValue === 1) {
    utility += vaxCoefficients.incentivePaid;
  } else if (incentiveValue === 2) {
    utility += vaxCoefficients.incentiveGovSub;
  }
  if (exemptionValue === 1) {
    utility += vaxCoefficients.exemptionMedRel;
  } else if (exemptionValue === 2) {
    utility += vaxCoefficients.exemptionAll;
  }
  
  const uptakeProb = 1 / (1 + Math.exp(-utility));
  const uptakePercentage = uptakeProb * 100;
  const participants = Math.round(uptakeProb * 2000);
  
  const costData = computeCostBenefits(country, participants, adjustCOL);
  
  return {
    country,
    adjustCOL,
    scope: scopeText,
    threshold: thresholdText,
    coverage: coverageText,
    incentive: incentiveText,
    exemption: exemptionText,
    utility,
    uptakePercentage: uptakePercentage.toFixed(2),
    participants,
    netBenefit: costData.netBenefit,
    costDetails: costData
  };
}

/** Calculate and display scenario results in modal */
function calculateScenario() {
  const scenario = buildScenarioFromInputs();
  const currency = getCurrencySymbol(scenario.country);
  const resultHTML = `<h4>Scenario Results</h4>
    <p><strong>Country:</strong> ${scenario.country}</p>
    <p><strong>Scope:</strong> ${scenario.scope}</p>
    <p><strong>Infection Threshold:</strong> ${scenario.threshold}</p>
    <p><strong>Vaccine Coverage Requirement:</strong> ${scenario.coverage}</p>
    <p><strong>Incentives:</strong> ${scenario.incentive}</p>
    <p><strong>Exemption Policy:</strong> ${scenario.exemption}</p>
    <p><strong>Predicted Uptake:</strong> ${scenario.uptakePercentage}%</p>
    <p><strong>Estimated Participants (out of 2000):</strong> ${scenario.participants}</p>
    <p><strong>Net Benefit:</strong> ${currency}${scenario.netBenefit.toFixed(2)}</p>`;
  document.getElementById("modalResults").innerHTML = resultHTML;
  openModal();
}

/** Modal Functions */
function openModal() {
  document.getElementById("resultModal").style.display = "block";
}
function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

/** Uptake Recommendations: Show detailed policy recommendations in a popup modal */
function showUptakeRecommendations() {
  const scenario = buildScenarioFromInputs();
  let rec = "<h4>Policy Recommendations</h4>";
  if (scenario.uptakePercentage < 40) {
    rec += "<p>Uptake is low. It is recommended to enhance public communication, increase incentives and review alternative delivery methods to improve uptake.</p>";
  } else if (scenario.uptakePercentage < 60) {
    rec += "<p>Uptake is moderate. Consider strengthening support measures and re‐evaluating infection threshold settings to boost acceptance.</p>";
  } else {
    rec += "<p>Uptake is high. The current configuration appears effective. Continue monitoring and adjust marginally if required.</p>";
  }
  rec += `<p><strong>Estimated Participants:</strong> ${scenario.participants} out of 2000.</p>`;
  document.getElementById("uptakeResults").innerHTML = rec;
  document.getElementById("uptakeModal").style.display = "block";
}
function closeUptakeModal() {
  document.getElementById("uptakeModal").style.display = "none";
}

/** Render MRS Chart with intuitive comparisons */
let mrsChartInstance = null;
function renderMRSChart() {
  const ctx = document.getElementById("mrsChart").getContext("2d");
  if (mrsChartInstance) mrsChartInstance.destroy();
  
  const mrsModerate = - (vaxCoefficients.threshold100) / (vaxCoefficients.coverageModerate);
  const mrsSevere = - (vaxCoefficients.threshold200) / (vaxCoefficients.coverageHigh);
  const mrsScopeIncentive = - (vaxCoefficients.incentivePaid) / (vaxCoefficients.scopeAll);
  
  const dataConfig = {
    labels: ["MRS: 100 cases vs 70% coverage", "MRS: 200 cases vs 90% coverage", "MRS: Paid incentive vs Scope"],
    datasets: [{
      label: "MRS Value",
      data: [mrsModerate, mrsSevere, mrsScopeIncentive],
      backgroundColor: ['rgba(54,162,235,0.6)', 'rgba(75,192,192,0.6)', 'rgba(153,102,255,0.6)'],
      borderColor: ['rgba(54,162,235,1)', 'rgba(75,192,192,1)', 'rgba(153,102,255,1)'],
      borderWidth: 1
    }]
  };
  
  mrsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: dataConfig,
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Marginal Rate of Substitution", font: { size: 16 } },
        tooltip: { callbacks: { label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}` } }
      }
    }
  });
  
  document.getElementById("mrsInfo").innerHTML = `<p><strong>Interpretation:</strong> An MRS of ${mrsModerate.toFixed(2)} indicates that to accept a threshold of 100 cases/100k (instead of 50), an improvement in vaccine coverage equivalent to ${mrsModerate.toFixed(2)} units is required. Similarly, an MRS of ${mrsSevere.toFixed(2)} is needed for a threshold of 200 cases/100k, while the trade‐off between offering a paid incentive and expanding the mandate scope is ${mrsScopeIncentive.toFixed(2)}.</p>`;
}

/** Render Uptake Chart */
let uptakeChart = null;
function renderUptakeChart() {
  const scenario = buildScenarioFromInputs();
  const uptakeVal = parseFloat(scenario.uptakePercentage);
  drawUptakeChart(uptakeVal);
}
function drawUptakeChart(uptakeVal) {
  const ctx = document.getElementById("uptakeChart").getContext("2d");
  if (uptakeChart) uptakeChart.destroy();
  uptakeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Uptake", "Non‑uptake"],
      datasets: [{
        data: [uptakeVal, 100 - uptakeVal],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: `Predicted Uptake: ${uptakeVal.toFixed(1)}%`, font: { size: 16 } },
        tooltip: { callbacks: { label: context => `${context.label}: ${context.parsed.toFixed(1)}%` } }
      }
    }
  });
}

/** Render Costs & Benefits Analysis with detailed cards and combined chart */
let combinedChartInstance = null;
function renderCostsBenefits() {
  const scenario = buildScenarioFromInputs();
  const costData = computeCostBenefits(scenario.country, scenario.participants, scenario.adjustCOL);
  const currency = getCurrencySymbol(scenario.country);
  
  // Build detailed cost cards
  let costCardsHTML = `
    <div class="card cost-card">
      <h4>Fixed Costs</h4>
      <p>Costs associated with administration, enforcement, legal support, communication and monitoring.</p>
      <p><strong>Value:</strong> ${currency}${costData.fixedCost.toFixed(2)}</p>
    </div>
    <div class="card cost-card">
      <h4>Variable Costs</h4>
      <p>Costs incurred per compliant participant (e.g. time lost, additional testing and operational adjustments).</p>
      <p><strong>Per Participant Cost:</strong> ${currency}${costParams[scenario.country].variable.toFixed(2)} (adjusted by cost‐of‐living multiplier)</p>
      <p><strong>Total Variable Cost:</strong> ${currency}${costData.variableCost.toFixed(2)}</p>
    </div>
    <div class="card cost-card">
      <h4>Total Intervention Cost</h4>
      <p><strong>Total Cost:</strong> ${currency}${costData.totalCost.toFixed(2)}</p>
    </div>`;
  
  // Build benefit cards with rationale explanation
  let benefitCardsHTML = `
    <div class="card cost-card">
      <h4>Benefit per Participant</h4>
      <p>This value represents the estimated monetary benefit per additional vaccinated individual,
         capturing avoided healthcare costs and improved quality of life (via reduced risk of severe illness or death).<br>
         Policy makers can select:
         <ul>
           <li>Low: Conservative estimate (benefit = 400 per participant)</li>
           <li>Medium: Central estimate (benefit = 500 per participant)</li>
           <li>High: Optimistic estimate (benefit = 600 per participant)</li>
         </ul>
      </p>
      <p><strong>Benefit:</strong> ${currency}${benefitScenarios[document.getElementById("benefitScenario").value].toFixed(2)} per participant</p>
    </div>
    <div class="card cost-card">
      <h4>Total Benefit</h4>
      <p><strong>Total Benefit:</strong> ${currency}${costData.totalBenefit.toFixed(2)}</p>
    </div>
    <div class="card cost-card">
      <h4>Net Benefit</h4>
      <p><strong>Net Benefit:</strong> ${currency}${costData.netBenefit.toFixed(2)}</p>
    </div>`;
  
  const costsTab = document.getElementById("costsBenefitsResults");
  costsTab.innerHTML = costCardsHTML + benefitCardsHTML;
  
  // Combined bar chart for visual summary
  const combinedChartContainer = document.createElement("div");
  combinedChartContainer.id = "combinedChartContainer";
  combinedChartContainer.innerHTML = `<canvas id="combinedChart"></canvas>`;
  costsTab.appendChild(combinedChartContainer);
  
  const ctxCombined = document.getElementById("combinedChart").getContext("2d");
  if (combinedChartInstance) combinedChartInstance.destroy();
  combinedChartInstance = new Chart(ctxCombined, {
    type: 'bar',
    data: {
      labels: ["Total Cost", "Total Benefit", "Net Benefit"],
      datasets: [{
        label: currency,
        data: [costData.totalCost, costData.totalBenefit, costData.netBenefit],
        backgroundColor: [
          'rgba(220,53,69,0.6)',
          'rgba(40,167,69,0.6)',
          'rgba(255,193,7,0.6)'
        ],
        borderColor: [
          'rgba(220,53,69,1)',
          'rgba(40,167,69,1)',
          'rgba(255,193,7,1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Combined Cost-Benefit Analysis", font: { size: 16 } }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(costData.totalCost, costData.totalBenefit, Math.abs(costData.netBenefit)) * 1.2
        }
      }
    }
  });
}

/** Scenario Saving & CSV Download */
let savedScenarios = [];
function saveScenario() {
  const scenario = buildScenarioFromInputs();
  const costData = computeCostBenefits(scenario.country, scenario.participants, scenario.adjustCOL);
  scenario.netBenefit = costData.netBenefit;
  scenario.name = `Scenario ${savedScenarios.length + 1}`;
  savedScenarios.push(scenario);
  const tableBody = document.querySelector("#scenarioTable tbody");
  const row = document.createElement("tr");
  const props = ["name", "country", "scope", "threshold", "coverage", "incentive", "exemption", "uptakePercentage", "netBenefit"];
  props.forEach(prop => {
    const cell = document.createElement("td");
    if (prop === "netBenefit") {
      cell.textContent = getCurrencySymbol(scenario.country) + scenario[prop].toFixed(2);
    } else {
      cell.textContent = scenario[prop];
    }
    row.appendChild(cell);
  });
  tableBody.appendChild(row);
  alert(`Scenario "${scenario.name}" saved successfully.`);
}

function openComparison() {
  if (savedScenarios.length < 2) {
    alert("Save at least two scenarios to compare.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;
  doc.setFontSize(16);
  doc.text("Vaccine Mandate Scenarios Comparison", pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;
  savedScenarios.forEach((scenario, index) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 15;
    }
    doc.setFontSize(14);
    doc.text(`Scenario ${index + 1}: ${scenario.name}`, 15, currentY);
    currentY += 7;
    doc.setFontSize(12);
    doc.text(`Country: ${scenario.country}`, 15, currentY); currentY += 5;
    doc.text(`Scope: ${scenario.scope}`, 15, currentY); currentY += 5;
    doc.text(`Threshold: ${scenario.threshold}`, 15, currentY); currentY += 5;
    doc.text(`Coverage: ${scenario.coverage}`, 15, currentY); currentY += 5;
    doc.text(`Incentive: ${scenario.incentive}`, 15, currentY); currentY += 5;
    doc.text(`Exemption: ${scenario.exemption}`, 15, currentY); currentY += 5;
    doc.text(`Predicted Uptake: ${scenario.uptakePercentage}%`, 15, currentY); currentY += 5;
    doc.text(`Net Benefit: ${getCurrencySymbol(scenario.country)}${scenario.netBenefit.toFixed(2)}`, 15, currentY); currentY += 10;
  });
  doc.save("Scenarios_Comparison.pdf");
}

function downloadCSV() {
  if (savedScenarios.length === 0) {
    alert("No scenarios to download.");
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Country,Scope,Threshold,Coverage,Incentive,Exemption,Uptake (%),Net Benefit\n";
  savedScenarios.forEach(scenario => {
    const row = [
      scenario.name,
      scenario.country,
      scenario.scope,
      scenario.threshold,
      scenario.coverage,
      scenario.incentive,
      scenario.exemption,
      scenario.uptakePercentage,
      getCurrencySymbol(scenario.country) + scenario.netBenefit.toFixed(2)
    ];
    csvContent += row.join(",") + "\n";
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "scenarios.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
