

const units = {
    'time': {
        'second': {
            factor: 1,
            plural: 'seconds',
            unit: 's'
        },
        'minute': {
            factor: 60,
            plural: 'minutes',
            unit: 'm'
        },
        'hour': {
            factor: 3600,
            plural: 'hours',
            unit: 'h'
        },
        'day': {
            factor: 86400,
            plural: 'days',
            unit: 'd'
        }
    },
    'mass': {
        'gram': {
            factor: 1,
            plural: 'grams',
            unit: 'g'
        },
        'kilogram': {
            factor: 1000,
            plural: 'kilograms',
            unit: 'kg'
        },
        'tonne': {
            factor: 1000000,
            plural: 'tonnes',
            unit: 't'
        },
        'milligram': {
            factor: 0.001,
            plural: 'milligrams',
            unit: 'mg'
        },
        'dekagram': {
            factor: 10,
            plural: 'dekagrams',
            unit: 'dkg (dag)'
        }
    },
    'length': {
        'meter': {
            factor: 1,
            plural: 'meters',
            unit: 'm'
        },
        'kilometer': {
            factor: 1000,
            plural: 'kilometers',
            unit: 'km'
        },
        'decimeter': {
            factor: 0.1,
            plural: 'decimeters',
            unit: 'dm'
        },
        'centimeter': {
            factor: 0.01,
            plural: 'centimeters',
            unit: 'cm'
        },
        'millimeter': {
            factor: 0.001,
            plural: 'millimeters',
            unit: 'mm'
        }
    },
    'area': {
        'square meter': {
            factor: 1,
            plural: 'square meters',
            unit: 'm&sup2;'
        },
        'square kilometer': {
            factor: 1000000,
            plural: 'square kilometers',
            unit: 'km&sup2;'
        },
        'hectare': {
            factor: 10000,
            plural: 'hectares',
            unit: 'ha'
        },
        'square decimeter': {
            factor: 0.01,
            plural: 'square decimeters',
            unit: 'dm&sup2;'
        },
        'square centimeter': {
            factor: 0.0001,
            plural: 'square centimeters',
            unit: 'cm&sup2;'
        }
    },
    'volume': {
        'liter': {
            factor: 1,
            plural: 'liters',
            unit: 'l'
        },
        'cubic meter': {
            factor: 1000,
            plural: 'cubic meters',
            unit: 'm&sup3;'
        },
        'milliliter': {
            factor: 0.001,
            plural: 'milliliters',
            unit: 'ml'
        },
        'cubic centimeter': {
            factor: 0.001,
            plural: 'cubic centimeters',
            unit: 'cm&sup3;'
        },
        'cubic decimeter': {
            factor: 1,
            plural: 'cubic decimeters',
            unit: 'dm&sup3;'
        }
    }
}

var unitTypeUsage = {}; 

// usage of the unit types in a dictionary with the unit type as key and the usage as value
function initUnitTypeUsage() {
    Object.keys(units).map(unitType => {
        unitTypeUsage[unitType] = 0;
    });
}

