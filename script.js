// script.js

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

  if (tabId === 'wtpTab') renderWTPChart();
  if (tabId === 'costsTab') renderCostsBenefits();
  if (tabId === 'probTab') renderUptakeChart();
}

/** Update Range Slider Display for Financial Incentive */
function updateFinancialDisplay(val) {
  document.getElementById("financialLabel").textContent = val;
}

/** Coefficient estimates based on targeted literature and theoretical expectations
    (e.g., Betsch et al., 2018; Larson et al., 2014) */
const vaxCoefficients = {
  Scope_All: 0.6,           // Utility gain for mandating all occupations/public spaces
  Threshold_100: -0.4,      // Additional disutility for moderate infection threshold
  Threshold_200: -1.0,      // Greater disutility for severe infection threshold
  Coverage_Moderate: 0.5,   // Utility gain for moderate (70%) vaccine coverage
  Coverage_High: 1.0,       // Higher utility gain for high (90%) coverage
  Incentive_Paid: 0.7,      // Utility gain for paid time off incentive
  Incentive_GovSub: 0.8,    // Utility gain for government subsidy incentive
  Exemption_MedRel: 0.4,    // Utility gain for allowing medical and religious exemptions
  Exemption_All: 0.7,       // Utility gain for broader exemption policy
  Financial_Incentive: 0.002 // Trade-off parameter (per USD offered)
};

/** Build scenario from user inputs */
function buildScenarioFromInputs() {
  const country = document.getElementById("country_select").value;
  const scope = document.querySelector('input[name="scope"]:checked').value;  
  const threshold = document.querySelector('input[name="threshold"]:checked').value;
  const coverage = document.querySelector('input[name="coverage"]:checked').value;
  const incentive = document.querySelector('input[name="incentive"]:checked').value;
  const exemption = document.querySelector('input[name="exemption"]:checked').value;
  const financialVal = parseFloat(document.getElementById("financialSlider").value);

  // Dummy coding: reference levels are coded as 0.
  const scopeAll = (scope === "all") ? 1 : 0;
  let threshold100 = 0, threshold200 = 0;
  if (threshold === "100") threshold100 = 1;
  if (threshold === "200") threshold200 = 1;
  
  let coverageModerate = 0, coverageHigh = 0;
  if (coverage === "70") coverageModerate = 1;
  if (coverage === "90") coverageHigh = 1;
  
  let incentivePaid = 0, incentiveGovSub = 0;
  if (incentive === "paid") incentivePaid = 1;
  if (incentive === "govsub") incentiveGovSub = 1;
  
  let exemptionMedRel = 0, exemptionAll = 0;
  if (exemption === "medRel") exemptionMedRel = 1;
  if (exemption === "all") exemptionAll = 1;
  
  // Calculate utility as linear sum of attribute effects
  const utility =
    (vaxCoefficients.Scope_All * scopeAll) +
    (vaxCoefficients.Threshold_100 * threshold100) +
    (vaxCoefficients.Threshold_200 * threshold200) +
    (vaxCoefficients.Coverage_Moderate * coverageModerate) +
    (vaxCoefficients.Coverage_High * coverageHigh) +
    (vaxCoefficients.Incentive_Paid * incentivePaid) +
    (vaxCoefficients.Incentive_GovSub * incentiveGovSub) +
    (vaxCoefficients.Exemption_MedRel * exemptionMedRel) +
    (vaxCoefficients.Exemption_All * exemptionAll) +
    (vaxCoefficients.Financial_Incentive * financialVal);

  // Logistic transformation: assume opt-out utility = 0
  const uptakeProb = 1 / (1 + Math.exp(-utility));
  const uptakePercentage = uptakeProb * 100;
  // Base participants per country is 2000
  const participants = uptakeProb * 2000;

  return {
    country,
    scope: (scope === "all") ? "All occupations/public spaces" : "High‑risk occupations only",
    threshold: threshold,
    coverage: coverage + "%",
    incentive: (incentive === "none") ? "No incentives" : (incentive === "paid") ? "Paid time off" : "Govt subsidy",
    exemption: (exemption === "medical") ? "Medical only" : (exemption === "medRel") ? "Medical & Religious" : "Broad exemptions",
    financialVal,
    utility,
    uptakePercentage: uptakePercentage.toFixed(2),
    participants: Math.round(participants)
  };
}

