// script.js

// Example uptake prediction based on coefficients
// Utility function: U = β1*Scope_All + β2*Threshold_100 + β3*Threshold_200 + β4*Coverage_Moderate + β5*Coverage_High + β6*Incentive_Paid + β7*Incentive_GovSub + β8*Exemption_MedRel + β9*Exemption_All + β10*Financial_Incentive
// For simplicity, assume utility translates directly to uptake probability via softmax

// Define scenarios with attribute levels
const scenarios = [
  {
    name: 'Scenario 1: Comprehensive Mandate with No Incentives',
    attributes: {
      Scope_All: 1,
      Threshold_100: 0,
      Threshold_200: 0,
      Coverage_Moderate: 0,
      Coverage_High: 0,
      Incentive_Paid: 0,
      Incentive_GovSub: 0,
      Exemption_MedRel: 0,
      Exemption_All: 0,
      Financial_Incentive: 0
    }
  },
  {
    name: 'Scenario 2: Public Space Mandate with Moderate Financial Incentives',
    attributes: {
      Scope_All: 1,
      Threshold_100: 1,
      Threshold_200: 0,
      Coverage_Moderate: 0,
      Coverage_High: 0,
      Incentive_Paid: 0,
      Incentive_GovSub: 1,
      Exemption_MedRel: 0,
      Exemption_All: 0,
      Financial_Incentive: 200
    }
  },
  {
    name: 'Scenario 3: Employment Mandate with High Financial Incentives and Religious Exemptions',
    attributes: {
      Scope_All: 0,
      Threshold_100: 0,
      Threshold_200: 1,
      Coverage_Moderate: 0,
      Coverage_High: 1,
      Incentive_Paid: 1,
      Incentive_GovSub: 0,
      Exemption_MedRel: 1,
      Exemption_All: 0,
      Financial_Incentive: 300
    }
  },
  {
    name: 'Scenario 4: Flexible Mandate with Access Incentives and Variable Financial Incentives',
    attributes: {
      Scope_All: 1,
      Threshold_100: 0,
      Threshold_200: 1,
      Coverage_Moderate: 1,
      Coverage_High: 0,
      Incentive_Paid: 0,
      Incentive_GovSub: 1,
      Exemption_MedRel: 0,
      Exemption_All: 1,
      Financial_Incentive: 250
    }
  }
];

// Coefficients
const coefficients = {
  Scope_All: 0.5,
  Threshold_100: -0.3,
  Threshold_200: -0.7,
  Coverage_Moderate: 0.4,
  Coverage_High: 0.8,
  Incentive_Paid: 0.6,
  Incentive_GovSub: 0.7,
  Exemption_MedRel: 0.3,
  Exemption_All: 0.5,
  Financial_Incentive: 0.001
};

// Calculate utility for each scenario
scenarios.forEach(scenario => {
  let utility = 0;
  for (const [attr, value] of Object.entries(scenario.attributes)) {
    utility += coefficients[attr] * value;
  }
  scenario.utility = utility;
});

// Softmax function to convert utilities to probabilities
function softmax(scenarios) {
  const expUtilities = scenarios.map(s => Math.exp(s.utility));
  const sumExp = expUtilities.reduce((a, b) => a + b, 0);
  return scenarios.map((s, i) => ({
    name: s.name,
    uptake: (expUtilities[i] / sumExp) * 100
  }));
}

const uptakeData = softmax(scenarios);

// Create uptake chart
window.onload = function() {
  const ctxUptake = document.getElementById('uptakeChart').getContext('2d');
  const uptakeChart = new Chart(ctxUptake, {
    type: 'bar',
    data: {
      labels: uptakeData.map(s => s.name),
      datasets: [{
        label: 'Predicted Uptake (%)',
        data: uptakeData.map(s => s.uptake.toFixed(2)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}%`;
            }
          }
        }
      }
    }
  });

  // Create MRS Chart
  const ctxMRS = document.getElementById('mrsChart').getContext('2d');
  const mrsChart = new Chart(ctxMRS, {
    type: 'bar',
    data: {
      labels: ['Sanctions vs. Financial Incentives'],
      datasets: [{
        label: 'Coefficient (\(\beta\))',
        data: [0.8, 0.5],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.x}`;
            }
          }
        }
      }
    }
  });

  // Calculate and display MRS
  const mrs = -coefficients['Sanctions'] / coefficients['Financial_Incentive'];
  document.getElementById('mrsChart').insertAdjacentHTML('afterend', `<p><strong>Calculated MRS:</strong> ${mrs.toFixed(2)}</p>`);
};
