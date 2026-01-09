
function attachZScoreListeners(heightField, weightField, ageField, sexField, zscoreField) {
    const calcZscore = createZScoreCalculator(heightField, weightField, ageField, sexField, zscoreField);
    
    const selectors = `input[name="${heightField}"], input[name="${weightField}"], input[name="${ageField}"], input[name="${sexField}"]`;
    const targetFields = document.querySelectorAll(selectors);
        
    targetFields.forEach((field) => {
        field.addEventListener('input', calcZscore);
        field.addEventListener('change', calcZscore); 
    });
    
    // Radio buttons require different listeners
    const visibleRadios = document.querySelectorAll(`input[name="${sexField}___radio"]`);
    visibleRadios.forEach(radio => {
        radio.addEventListener('click', calcZscore);
        radio.addEventListener('change', calcZscore);
    });
    
    // Initial calculation
    setTimeout(calcZscore, 100);
}


// Export globally
window.attachZScoreListeners = attachZScoreListeners;

// zScoreCalc function factory
function createZScoreCalculator(heightField, weightField, ageField, sexField, zscoreField) {

    return function calcZscore() {
        const height = document.querySelector(`input[name="${heightField}"]`)?.value || '';
        const weight = document.querySelector(`input[name="${weightField}"]`)?.value || '';
        const age = document.querySelector(`input[name="${ageField}"]`)?.value || '';
        const sex = document.querySelector(`input[name="${sexField}"]`)?.value || 
                   document.querySelector(`input[name="${sexField}___radio"]:checked`)?.value || '';

        const zscoreFieldEl = document.querySelector(`input[name="${zscoreField}"]`);

        function round(value, step) {
            step || (step = 1.0)
            var inv = 1.0 / step
            return Math.round(value * inv) / inv
        }
        const correctedHeight = round(Number(height).toFixed(1), 0.1)
        const correctedAge = Number(age)
        const correctedWeight = Number(weight)

        console.log(
            '\nsex: ',
            sex,
            typeof sex,
            '\nage: ',
            correctedAge,
            typeof correctedAge,
            '\nweight: ',
            correctedWeight,
            typeof correctedWeight,
            '\nheight: ',
            correctedHeight,
            typeof correctedHeight
        )
        let zscore_intermediate
        
        if (correctedHeight === 0 || correctedWeight === 0) {
            zscoreFieldEl.value = null
            return
        }

        if (correctedAge < 24) {
            if (sex === '0') {
                if (correctedHeight >= 45 && correctedHeight <= 110) {
                    const s = utwogirls[correctedHeight].s
                    const m = utwogirls[correctedHeight].m
                    const l = utwogirls[correctedHeight].l

                    const zscore = (Math.pow(weight / m, l) - 1) / (l * s)
                    const sd3pos = m * Math.pow(1 + l * s * 3, 1 / l)
                    const sd2pos = m * Math.pow(1 + l * s * 2, 1 / l)
                    const sd3neg = m * Math.pow(1 + l * s * -3, 1 / l)
                    const sd2neg = m * Math.pow(1 + l * s * -2, 1 / l)

                    const sd23pos = sd3pos - sd2pos
                    const sd23neg = sd2neg - sd3neg

                    if (zscore < -3) {
                        const temp = (weight - sd3neg) / sd23neg
                        zscore_intermediate = -3 + temp
                    } else if (zscore > 3) {
                        zscore_intermediate = 3 + (weight - sd23pos) / sd23pos
                    } else {
                        zscore_intermediate = zscore
                    }
                } else {
                    zscore_intermediate = 'Incorrect height for age'
                }
            }
            if (sex === '1') {
                if (correctedHeight >= 45 && correctedHeight <= 110) {
                    const s = utwoboys[correctedHeight].s
                    const m = utwoboys[correctedHeight].m
                    const l = utwoboys[correctedHeight].l

                    const zscore = (Math.pow(weight / m, l) - 1) / (l * s)
                    const sd3pos = m * Math.pow(1 + l * s * 3, 1 / l)
                    const sd2pos = m * Math.pow(1 + l * s * 2, 1 / l)
                    const sd3neg = m * Math.pow(1 + l * s * -3, 1 / l)
                    const sd2neg = m * Math.pow(1 + l * s * -2, 1 / l)

                    const sd23pos = sd3pos - sd2pos
                    const sd23neg = sd2neg - sd3neg

                    if (zscore < -3) {
                        const temp = (weight - sd3neg) / sd23neg
                        zscore_intermediate = -3 + temp
                    } else if (zscore > 3) {
                        zscore_intermediate = 3 + (weight - sd23pos) / sd23pos
                    } else {
                        zscore_intermediate = zscore
                    }
                } else {
                    zscore_intermediate = 'Incorrect height for age'
                }
            }
        } else {
            if (sex === '0') {
                if (correctedHeight >= 65 && correctedHeight <= 120) {
                    const s = otwogirls[correctedHeight].s
                    const m = otwogirls[correctedHeight].m
                    const l = otwogirls[correctedHeight].l

                    const zscore = (Math.pow(weight / m, l) - 1) / (l * s)
                    const sd3pos = m * Math.pow(1 + l * s * 3, 1 / l)
                    const sd2pos = m * Math.pow(1 + l * s * 2, 1 / l)
                    const sd3neg = m * Math.pow(1 + l * s * -3, 1 / l)
                    const sd2neg = m * Math.pow(1 + l * s * -2, 1 / l)


                    const sd23pos = sd3pos - sd2pos
                    const sd23neg = sd2neg - sd3neg

                    if (zscore < -3) {
                        const temp = (weight - sd3neg) / sd23neg
                        zscore_intermediate = -3 + temp
                    } else if (zscore > 3) {
                        zscore_intermediate = 3 + (weight - sd23pos) / sd23pos
                    } else {
                        zscore_intermediate = zscore
                    }
                } else {
                    zscore_intermediate = 'Incorrect height for age'
                }
            }

            if (sex === '1') {
                if (correctedHeight >= 65 && correctedHeight <= 120) {
                    const s = otwoboys[correctedHeight].s
                    const m = otwoboys[correctedHeight].m
                    const l = otwoboys[correctedHeight].l

                    const zscore = (Math.pow(weight / m, l) - 1) / (l * s)
                    const sd3pos = m * Math.pow(1 + l * s * 3, 1 / l)
                    const sd2pos = m * Math.pow(1 + l * s * 2, 1 / l)
                    const sd3neg = m * Math.pow(1 + l * s * -3, 1 / l)
                    const sd2neg = m * Math.pow(1 + l * s * -2, 1 / l)

                    const sd23pos = sd3pos - sd2pos
                    const sd23neg = sd2neg - sd3neg

                    if (zscore < -3) {
                        const temp = (weight - sd3neg) / sd23neg
                        zscore_intermediate = -3 + temp
                    } else if (zscore > 3) {
                        zscore_intermediate = 3 + (weight - sd23pos) / sd23pos
                    } else {
                        zscore_intermediate = zscore
                    }
                } else {
                    zscore_intermediate = 'Incorrect height for age'
                }
            }
        }

        //set zscore
        zscore_final = zscore_intermediate
        console.log(
            'zscore_final: ',
            zscore_final,
            '\nzscore_intermediate: ',
            zscore_intermediate
        )
        if (zscore_final === -Infinity || zscore_final === Infinity) {
            zscoreFieldEl.value = 'Error'
        } else if (typeof zscore_final === 'string') {
            zscoreFieldEl.value = zscore_final
        } else if (zscore_final) {
            zscoreFieldEl.value = zscore_final.toFixed(2)
        } else {
            zscoreFieldEl.value = 'Error'
        }
    }
}

