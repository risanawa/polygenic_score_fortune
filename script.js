document.addEventListener('DOMContentLoaded', () => {
    // 1. GWAS DATA from Cornelis et al., 2015, Molecular Psychiatry (Table 1)
    // Descriptions synthesized from PMID: 38898144
    const gwasSummaryStats = {
        "rs2472297": {
            "effect": 0.14,
            "trait": "Caffeine Metabolism (near CYP1A2). This gene codes for the primary enzyme that breaks down caffeine."
        },
        "rs4410790": {
            "effect": -0.10,
            "trait": "Metabolism Regulation (near AHR). This gene helps regulate the activity of metabolism enzymes like CYP1A2."
        },
        "rs1260326": {
            "effect": -0.04,
            "trait": "Caffeine Reward (in GCKR). Linked to glucose/lipid metabolism and may influence caffeine's rewarding effects."
        },
        "rs5751876": {
            "effect": -0.05,
            "trait": "Caffeine Sensitivity (in ADORA2A). Codes for the adenosine receptor that caffeine blocks; linked to anxiety effects."
        }
    };

    // 2. GET REFERENCES TO HTML ELEMENTS
    const snpInputsContainer = document.getElementById('snpInputsContainer');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    const calculationStepsList = document.getElementById('calculationStepsList');
    const pgsCalculationDisplay = document.getElementById('pgsCalculation');
    const finalPGSSpan = document.getElementById('finalPGS');
    const interpretationMessageP = document.getElementById('interpretationMessage');
    const resetBtn = document.getElementById('resetBtn');

    // 3. DYNAMICALLY CREATE SNP INPUTS
    function createInputs() {
        snpInputsContainer.innerHTML = ''; // Clear existing inputs
        for (const snp in gwasSummaryStats) {
            const data = gwasSummaryStats[snp];
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';

            const label = document.createElement('label');
            label.setAttribute('for', `snp-${snp}`);
            label.innerHTML = `<strong>${snp}</strong> <span class="trait-desc">(${data.trait})</span>`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `snp-${snp}`;
            input.min = '0';
            input.max = '2';
            input.value = '0'; // Default value

            inputGroup.appendChild(label);
            inputGroup.appendChild(input);
            snpInputsContainer.appendChild(inputGroup);
        }
    }
    
    // 4. EVENT LISTENERS
    calculateBtn.addEventListener('click', calculateScore);
    resetBtn.addEventListener('click', resetCalculator);

    // 5. FUNCTIONS
    function calculateScore() {
        let polygenicScore = 0;
        const calculationSteps = [];
        calculationStepsList.innerHTML = ''; 

        for (const snp in gwasSummaryStats) {
            const inputElement = document.getElementById(`snp-${snp}`);
            const genotype = parseInt(inputElement.value);

            // Basic validation
            if (isNaN(genotype) || genotype < 0 || genotype > 2) {
                alert(`Please enter a valid number of alleles (0, 1, or 2) for ${snp}.`);
                return;
            }

            const effect = gwasSummaryStats[snp].effect;
            const contribution = genotype * effect;
            polygenicScore += contribution;

            // Add to calculation breakdown list
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${snp}:</strong> ${genotype} allele(s) &times; ${effect.toFixed(2)} effect = <strong>${contribution.toFixed(2)}</strong>`;
            calculationStepsList.appendChild(listItem);
            
            // For the full formula display
            calculationSteps.push(`(${genotype} &times; ${effect.toFixed(2)})`);
        }

        // Display results
        calculateBtn.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        resetBtn.classList.remove('hidden');

        pgsCalculationDisplay.textContent = `PGS = ${calculationSteps.join(' + ')}`;
        finalPGSSpan.textContent = polygenicScore.toFixed(3);
        
        // Determine and display interpretation message
        let interpretationText = "";
        if (polygenicScore < 0.0) {
            interpretationText = "This negative score suggests a genetic predisposition toward lower coffee consumption. This could be influenced by variants linked to slower metabolism or higher sensitivity.";
        } else if (polygenicScore < 0.20) {
            interpretationText = "This score is in a lower-to-typical range, consistent with a genetic predisposition for average or slightly below-average coffee consumption.";
        } else {
            interpretationText = "This score is on the higher end, suggesting a genetic predisposition toward higher coffee consumption, likely driven by the `rs2472297` variant associated with faster metabolism.";
        }
        interpretationMessageP.textContent = interpretationText;
    }

    function resetCalculator() {
        resultsDiv.classList.add('hidden');
        calculateBtn.classList.remove('hidden');
        resetBtn.classList.add('hidden');
        
        // Reset all input fields to 0
        const inputs = snpInputsContainer.querySelectorAll('input');
        inputs.forEach(input => input.value = '0');

        // Clear results display
        calculationStepsList.innerHTML = ''; 
        pgsCalculationDisplay.textContent = '';
        finalPGSSpan.textContent = '';
        interpretationMessageP.textContent = '';
    }

    // Initial setup
    createInputs();
});


