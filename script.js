// script.js

const choiceTasks = [
  {
    id: 1,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '50 cases per 100,000 people with a 10% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '50% vaccine coverage',
          'Incentives for Vaccination': 'Paid time off for vaccination (1-3 days)',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 100
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '100 cases per 100,000 people with a 15% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'Government subsidy or discounts on government services',
          'Exemption Policy': 'Medical and religious exemptions',
          'Financial Incentive Amount': 200
        }
      }
    ]
  },
  {
    id: 2,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '100 cases per 100,000 people with a 15% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '70% vaccine coverage',
          'Incentives for Vaccination': 'Paid time off for vaccination (1-3 days)',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 150
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '200 cases per 100,000 people with a 20% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'None (No specific benefits or incentives)',
          'Exemption Policy': 'Medical, religious exemptions, and broad personal belief',
          'Financial Incentive Amount': 0
        }
      }
    ]
  },
  // Add additional choice tasks up to 8
  {
    id: 3,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '200 cases per 100,000 people with a 20% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'Government subsidy or discounts on government services',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 250
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '50 cases per 100,000 people with a 10% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '50% vaccine coverage',
          'Incentives for Vaccination': 'Paid time off for vaccination (1-3 days)',
          'Exemption Policy': 'Medical and religious exemptions',
          'Financial Incentive Amount': 100
        }
      }
    ]
  },
  {
    id: 4,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '100 cases per 100,000 people with a 15% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '70% vaccine coverage',
          'Incentives for Vaccination': 'None (No specific benefits or incentives)',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 0
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '200 cases per 100,000 people with a 20% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'Government subsidy or discounts on government services',
          'Exemption Policy': 'Medical, religious exemptions, and broad personal belief',
          'Financial Incentive Amount': 300
        }
      }
    ]
  },
  {
    id: 5,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '50 cases per 100,000 people with a 10% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '50% vaccine coverage',
          'Incentives for Vaccination': 'Paid time off for vaccination (1-3 days)',
          'Exemption Policy': 'Medical and religious exemptions',
          'Financial Incentive Amount': 150
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '100 cases per 100,000 people with a 15% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'None (No specific benefits or incentives)',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 0
        }
      }
    ]
  },
  {
    id: 6,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '50 cases per 100,000 people with a 10% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '70% vaccine coverage',
          'Incentives for Vaccination': 'Government subsidy or discounts on government services',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 200
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '200 cases per 100,000 people with a 20% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'Paid time off for vaccination (1-3 days)',
          'Exemption Policy': 'Medical, religious exemptions, and broad personal belief',
          'Financial Incentive Amount': 300
        }
      }
    ]
  },
  {
    id: 7,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '100 cases per 100,000 people with a 15% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '50% vaccine coverage',
          'Incentives for Vaccination': 'Government subsidy or discounts on government services',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 250
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '200 cases per 100,000 people with a 20% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'None (No specific benefits or incentives)',
          'Exemption Policy': 'Medical, religious exemptions, and broad personal belief',
          'Financial Incentive Amount': 0
        }
      }
    ]
  },
  {
    id: 8,
    scenarios: [
      {
        label: 'A',
        attributes: {
          'Scope of Mandate': 'All occupations and public spaces',
          'Infection Threshold for Mandate Activation': '200 cases per 100,000 people with a 20% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '70% vaccine coverage',
          'Incentives for Vaccination': 'Paid time off for vaccination (1-3 days)',
          'Exemption Policy': 'Medical exemptions only',
          'Financial Incentive Amount': 100
        }
      },
      {
        label: 'B',
        attributes: {
          'Scope of Mandate': 'High-risk occupations only',
          'Infection Threshold for Mandate Activation': '50 cases per 100,000 people with a 10% weekly increase',
          'Vaccine Coverage Requirement for Lifting Mandates': '90% vaccine coverage',
          'Incentives for Vaccination': 'Government subsidy or discounts on government services',
          'Exemption Policy': 'Medical and religious exemptions',
          'Financial Incentive Amount': 200
        }
      }
    ]
  }
];

let currentTask = 0;
const totalTasks = choiceTasks.length;
const userResponses = [];