function getMathExamUnitBase(unitType) {
    const unitList = units[unitType];
    const unitCount = Object.keys(unitList).length;

    // select two units from the unit type
    const unitIndex1 = Math.floor(Math.random() * unitCount);
    var unitIndex2 = unitIndex1;
    while (unitIndex2 === unitIndex1) {
        unitIndex2 = Math.floor(Math.random() * unitCount);
    }

    var unit1 = unitList[Object.keys(unitList)[unitIndex1]];
    var unit2 = unitList[Object.keys(unitList)[unitIndex2]];

    // get random operator addition or subtraction
    var operator = Math.random() < 0.5 ? '+' : '-';

    // get random number
    var number1 = Math.floor(Math.random() * 100);
    var number2 = Math.floor(Math.random() * 100);

    // get the factor of the units
    var factor1 = unit1.factor;
    var factor2 = unit2.factor;

    // calculate the result
    var result = operator === '+' ?
        number1 * factor1 + number2 * factor2 :
        number1 * factor1 - number2 * factor2;

    // select the unit that fits the result well
    var unitSelection = Object.values(unitList).filter(unit => {
        /* Math.abs( Math.round(0.5 / 1) - 0.5 / 1) < 0.00000001 */
        return Math.abs(Math.round(result / unit.factor) - result / unit.factor) < 0.00000001;
    });

    // select the one with largest factor
    // sort the unitSelection by factor
    unitSelection.sort((a, b) => b.factor - a.factor);

    // select the first one
    var unit = unitSelection.length > 0 ? unitSelection[0] : unit1;

    // calculate the result in the selected unit
    answer = result / unit.factor;

    // return the question and answer
    const question = `${number1} ${unit1.unit} ${operator} ${number2} ${unit2.unit} = ? ${unit.unit}`;

    return {
        question: question,
        solution: '',
        answer: answer,
        number1: number1,
        unit1: unit1,
        number2: number2,
        unit2: unit2,
        operator: operator,
        result: result,
        unit: unit,
        answerValue: answer,
        score: 0
    };
}

function getMathExamUnit(
    difficulty = 10
) {


    var score = 100;


    // average and stddev of the generated count of the units
    const usageCounts = Object.values(unitTypeUsage);
    const avg = usageCounts.reduce((acc, count) => acc + count, 0) / usageCounts.length;
    const stddev = Math.sqrt(usageCounts.reduce((acc, count) => acc + (count - avg) ** 2, 0) / usageCounts.length);

    // get the unit type with acceptable usage at random
    var unitType = null;
    var unitCount = 0;
    do {
        const unitTypeIndex = Math.floor(Math.random() * usageCounts.length);
        // unitList = units[Object.keys(units)[unitTypeIndex]];
        // unitCount = Object.keys(unitList).length;
        unitType = Object.keys(units)[unitTypeIndex];
        usageCount = usageCounts[unitTypeIndex];
        
    } while (usageCount > avg + stddev );
    var exam = null;
    do {
        score = 0;
        exam = getMathExamUnitBase(unitType);

        // calculate the score

        // only two units
        if (exam.unit1.unit === exam.unit2.unit) {
            score -= 1;

            // only one unit
            if (exam.unit1.unit === exam.unit.unit) {
                score -= 1;
            }
        } 

        // if the answer is negative
        if (exam.answer < 0) {
            score += 20;
        }

        // avoid answer with decimal
        const answerStr = exam.answer.toString();
        const parts = answerStr.split('.');
        if (parts.length > 1) {
            score += parts[1].length * 5;
        }

        // avoid long numbers in the exam
        score += exam.number1.toString().length * 1;
        score += exam.number2.toString().length * 1;
        score += exam.answer.toString().length * 2;

        // favor '5' and '10' in the numbers
        score += exam.number1 % 5 !== 0 ? 1 : 0;
        score += exam.number2 % 5 !== 0 ? 1 : 0;
        score += exam.answer % 5 !== 0 ? 1: 0;

        score += exam.number1 === 0 ? 10 : 0;
        score += exam.number2 === 0 ? 10 : 0;
        score += exam.answer === 0 ? 2 : 0;

        score += exam.answer > 100 ? 20 : 0;
    
    } while (score > difficulty);

    exam.score = score;
    const solution = `${exam.number1} ${exam.unit1.unit} ${exam.operator} ${exam.number2} ${exam.unit2.unit} = ${exam.answer} ${exam.unit.unit}`;
    exam.solution = solution;

    unitTypeUsage[unitType]++;

    return exam;
}

function checkMathExamUnit(
    exam,
    answer
) {
    var input = answer.trim();
    // check if the answer contains the unit and remove it
    if (input.includes(exam.unit.unit)) {
        input = input.replace(exam.unit.unit, '').trim();
    }

    try {
        var value = Number(input);
        return Math.abs(value - exam.answer) < 0.000001;
    }
    catch (e) {
        console.log(e);
        return false;
    }

    
}