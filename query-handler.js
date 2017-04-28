'use strict';

const foodStore = ['tuna', 'bacon', 'beef', 'chicken', 'ham'];

function handleQuery(reqQuery, res) {
    let resultPhrase;
    let reqFood = reqQuery.food;
        
    if (reqFood === '') {
        resultPhrase = 'Enter a food, you fool)';
    } else {
        // resultPhrase = foodStore.find((item) => item === reqFood)
        resultPhrase = (foodStore.indexOf(reqFood) !== -1)
            ? `We have ${reqFood}!`
            : `Sorry dude we don\'t sell no ${reqFood}!`;
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    res.end(JSON.stringify({ answer: resultPhrase }), () => {
        console.log(`foodstore JSON with ${resultPhrase} was sent`);
    });
    return resultPhrase;
}

exports.handle = handleQuery;