/** Calculate and display scenario results */
function calculateScenario() {
  const scenario = buildScenarioFromInputs();
  const resultHTML = `<h4>Scenario Results</h4>
    <p><strong>Country:</strong> ${scenario.country}</p>
    <p><strong>Scope:</strong> ${scenario.scope}</p>
    <p><strong>Infection Threshold:</strong> ${scenario.threshold} cases/100k</p>
    <p><strong>Vaccine Coverage Requirement:</strong> ${scenario.coverage}</p>
    <p><strong>Incentive:</strong> ${scenario.incentive}</p>
    <p><strong>Exemption Policy:</strong> ${scenario.exemption}</p>
    <p><strong>Financial Incentive:</strong> $${scenario.financialVal}</p>
    <p><strong>Predicted Uptake:</strong> ${scenario.uptakePercentage}%</p>
    <p><strong>Estimated Participants:</strong> ${scenario.participants}</p>`;
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

/** Render WTP Chart */
let wtpChartInstance = null;
function renderWTPChart() {
  const ctx = document.getElementById("wtpChartMain").getContext("2d");
  if (wtpChartInstance) wtpChartInstance.destroy();
  // Calculate WTP (USD) for non-reference attribute levels:
  // WTP = - (β_attribute) / (β_Financial_Incentive)
  const wtpData = [
    { attribute: "All occupations/public spaces", wtp: -(vaxCoefficients.Scope_All)/vaxCoefficients.Financial_Incentive },
    { attribute: "100 cases/100k threshold", wtp: -(vaxCoefficients.Threshold_100)/vaxCoefficients.Financial_Incentive },
    { attribute: "200 cases/100k threshold", wtp: -(vaxCoefficients.Threshold_200)/vaxCoefficients.Financial_Incentive },
    { attribute: "70% vaccine coverage", wtp: -(vaxCoefficients.Coverage_Moderate)/vaxCoefficients.Financial_Incentive },
    { attribute: "90% vaccine coverage", wtp: -(vaxCoefficients.Coverage_High)/vaxCoefficients.Financial_Incentive },
    { attribute: "Paid time off", wtp: -(vaxCoefficients.Incentive_Paid)/vaxCoefficients.Financial_Incentive },
    { attribute: "Govt subsidy/discount", wtp: -(vaxCoefficients.Incentive_GovSub)/vaxCoefficients.Financial_Incentive },
    { attribute: "Medical & Religious exemptions", wtp: -(vaxCoefficients.Exemption_MedRel)/vaxCoefficients.Financial_Incentive },
    { attribute: "Broad exemption policy", wtp: -(vaxCoefficients.Exemption_All)/vaxCoefficients.Financial_Incentive }
  ];
  const labels = wtpData.map(item => item.attribute);
  const values = wtpData.map(item => item.wtp);
  const dataConfig = {
    labels,
    datasets: [{
      label: "WTP (USD)",
      data: values,
      backgroundColor: values.map(v => v >= 0 ? 'rgba(40,167,69,0.6)' : 'rgba(220,53,69,0.6)'),
      borderColor: values.map(v => v >= 0 ? 'rgba(40,167,69,1)' : 'rgba(220,53,69,1)'),
      borderWidth: 1
    }]
  };
  wtpChartInstance = new Chart(ctx, {
    type: 'bar',
    data: dataConfig,
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: false },
        title: { display: true, text: "WTP (USD) for Mandate Attributes", font: { size: 16 } },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

/** Render Uptake Chart */
let uptakeChart = null;
function renderUptakeChart() {
  const scenario = buildScenarioFromInputs();
  const uptakeVal = parseFloat(scenario.uptakePercentage);
  drawUptakeChart(uptakeVal);
}

/** Draw Uptake Chart (Doughnut) */
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
        title: {
          display: true,
          text: `Predicted Uptake: ${uptakeVal.toFixed(1)}%`,
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.toFixed(1)}%`;
            }
          }
        }
      }
    }
  });
}

/** Costs & Benefits Analysis (illustrative) */
let combinedChartInstance = null;
function renderCostsBenefits() {
  const scenario = buildScenarioFromInputs();
  // For illustration, assume intervention cost is a function of the financial incentive and fixed cost components.
  const fixedCost = 50000; // fixed program cost (USD)
  const variableCost = scenario.financialVal * 10; // arbitrary multiplier
  const totalCost = fixedCost + variableCost;
  // Assume benefits increase with higher uptake (e.g., reduced disease burden)
  const monetizedBenefits = scenario.participants * 50; // arbitrary benefit per participant (USD)
  const netBenefit = monetizedBenefits - totalCost;

  const costsTab = document.getElementById("costsBenefitsResults");
  costsTab.innerHTML = `
    <h4>Costs &amp; Benefits Analysis</h4>
    <p><strong>Total Intervention Cost:</strong> $${totalCost.toFixed(2)}</p>
    <p><strong>Monetized Benefits:</strong> $${monetizedBenefits.toFixed(2)}</p>
    <p><strong>Net Benefit:</strong> $${netBenefit.toFixed(2)}</p>
  `;
  const combinedChartContainer = document.createElement("div");
  combinedChartContainer.id = "combinedChartContainer";
  combinedChartContainer.innerHTML = `<canvas id="combinedChart"></canvas>`;
  costsTab.appendChild(combinedChartContainer);

  const ctxCombined = document.getElementById("combinedChart").getContext("2d");
  if (combinedChartInstance) combinedChartInstance.destroy();
  combinedChartInstance = new Chart(ctxCombined, {
    type: 'bar',
    data: {
      labels: ["Total Cost", "Monetized Benefits", "Net Benefit"],
      datasets: [{
        label: "USD",
        data: [totalCost, monetizedBenefits, netBenefit],
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
          suggestedMax: Math.max(totalCost, monetizedBenefits, Math.abs(netBenefit)) * 1.2
        }
      }
    }
  });
}

/** Scenario Saving & PDF Export */
let savedScenarios = [];
function saveScenario() {
  const scenario = buildScenarioFromInputs();
  if (!scenario) return;
  scenario.name = `Scenario ${savedScenarios.length + 1}`;
  savedScenarios.push(scenario);
  const tableBody = document.querySelector("#scenarioTable tbody");
  const row = document.createElement("tr");
  const props = ["name", "country", "scope", "threshold", "coverage", "incentive", "exemption", "financialVal", "uptakePercentage", "participants"];
  props.forEach(prop => {
    const cell = document.createElement("td");
    cell.textContent = (prop === "financialVal") ? `$${scenario[prop].toFixed(2)}` : scenario[prop];
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
    doc.text(`Threshold: ${scenario.threshold} cases/100k`, 15, currentY); currentY += 5;
    doc.text(`Coverage: ${scenario.coverage}`, 15, currentY); currentY += 5;
    doc.text(`Incentive: ${scenario.incentive}`, 15, currentY); currentY += 5;
    doc.text(`Exemption: ${scenario.exemption}`, 15, currentY); currentY += 5;
    doc.text(`Financial Incentive: $${scenario.financialVal.toFixed(2)}`, 15, currentY); currentY += 5;
    doc.text(`Predicted Uptake: ${scenario.uptakePercentage}%`, 15, currentY); currentY += 5;
    doc.text(`Participants: ${scenario.participants}`, 15, currentY); currentY += 10;
  });
  doc.save("Scenarios_Comparison.pdf");
}
