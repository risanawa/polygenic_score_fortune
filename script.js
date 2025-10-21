// Based on major GWAS meta-analyses (e.g., Coffee and Caffeine Genetics Consortium)
const gwasSummaryStats = {
    "rs2472297": { 
        "effect": 0.14, 
        "trait": "Coffee consumption (cups/day, near CYP1A2 gene)" 
    },
    "rs4410790": { 
        "effect": 0.12, 
        "trait": "Coffee consumption (cups/day, near AHR gene)" 
    },
    "rs1260326": { 
        "effect": 0.08, 
        "trait": "Coffee consumption (cups/day, in GCKR gene)" 
    },
    "rs5751876": { 
        "effect": -0.05, 
        "trait": "Coffee consumption (cups/day, in ADORA2A gene)" 
    }
};

// 2. GET REFERENCES TO HTML ELEMENTS
const revealFortuneBtn = document.getElementById('revealFortuneBtn');
const resultsDiv = document.getElementById('results');
const genotypeList = document.getElementById('genotypeList');
const pgsCalculationDisplay = document.getElementById('pgsCalculation');
const finalPGSSpan = document.getElementById('finalPGS');
const fortuneMessageP = document.getElementById('fortuneMessage');
const resetBtn = document.getElementById('resetBtn');

// 3. EVENT LISTENERS
revealFortuneBtn.addEventListener('click', calculateFortune);
resetBtn.addEventListener('click', resetFortune);

// 4. FUNCTIONS
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
    resultsDiv.querySelector('p').textContent = "Analyzing your genetic code...";
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

            // *** THESE THRESHOLDS ARE UPDATED FOR THE REAL BETAS ***
            if (polygenicScore < 0.20) {
                fortuneText = "'Decaf, please.' Your genetics suggest you're sensitive to caffeine or don't metabolize it quickly. You likely enjoy coffee sparingly.";
            } else if (polygenicScore < 0.40) {
                fortuneText = "'A cup a day keeps the yawns away.' Your genetic profile is typical of a regular, balanced coffee drinker.";
            } else {
                fortuneText = "'An IV of espresso!' Your genetics (fast metabolism, low anxiety) are perfect for keeping baristas very, very busy.";
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