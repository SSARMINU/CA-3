document.addEventListener('DOMContentLoaded', () => {
    const randomMealContainer = document.getElementById('random-meal');
    const mealInstructionsContainer = document.getElementById('meal-instructions');
    const mealVideoContainer = document.getElementById('meal-video');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchedMealsSection = document.getElementById('searched-meals');
    const mealsContainer = document.getElementById('meals-container');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIngredients = document.getElementById('modal-ingredients');
    const closeModal = document.getElementsByClassName('close')[0];


    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            console.log(meal);
            displayRandomMeal(meal);
        });

    
    function displayRandomMeal(meal) {
        randomMealContainer.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
        `;
        mealInstructionsContainer.innerHTML = `
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
        `;
        if (meal.strYoutube) {
            const videoId = meal.strYoutube.split('v=')[1];
            mealVideoContainer.innerHTML = `
                <h3>Video Instructions</h3>
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        } else {
            mealVideoContainer.innerHTML = '';
        }
        randomMealContainer.addEventListener('click', () => {
            showModal(meal);
        });
    }

    
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
                .then(response => response.json())
                .then(data => {
                    if (data.meals) {
                        displaySearchedMeals(data.meals);
                    } else {
                        mealsContainer.innerHTML = '<p>No meals found for this category.</p>';
                        searchedMealsSection.style.display = 'block';
                    }
                });
        }
    });

    
    function displaySearchedMeals(meals) {
        mealsContainer.innerHTML = '';
        meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('meal');
            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            mealsContainer.appendChild(mealDiv);
        });
        searchedMealsSection.style.display = 'block';
    }

   
    function showModal(meal) {
        modalTitle.textContent = meal.strMeal;
        modalIngredients.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                const li = document.createElement('li');
                li.textContent = `${ingredient} - ${measure}`;
                modalIngredients.appendChild(li);
            }
        }
        modal.style.display = 'block';
    }

    
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