function loadTask(taskIndex) {
  const form = document.getElementById('dceForm');
  form.innerHTML = ''; // Clear previous content

  const task = choiceTasks[taskIndex];
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('choice-task', 'active');

  const question = document.createElement('p');
  question.textContent = `**Choice Task ${task.id}:** Please compare the two vaccine mandates (A and B) and choose the one you prefer.`;
  taskDiv.appendChild(question);

  task.scenarios.forEach(scenario => {
    const scenarioDiv = document.createElement('div');
    scenarioDiv.classList.add('scenario');

    const label = document.createElement('h3');
    label.textContent = `Vaccine Mandate ${scenario.label}`;
    scenarioDiv.appendChild(label);

    for (const [attr, value] of Object.entries(scenario.attributes)) {
      const attrP = document.createElement('p');
      attrP.innerHTML = `<strong>${attr}:</strong> ${value}`;
      scenarioDiv.appendChild(attrP);
    }

    taskDiv.appendChild(scenarioDiv);
  });

  // Add radio buttons for selection
  const selectionDiv = document.createElement('div');
  selectionDiv.classList.add('selection');

  const optionA = document.createElement('label');
  optionA.innerHTML = `<input type="radio" name="choice${task.id}" value="A" required> I prefer Vaccine Mandate A`;
  selectionDiv.appendChild(optionA);

  const optionB = document.createElement('label');
  optionB.innerHTML = `<input type="radio" name="choice${task.id}" value="B"> I prefer Vaccine Mandate B`;
  selectionDiv.appendChild(optionB);

  // Optional: Option to choose neither
  const optionNone = document.createElement('label');
  optionNone.innerHTML = `<input type="radio" name="choice${task.id}" value="None"> I prefer not to choose any of these vaccine mandates`;
  selectionDiv.appendChild(optionNone);

  // Optional follow-up question
  const followUp = document.createElement('div');
  followUp.classList.add('follow-up');
  followUp.style.display = 'none';

  const followUpQuestion = document.createElement('p');
  followUpQuestion.textContent = 'If you have the option not to choose any of these vaccine mandates, will your choice remain the same?';
  followUp.appendChild(followUpQuestion);

  const followUpYes = document.createElement('label');
  followUpYes.innerHTML = `<input type="radio" name="followup${task.id}" value="Yes"> Yes, my choice will remain the same.`;
  followUp.appendChild(followUpYes);

  const followUpNo = document.createElement('label');
  followUpNo.innerHTML = `<input type="radio" name="followup${task.id}" value="No"> No, my choice will change, now I prefer not to choose any of these vaccine mandates.`;
  followUp.appendChild(followUpNo);

  selectionDiv.appendChild(followUp);
  taskDiv.appendChild(selectionDiv);

  // Add event listener to show follow-up if 'None' is selected
  selectionDiv.addEventListener('change', function(e) {
    if (e.target.value === 'None') {
      followUp.style.display = 'block';
      // Make follow-up questions required
      followUp.querySelectorAll('input').forEach(input => input.required = true);
    } else {
      followUp.style.display = 'none';
      followUp.querySelectorAll('input').forEach(input => input.required = false);
    }
  });

  form.appendChild(taskDiv);

  // Update navigation buttons
  document.getElementById('prevBtn').style.display = taskIndex === 0 ? 'none' : 'inline-block';
  document.getElementById('nextBtn').style.display = taskIndex === totalTasks -1 ? 'none' : 'inline-block';
  document.getElementById('submitBtn').style.display = taskIndex === totalTasks -1 ? 'inline-block' : 'none';
}

function nextTask() {
  const form = document.getElementById('dceForm');
  const task = choiceTasks[currentTask];
  const choice = form.querySelector(`input[name="choice${task.id}"]:checked`);
  const followup = form.querySelector(`input[name="followup${task.id}"]:checked`);

  if (!choice) {
    alert('Please make a selection before proceeding.');
    return;
  }

  if (choice.value === 'None' && !followup) {
    alert('Please answer the follow-up question.');
    return;
  }

  // Save response
  userResponses[currentTask] = {
    task: task.id,
    choice: choice.value,
    followup: choice.value === 'None' ? followup.value : null
  };

  if (currentTask < totalTasks -1) {
    currentTask++;
    loadTask(currentTask);
  }
}

function prevTask() {
  if (currentTask > 0) {
    currentTask--;
    loadTask(currentTask);
  }
}

function submitSurvey() {
  const form = document.getElementById('dceForm');
  const task = choiceTasks[currentTask];
  const choice = form.querySelector(`input[name="choice${task.id}"]:checked`);
  const followup = form.querySelector(`input[name="followup${task.id}"]:checked`);

  if (!choice) {
    alert('Please make a selection before submitting.');
    return;
  }

  if (choice.value === 'None' && !followup) {
    alert('Please answer the follow-up question.');
    return;
  }

  // Save response
  userResponses[currentTask] = {
    task: task.id,
    choice: choice.value,
    followup: choice.value === 'None' ? followup.value : null
  };

  // For demonstration, log responses to console
  console.log('User Responses:', userResponses);

  // Hide survey and show thank you message
  document.getElementById('survey').style.display = 'none';
  document.getElementById('thankyou').style.display = 'block';
}

window.onload = function() {
  loadTask(currentTask);
};
