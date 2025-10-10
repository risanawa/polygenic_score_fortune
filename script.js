// --- 1. FAKE GWAS DATA ---
// Same data as in the Python script, now in a JavaScript object
const gwasSummaryStats = {
    "rs671": { "effect": 0.35, "trait": "coffee craving" },
    "rs122910": { "effect": 0.21, "trait": "caffeine metabolism" },
    "rs4410790": { "effect": 0.15, "trait": "daytime sleepiness" },
    "rs2472297": { "effect": 0.45, "trait": "positive caffeine buzz" }
};

// --- 2. GET REFERENCES TO HTML ELEMENTS ---
const revealFortuneBtn = document.getElementById('revealFortuneBtn');
const resultsDiv = document.getElementById('results');
const genotypeList = document.getElementById('genotypeList');
const pgsCalculationDisplay = document.getElementById('pgsCalculation');
const finalPGSSpan = document.getElementById('finalPGS');
const fortuneMessageP = document.getElementById('fortuneMessage');
const resetBtn = document.getElementById('resetBtn');

// --- 3. EVENT LISTENERS ---
revealFortuneBtn.addEventListener('click', calculateFortune);
resetBtn.addEventListener('click', resetFortune);

// --- 4. FUNCTIONS ---

function calculateFortune() {
    // Hide the reveal button and show results container
    revealFortuneBtn.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    
    // Clear previous results if any
    genotypeList.innerHTML = ''; 
    pgsCalculationDisplay.textContent = '';
    finalPGSSpan.textContent = '';
    fortuneMessageP.textContent = '';
    resetBtn.classList.add('hidden'); // Hide reset button until calculation is done

    let polygenicScore = 0;
    const calculationSteps = [];
    const yourGenotypes = {}; // Store generated genotypes for display

    // Simulate a loading delay
    resultsDiv.querySelector('p').textContent = "Analyzing your ancient genetic code...";
    setTimeout(() => {
        resultsDiv.querySelector('p').textContent = "Generating your unique genetic profile...";
        
        setTimeout(() => {
            // Generate genotypes and calculate score
            for (const snp in gwasSummaryStats) {
                // Randomly assign 0, 1, or 2 risk alleles
                const genotype = Math.floor(Math.random() * 3); 
                yourGenotypes[snp] = genotype; // Store for display
                
                const effect = gwasSummaryStats[snp].effect;
                const contribution = genotype * effect;
                polygenicScore += contribution;
                
                // Add to calculation steps for display
                calculationSteps.push(`(${genotype} alleles for ${snp} * ${effect.toFixed(2)} effect)`);
                
                // Add to genotype list for display
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${snp}</strong> (${gwasSummaryStats[snp].trait}): ${genotype} risk allele(s) &times; ${effect.toFixed(2)} effect = ${contribution.toFixed(2)}`;
                genotypeList.appendChild(listItem);
            }

            // Display full calculation formula
            pgsCalculationDisplay.textContent = `PGS = ${calculationSteps.join(' + ')}`;
            
            // Display final score
            finalPGSSpan.textContent = polygenicScore.toFixed(2);
            
            // Determine and display fortune message
            let fortuneText = "";
            if (polygenicScore < 1.0) {
                fortuneText = "'Decaf, please.' You are genetically predisposed to enjoy coffee sparingly.";
            } else if (polygenicScore < 2.0) {
                fortuneText = "'A cup a day keeps the yawns away.' You likely enjoy a regular, balanced coffee routine.";
            } else {
                fortuneText = "'An IV of espresso!' You likely keep baristas very, very busy.";
            }
            fortuneMessageP.textContent = fortuneText;

            // Show reset button
            resetBtn.classList.remove('hidden');
            resultsDiv.querySelector('p').textContent = ""; // Clear loading message
            
        }, 3000); // Simulate processing time for calculation
    }, 2000); // Simulate initial genetic loading time
}

function resetFortune() {
    resultsDiv.classList.add('hidden'); // Hide results
    revealFortuneBtn.classList.remove('hidden'); // Show "Reveal" button
    genotypeList.innerHTML = ''; 
    pgsCalculationDisplay.textContent = '';
    finalPGSSpan.textContent = '';
    fortuneMessageP.textContent = '';
    resetBtn.classList.add('hidden');
    resultsDiv.querySelector('p').textContent = ""; // Clear any lingering text
}