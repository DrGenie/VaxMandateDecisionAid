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

/** Coefficient estimates for vaccine mandate attributes */
const vaxCoefficients = {
  scopeAll: 0.5,          // for "All occupations and public spaces"
  threshold100: -0.3,     // for "100 cases/100k with 15% weekly increase"
  threshold200: -0.7,     // for "200 cases/100k with 20% weekly increase"
  coverageModerate: 0.4,  // for "Moderate vaccine coverage (70%)"
  coverageHigh: 0.8,      // for "High vaccine coverage (90%)"
  incentivePaid: 0.6,     // for "Paid time off"
  incentiveGovSub: 0.7,   // for "Government subsidy/discount"
  exemptionMedRel: 0.3,   // for "Medical and religious exemptions"
  exemptionAll: 0.5       // for "Medical, religious, and broad personal belief exemptions"
};

/** Build scenario from inputs */
function buildScenarioFromInputs() {
  const country = document.getElementById("country_select").value;
  
  // Scope: if radio button for "all" is selected, then value 1; otherwise baseline (0)
  const scopeRadio = document.querySelector('input[name="scope"]:checked');
  const scopeValue = scopeRadio ? 1 : 0;
  const scopeText = scopeRadio ? "All occupations and public spaces" : "High‑risk occupations only";
  
  // Infection Threshold: radio buttons for alternatives (100 or 200); if none selected, baseline (50)
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
  
  // Vaccine Coverage Requirement: radio buttons for alternatives (70 or 90); baseline is 50%
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
  
  // Incentives: radio buttons for alternatives; baseline is None.
  const incentiveRadio = document.querySelector('input[name="incentive"]:checked');
  let incentiveValue = 0;
  let incentiveText = "None (No incentives)";
  if (incentiveRadio) {
    if (incentiveRadio.value === "paid") {
      incentiveValue = 1;
      incentiveText = "Paid time off for vaccination (1-3 days)";
    } else if (incentiveRadio.value === "govsub") {
      incentiveValue = 2;
      incentiveText = "Government subsidy/discount on services";
    }
  }
  
  // Exemption Policy: radio buttons for alternatives; baseline is Medical exemptions only.
  const exemptionRadio = document.querySelector('input[name="exemption"]:checked');
  let exemptionValue = 0;
  let exemptionText = "Medical exemptions only";
  if (exemptionRadio) {
    if (exemptionRadio.value === "medRel") {
      exemptionValue = 1;
      exemptionText = "Medical and religious exemptions";
    } else if (exemptionRadio.value === "all") {
      exemptionValue = 2;
      exemptionText = "Medical, religious, and broad personal belief exemptions";
    }
  }
  
  // Calculate utility as sum of coefficients for alternatives if selected
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
  
  // Logistic transformation for uptake probability
  const uptakeProb = 1 / (1 + Math.exp(-utility));
  const uptakePercentage = uptakeProb * 100;
  // Base participants per country = 2000
  const participants = Math.round(uptakeProb * 2000);
  
  return {
    country,
    scope: scopeText,
    threshold: thresholdText,
    coverage: coverageText,
    incentive: incentiveText,
    exemption: exemptionText,
    utility,
    uptakePercentage: uptakePercentage.toFixed(2),
    participants
  };
}

