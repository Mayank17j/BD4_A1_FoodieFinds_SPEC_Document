const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
const { open } = require('sqlite');
let sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.port || 3000;
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './BD4_A1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

/*
Exercise 1: Get All Restaurants
Objective: Fetch all restaurants from the database.
Query Parameters: None
Tasks: Implement a function to fetch all restaurants.
Example Call:
http://localhost:3000/restaurants

*/
const fetchAllRestaurants = async () => {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
};

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants are found!`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 2: Get Restaurant by ID
Objective: Fetch a specific restaurant by its ID.
Query Parameters:
id (integer)
Tasks: Implement a function to fetch a restaurant by its ID.
Example Call:
http://localhost:3000/restaurants/details/1
*/
const fetchRestaurantById = async (id) => {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);
  return { restaurant: response };
};

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchRestaurantById(id);
    if (!result.restaurant) {
      return res.status(404).json({
        message: `No restaurant found with id: ${id}`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 3: Get Restaurants by Cuisine
Objective: Fetch restaurants based on their cuisine.
Query Parameters:
cuisine (string)
Tasks: Implement a function to fetch restaurants by cuisine.
Example Call:
http://localhost:3000/restaurants/cuisine/Indian

*/
const fetchRestaurantsByCuisine = async (cuisine) => {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
};

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await fetchRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found with cuisine: ${cuisine}`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 4: Get Restaurants by Filter
Objective: Fetch restaurants based on filters such as veg/non-veg, outdoor seating, luxury, etc.
Example Call:http://localhost:3000/restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false
*/
const fetchRestaurantsByFilter = async (isVeg, hasOutdoorSeating, isLuxury) => {
  let query = `SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?`;
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
};

app.get('/restaurants/filter', async (req, res) => {
  try {
    let { isVeg, hasOutdoorSeating, isLuxury } = req.query;
    let result = await fetchRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found matching the filters!`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 5: Get Restaurants Sorted by Rating
Objective: Fetch restaurants sorted by their rating ( highest to lowest ).
Query Parameters: None
Tasks: Implement a function to fetch restaurants sorted by rating.
Example Call:
http://localhost:3000/restaurants/sort-by-rating
*/
const fetchRestaurantsSortedByRating = async () => {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
};

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchRestaurantsSortedByRating();
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 6: Get All Dishes
Objective: Fetch all dishes from the database.
Query Parameters: None
Tasks: Implement a function to fetch all dishes.
Example Call:
http://localhost:3000/dishes
*/
const fetchAllDishes = async () => {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
};

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes are found!`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 7: Get Dish by ID
Objective: Fetch a specific dish by its ID.
Query Parameters:
id (integer)
Tasks: Implement a function to fetch a dish by its ID.
Example Call:
http://localhost:3000/dishes/details/1

*/
const fetchDishById = async (id) => {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);
  return { dish: response };
};

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchDishById(id);
    if (!result.dish) {
      return res.status(404).json({
        message: `No dish found with id: ${id}`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 8: Get Dishes by Filter
Objective: Fetch dishes based on filters such as veg/non-veg.
Query Parameters:
isVeg (boolean)
Tasks: Implement a function to fetch dishes by these filters.
Example Call:
http://localhost:3000/dishes/filter?isVeg=true
*/
const fetchDishesByFilter = async (isVeg) => {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
};

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await fetchDishesByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found matching the filters!`,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 9: Get Dishes Sorted by Price
Objective: Fetch dishes sorted by their price ( lowest to highest ).
Query Parameters: None
Tasks: Implement a function to fetch dishes sorted by price.
Example Call:
http://localhost:3000/dishes/sort-by-price
*/
const fetchDishesSortedByPrice = async () => {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query, []);
  return { dishes: response };
};

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await fetchDishesSortedByPrice();
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
