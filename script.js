/*
 * Logic for the food decision website.
 * This script handles reading user input, performing fair selections
 * (either purely random or using a random serial dictatorship), and
 * updating the page with results. The algorithm ensures that each
 * participant's suggestions have equal probability of being chosen when
 * the random method is selected. When the serial method is used, a
 * random order is chosen and the first participant in that order
 * decides the cuisine while the other decides the restaurant.
 */

// Variables to remember the outcome of the cuisine stage
let cuisineMethodSelected = 'random';
let cuisinePickedBy = null; // 'user1' or 'user2'
let userNames = { user1: 'Participant 1', user2: 'Participant 2' };
let chosenCuisine = '';

// Utility to parse a comma separated string into an array of trimmed values
function parseList(str) {
  return str
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

// Utility to pick a random element from an array
function pickRandom(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// Event listener for cuisine decision
document.getElementById('decideCuisine').addEventListener('click', () => {
  // Read names and suggestions
  const name1 = document.getElementById('user1Name').value.trim();
  const name2 = document.getElementById('user2Name').value.trim();
  userNames.user1 = name1 || 'Participant 1';
  userNames.user2 = name2 || 'Participant 2';

  const cuisines1 = parseList(
    document.getElementById('user1Cuisines').value.trim()
  );
  const cuisines2 = parseList(
    document.getElementById('user2Cuisines').value.trim()
  );

  // Validate input
  if (cuisines1.length === 0 && cuisines2.length === 0) {
    document.getElementById('cuisineResult').innerHTML =
      '<span class="error">Please enter at least one cuisine.</span>';
    return;
  }

  // Determine selected method
  const method = document.querySelector(
    "input[name='cuisineMethod']:checked"
  ).value;
  cuisineMethodSelected = method;

  let resultText = '';
  let selectorName = '';

  if (method === 'random') {
    // Combine lists and pick randomly
    const allCuisines = [...cuisines1, ...cuisines2];
    chosenCuisine = pickRandom(allCuisines);
    resultText =
      'A fair random draw selected <strong>' +
      chosenCuisine +
      '</strong> for tonight.';
    cuisinePickedBy = null;
  } else if (method === 'serial') {
    // Randomly choose which participant decides
    const order = Math.random() < 0.5 ? 'user1' : 'user2';
    cuisinePickedBy = order;
    selectorName = userNames[order];
    // Determine which list to draw from
    const list = order === 'user1' ? cuisines1 : cuisines2;
    if (list.length === 0) {
      // If the chosen participant has no cuisines, fall back to the other
      const altList = order === 'user1' ? cuisines2 : cuisines1;
      chosenCuisine = pickRandom(altList);
      resultText =
        selectorName +
        " had no cuisine suggestions, so we randomly selected from the other participant's list: <strong>" +
        chosenCuisine +
        '</strong>.';
    } else {
      chosenCuisine = pickRandom(list);
      resultText =
        selectorName +
        ' was randomly chosen to decide the cuisine and selected <strong>' +
        chosenCuisine +
        '</strong>.';
    }
  }

  document.getElementById('cuisineResult').innerHTML = resultText;

  // Update restaurant section labels and instructions
  document.getElementById('restaurantUser1Label').textContent = userNames.user1;
  document.getElementById('restaurantUser2Label').textContent = userNames.user2;

  document.getElementById('chosenCuisineDisplay').innerHTML =
    'Cuisine chosen: <strong>' + chosenCuisine + '</strong>.';

  // Show restaurant section
  document.getElementById('restaurant-section').style.display = 'block';
});

// Event listener for restaurant decision
document.getElementById('decideRestaurant').addEventListener('click', () => {
  const restaurants1 = parseList(
    document.getElementById('user1Restaurants').value.trim()
  );
  const restaurants2 = parseList(
    document.getElementById('user2Restaurants').value.trim()
  );

  if (restaurants1.length === 0 && restaurants2.length === 0) {
    document.getElementById('restaurantResult').innerHTML =
      '<span class="error">Please enter at least one restaurant.</span>';
    return;
  }

  const method = document.querySelector(
    "input[name='restaurantMethod']:checked"
  ).value;
  let finalRestaurant = '';
  let resultText = '';

  if (method === 'random') {
    // Combine and pick randomly
    const allRestaurants = [...restaurants1, ...restaurants2];
    finalRestaurant = pickRandom(allRestaurants);
    resultText =
      'A fair random draw selected <strong>' +
      finalRestaurant +
      '</strong>.';
  } else if (method === 'serial') {
    // Determine who should decide: if cuisine stage used serial, the other participant decides;
    // otherwise randomly assign.
    let decider;
    if (cuisineMethodSelected === 'serial' && cuisinePickedBy) {
      decider = cuisinePickedBy === 'user1' ? 'user2' : 'user1';
    } else {
      decider = Math.random() < 0.5 ? 'user1' : 'user2';
    }
    const deciderName = userNames[decider];
    const list = decider === 'user1' ? restaurants1 : restaurants2;
    if (list.length === 0) {
      // If decider has no options, fall back to the other
      const altList = decider === 'user1' ? restaurants2 : restaurants1;
      finalRestaurant = pickRandom(altList);
      resultText =
        deciderName +
        ' had no restaurant suggestions, so we randomly selected from the other participant\'s list: <strong>' +
        finalRestaurant +
        '</strong>.';
    } else {
      finalRestaurant = pickRandom(list);
      resultText =
        deciderName +
        ' was randomly chosen to decide the restaurant and selected <strong>' +
        finalRestaurant +
        '</strong>.';
    }
  }

  document.getElementById('restaurantResult').innerHTML = resultText;
});