/** Calculate and display scenario results */
function calculateScenario() {
  const scenario = buildScenarioFromInputs();
  const resultHTML = `<h4>Scenario Results</h4>
    <p><strong>Country:</strong> ${scenario.country}</p>
    <p><strong>Scope:</strong> ${scenario.scope}</p>
    <p><strong>Infection Threshold:</strong> ${scenario.threshold}</p>
    <p><strong>Vaccine Coverage Requirement:</strong> ${scenario.coverage}</p>
    <p><strong>Incentives:</strong> ${scenario.incentive}</p>
    <p><strong>Exemption Policy:</strong> ${scenario.exemption}</p>
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

/** Render MRS Chart */
let mrsChartInstance = null;
function renderMRSChart() {
  const ctx = document.getElementById("mrsChart").getContext("2d");
  if (mrsChartInstance) mrsChartInstance.destroy();
  
  // Compute MRS values for Infection Threshold vs Vaccine Coverage:
  const mrsModerate = - (vaxCoefficients.threshold100) / (vaxCoefficients.coverageModerate);
  const mrsSevere = - (vaxCoefficients.threshold200) / (vaxCoefficients.coverageHigh);
  
  const dataConfig = {
    labels: ["MRS (100 cases)", "MRS (200 cases)"],
    datasets: [{
      label: "MRS Value",
      data: [mrsModerate, mrsSevere],
      backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1
    }]
  };
  
  mrsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: dataConfig,
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Marginal Rate of Substitution", font: { size: 16 } },
        tooltip: {
          callbacks: {
            label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`
          }
        }
      }
    }
  });
  
  document.getElementById("mrsInfo").innerHTML = `<p><strong>Interpretation:</strong> To offset the disutility of moving from the benchmark threshold (50 cases/100k) to 100 cases/100k, a change in vaccine coverage equivalent to an MRS of ${mrsModerate.toFixed(2)} is needed. For a shift to 200 cases/100k, the required trade-off is ${mrsSevere.toFixed(2)}.</p>`;
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
        title: {
          display: true,
          text: `Predicted Uptake: ${uptakeVal.toFixed(1)}%`,
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: context => `${context.label}: ${context.parsed.toFixed(1)}%`
          }
        }
      }
    }
  });
}

/** Render Costs & Benefits Analysis */
let combinedChartInstance = null;
function renderCostsBenefits() {
  const scenario = buildScenarioFromInputs();
  // Define cost components (USD)
  const fixedCost = 200000; // fixed administration, enforcement, and communication cost
  const variableCostPerPerson = 50; // per compliant individual
  const totalCost = fixedCost + (variableCostPerPerson * scenario.participants);
  // Benefits: e.g., reduced healthcare costs per participant
  const benefitPerParticipant = 500; // USD
  const totalBenefit = benefitPerParticipant * scenario.participants;
  const netBenefit = totalBenefit - totalCost;
  
  const costsTab = document.getElementById("costsBenefitsResults");
  costsTab.innerHTML = `
    <h4>Cost Components</h4>
    <ul>
      <li><strong>Fixed Cost:</strong> $${fixedCost.toFixed(2)} (administration, enforcement, communication)</li>
      <li><strong>Variable Cost per Participant:</strong> $${variableCostPerPerson.toFixed(2)}</li>
      <li><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</li>
    </ul>
    <h4>Benefits</h4>
    <ul>
      <li><strong>Benefit per Participant:</strong> $${benefitPerParticipant.toFixed(2)} (e.g., reduced healthcare expenses)</li>
      <li><strong>Total Benefit:</strong> $${totalBenefit.toFixed(2)}</li>
    </ul>
    <h4>Net Benefit</h4>
    <p>$${netBenefit.toFixed(2)}</p>
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
      labels: ["Total Cost", "Total Benefit", "Net Benefit"],
      datasets: [{
        label: "USD",
        data: [totalCost, totalBenefit, netBenefit],
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
        title: { display: true, text: "Cost-Benefit Analysis", font: { size: 16 } }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(totalCost, totalBenefit, Math.abs(netBenefit)) * 1.2
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
  const props = ["name", "country", "scope", "threshold", "coverage", "incentive", "exemption", "uptakePercentage", "participants"];
  props.forEach(prop => {
    const cell = document.createElement("td");
    cell.textContent = scenario[prop];
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
    doc.text(`Participants: ${scenario.participants}`, 15, currentY); currentY += 10;
  });
  doc.save("Scenarios_Comparison.pdf");
}
