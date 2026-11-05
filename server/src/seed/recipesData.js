/**
 * 32 Predefined Recipes for Smart Pantry & Zero-Waste Recipe Generator.
 * Curated with realistic ingredient measurements, normalized names, instructions, and tags.
 */

const recipesData = [
  {
    name: "Vegetable Pulao",
    description: "Fragrant basmati rice cooked with mixed vegetables, whole spices, and herbs.",
    category: "Rice & Noodles",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    preparationTime: 15,
    cookingTime: 25,
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      { name: "Rice", quantity: 300, unit: "g" },
      { name: "Carrot", quantity: 100, unit: "g" },
      { name: "Green Peas", quantity: 100, unit: "g" },
      { name: "Potato", quantity: 150, unit: "g" },
      { name: "Onion", quantity: 100, unit: "g" },
      { name: "Ginger Garlic Paste", quantity: 15, unit: "g" }
    ],
    instructions: [
      "Rinse basmati rice thoroughly and soak for 20 minutes.",
      "Heat oil or ghee in a heavy pot, add whole spices and sliced onions until golden brown.",
      "Add ginger garlic paste and diced vegetables (carrots, potatoes, peas) and sauté for 3 minutes.",
      "Add drained rice, water, and salt. Bring to a boil, cover tightly, and simmer on low for 15 minutes.",
      "Fluff gently with a fork and serve hot with raita."
    ],
    tags: ["Indian", "Vegetarian", "Main Course", "Gluten-Free"]
  },
  {
    name: "Tomato Rice",
    description: "Tangy and aromatic South Indian rice dish made with ripe tomatoes, mustard seeds, and spices.",
    category: "Rice & Noodles",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 20,
    difficulty: "Easy",
    servings: 3,
    ingredients: [
      { name: "Rice", quantity: 250, unit: "g" },
      { name: "Tomato", quantity: 300, unit: "g" },
      { name: "Onion", quantity: 100, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" },
      { name: "Mustard Seeds", quantity: 5, unit: "g" }
    ],
    instructions: [
      "Cook rice and spread on a wide plate to cool slightly.",
      "Heat oil in a pan, temper with mustard seeds and curry leaves.",
      "Sauté sliced onions and slit green chillies until translucent.",
      "Add chopped ripe tomatoes, turmeric, and chili powder. Cook until mushy and oil separates.",
      "Toss the cooked rice into the tomato masala until well coated. Garnish with fresh coriander."
    ],
    tags: ["Indian", "Quick Meals", "Vegan", "Zero-Waste"]
  },
  {
    name: "Paneer Bhurji",
    description: "Quick scrambled cottage cheese cooked with chopped onions, tomatoes, and everyday spices.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 15,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Paneer", quantity: 200, unit: "g" },
      { name: "Onion", quantity: 100, unit: "g" },
      { name: "Tomato", quantity: 100, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" },
      { name: "Capsicum", quantity: 80, unit: "g" }
    ],
    instructions: [
      "Crumble fresh paneer with your fingers and set aside.",
      "Heat butter or oil in a pan. Sauté chopped onions and green chillies until translucent.",
      "Add diced tomatoes and diced capsicum. Cook for 3 minutes until soft.",
      "Add turmeric powder, red chilli powder, and garam masala.",
      "Fold in the crumbled paneer, cook on medium heat for 2-3 minutes without overcooking.",
      "Serve warm with roti, paratha, or toast."
    ],
    tags: ["Indian", "High-Protein", "Vegetarian", "Quick Meals"]
  },
  {
    name: "Vegetable Upma",
    description: "Wholesome South Indian breakfast made from roasted semolina (rava) and diced fresh vegetables.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 15,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Semolina", quantity: 150, unit: "g" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Carrot", quantity: 60, unit: "g" },
      { name: "Green Peas", quantity: 50, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" }
    ],
    instructions: [
      "Dry roast semolina on medium-low flame until fragrant and lightly toasted. Keep aside.",
      "In a pan, heat oil, add mustard seeds, chana dal, and curry leaves.",
      "Add chopped onions, green chillies, carrots, and peas. Sauté for 3 minutes.",
      "Pour in 2.5 cups of water and salt. Bring water to a rolling boil.",
      "Gradually add roasted semolina while stirring continuously to prevent lumps.",
      "Cover and simmer for 3 minutes until soft and fluffy. Finish with a squeeze of lemon."
    ],
    tags: ["Indian", "Breakfast", "Vegetarian", "Healthy"]
  },
  {
    name: "Aloo Paratha",
    description: "Classic North Indian flatbread stuffed with spiced mashed potatoes and pan-roasted with ghee.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    preparationTime: 20,
    cookingTime: 20,
    difficulty: "Medium",
    servings: 3,
    ingredients: [
      { name: "Wheat Flour", quantity: 250, unit: "g" },
      { name: "Potato", quantity: 300, unit: "g" },
      { name: "Onion", quantity: 60, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" },
      { name: "Coriander", quantity: 20, unit: "g" }
    ],
    instructions: [
      "Boil, peel, and thoroughly mash potatoes.",
      "Mix mashed potatoes with finely chopped onion, chillies, coriander, salt, and cumin powder.",
      "Knead whole wheat flour with water into a soft pliable dough.",
      "Roll dough into small discs, place a generous potato stuffing ball in the center, and seal.",
      "Roll out gently and cook on a hot tawa with ghee or oil until golden brown spots appear on both sides."
    ],
    tags: ["Indian", "Comfort Food", "Vegetarian", "Breakfast"]
  },
  {
    name: "Egg Fried Rice",
    description: "Quick, high-protein stir-fried rice loaded with scrambled eggs, scallions, and soy sauce.",
    category: "Rice & Noodles",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Rice", quantity: 300, unit: "g" },
      { name: "Egg", quantity: 3, unit: "pieces" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Soy Sauce", quantity: 20, unit: "ml" }
    ],
    instructions: [
      "Use day-old chilled cooked rice for the best texture.",
      "Beat eggs with a pinch of salt. Scramble lightly in a hot wok with oil, then set aside.",
      "Add more oil to the wok, add minced garlic and sliced onions, tossing over high heat.",
      "Add rice, soy sauce, and a pinch of black pepper. Stir-fry vigorously on high flame.",
      "Toss the scrambled eggs back into the rice until evenly combined. Serve immediately."
    ],
    tags: ["High-Protein", "Quick Meals", "Leftover Recipes"]
  },
  {
    name: "Dal Tadka",
    description: "Comforting yellow lentils tempered with ghee, cumin seeds, garlic, and dried red chillies.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 25,
    difficulty: "Easy",
    servings: 4,
    ingredients: [
      { name: "Lentils", quantity: 200, unit: "g" },
      { name: "Tomato", quantity: 150, unit: "g" },
      { name: "Onion", quantity: 100, unit: "g" },
      { name: "Garlic", quantity: 20, unit: "g" },
      { name: "Ginger", quantity: 10, unit: "g" }
    ],
    instructions: [
      "Pressure cook or boil toor/yellow lentils with water, turmeric, and salt until soft.",
      "In a skillet, heat ghee, add cumin seeds, and let them crackle.",
      "Add chopped garlic, ginger, and onions. Cook until aromatic and golden brown.",
      "Add chopped tomatoes and red chilli powder. Cook until soft.",
      "Pour cooked lentils into the pan, simmer for 5 minutes, and finish with fresh coriander."
    ],
    tags: ["Indian", "High-Protein", "Comfort Food", "Gluten-Free"]
  },
  {
    name: "Vegetable Khichdi",
    description: "Wholesome one-pot comfort meal made with rice, yellow lentils, and seasonal vegetables.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 20,
    difficulty: "Easy",
    servings: 3,
    ingredients: [
      { name: "Rice", quantity: 150, unit: "g" },
      { name: "Lentils", quantity: 100, unit: "g" },
      { name: "Potato", quantity: 100, unit: "g" },
      { name: "Carrot", quantity: 80, unit: "g" },
      { name: "Tomato", quantity: 100, unit: "g" }
    ],
    instructions: [
      "Wash rice and moong lentils together and soak for 15 minutes.",
      "Heat ghee in a pressure cooker. Add cumin seeds, asafoetida, and chopped vegetables.",
      "Add drained rice and lentils, turmeric, and salt. Stir for 2 minutes.",
      "Pour in 4 cups of water. Pressure cook for 3 to 4 whistles on medium heat.",
      "Let steam release naturally. Serve piping hot topped with a spoonful of ghee."
    ],
    tags: ["Indian", "Comfort Food", "Healthy", "Zero-Waste"]
  },
  {
    name: "Masala Omelette",
    description: "Spicy Indian street-style omelette whisked with onions, green chillies, tomatoes, and fresh herbs.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 5,
    difficulty: "Easy",
    servings: 1,
    ingredients: [
      { name: "Egg", quantity: 2, unit: "pieces" },
      { name: "Onion", quantity: 40, unit: "g" },
      { name: "Tomato", quantity: 40, unit: "g" },
      { name: "Green Chilli", quantity: 1, unit: "pieces" },
      { name: "Coriander", quantity: 10, unit: "g" }
    ],
    instructions: [
      "Crack eggs into a bowl. Add finely chopped onion, tomato, green chilli, coriander, salt, and turmeric.",
      "Whisk vigorously until frothy and well mixed.",
      "Heat oil or butter in a frying pan over medium heat.",
      "Pour the egg mixture, swirling to coat the pan evenly.",
      "Cook for 2 minutes until bottom is golden, flip carefully and cook the reverse side for 1 minute."
    ],
    tags: ["High-Protein", "Breakfast", "Quick Meals", "Low-Carb"]
  },
  {
    name: "Mixed Vegetable Curry",
    description: "Hearty homestyle curry made by simmering diverse pantry vegetables in a flavorful onion-tomato gravy.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    preparationTime: 15,
    cookingTime: 25,
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      { name: "Potato", quantity: 150, unit: "g" },
      { name: "Carrot", quantity: 100, unit: "g" },
      { name: "Cauliflower", quantity: 150, unit: "g" },
      { name: "Onion", quantity: 100, unit: "g" },
      { name: "Tomato", quantity: 150, unit: "g" },
      { name: "Ginger Garlic Paste", quantity: 15, unit: "g" }
    ],
    instructions: [
      "Chop all vegetables into bite-sized pieces.",
      "Heat oil in a pan, sauté onions and ginger-garlic paste until brown.",
      "Add tomato puree, coriander powder, cumin powder, and turmeric. Cook until oil leaves sides.",
      "Toss in the mixed vegetables, add 1.5 cups of warm water, and cover.",
      "Simmer for 15 minutes until vegetables are tender. Garnish with garam masala and cilantro."
    ],
    tags: ["Indian", "Vegetarian", "Zero-Waste", "Main Course"]
  },
  {
    name: "Lemon Rice",
    description: "Zesty South Indian rice tempered with crunchy peanuts, curry leaves, turmeric, and lemon juice.",
    category: "Rice & Noodles",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Rice", quantity: 250, unit: "g" },
      { name: "Lemon", quantity: 1, unit: "pieces" },
      { name: "Peanuts", quantity: 40, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" },
      { name: "Mustard Seeds", quantity: 5, unit: "g" }
    ],
    instructions: [
      "Cook rice or take leftover chilled rice.",
      "Heat oil in a pan, add mustard seeds and raw peanuts. Fry until golden and fragrant.",
      "Add slit green chillies, curry leaves, and a pinch of turmeric powder.",
      "Turn off the heat, stir in freshly squeezed lemon juice and salt.",
      "Gently mix in the rice until bright yellow and fragrant."
    ],
    tags: ["Indian", "Vegan", "Quick Meals", "Leftover Recipes"]
  },
  {
    name: "Poha",
    description: "Fluffy flattened rice tempered with mustard seeds, turmeric, onions, and crispy roasted peanuts.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Flattened Rice", quantity: 150, unit: "g" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Potato", quantity: 80, unit: "g" },
      { name: "Peanuts", quantity: 30, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" }
    ],
    instructions: [
      "Rinse flattened rice (poha) gently in a colander and drain completely. Add salt and turmeric.",
      "Heat oil in a kadai. Fry peanuts until crisp and set aside.",
      "In the same oil, add mustard seeds, finely chopped potatoes, and onions. Cook until tender.",
      "Add green chillies and gently fold in the softened flattened rice.",
      "Cover and steam on low flame for 2 minutes. Garnish with peanuts and lemon juice."
    ],
    tags: ["Indian", "Breakfast", "Vegan", "Quick Meals"]
  },
  {
    name: "Chana Masala",
    description: "Rich and spicy North Indian chickpea curry simmered in an onion, ginger, and tomato gravy.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    preparationTime: 15,
    cookingTime: 25,
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      { name: "Chickpeas", quantity: 250, unit: "g" },
      { name: "Onion", quantity: 120, unit: "g" },
      { name: "Tomato", quantity: 150, unit: "g" },
      { name: "Ginger Garlic Paste", quantity: 15, unit: "g" },
      { name: "Garam Masala", quantity: 5, unit: "g" }
    ],
    instructions: [
      "Boil soaked chickpeas until soft and tender.",
      "Heat oil in a heavy-bottomed pot, fry onions until golden brown.",
      "Add ginger garlic paste and spices (coriander, cumin, chana masala, turmeric).",
      "Add tomato puree and cook until aromatic and thick.",
      "Add the boiled chickpeas along with some cooking liquid. Simmer for 15 minutes to let flavors meld."
    ],
    tags: ["Indian", "High-Protein", "Vegan", "Main Course"]
  },
  {
    name: "Curd Rice",
    description: "Soothing South Indian comfort dish of soft mashed rice blended with fresh yogurt and spiced tempering.",
    category: "Quick Meals",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 5,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Rice", quantity: 200, unit: "g" },
      { name: "Yogurt", quantity: 200, unit: "g" },
      { name: "Milk", quantity: 50, unit: "ml" },
      { name: "Green Chilli", quantity: 1, unit: "pieces" },
      { name: "Ginger", quantity: 10, unit: "g" }
    ],
    instructions: [
      "Mash warm cooked rice well with the back of a spoon.",
      "Mix in yogurt, milk, and salt until smooth and creamy.",
      "Heat 1 teaspoon of oil in a small pan. Splutter mustard seeds, minced ginger, and chopped green chillies.",
      "Pour the warm tempering over the rice.",
      "Mix well and chill slightly before serving."
    ],
    tags: ["Indian", "Comfort Food", "Vegetarian", "Quick Meals"]
  },
  {
    name: "Palak Paneer",
    description: "Nutritious and vibrant green spinach gravy studded with soft cubes of lightly pan-seared paneer.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    preparationTime: 15,
    cookingTime: 20,
    difficulty: "Medium",
    servings: 3,
    ingredients: [
      { name: "Spinach", quantity: 300, unit: "g" },
      { name: "Paneer", quantity: 200, unit: "g" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Tomato", quantity: 100, unit: "g" },
      { name: "Garlic", quantity: 20, unit: "g" }
    ],
    instructions: [
      "Blanch spinach leaves in boiling water for 2 minutes, then plunge into cold water to preserve color.",
      "Puree blanched spinach with green chillies into a smooth velvet paste.",
      "Heat butter in a skillet, sauté chopped garlic and onions until fragrant.",
      "Add diced tomatoes and cook until soft. Pour in the spinach puree and simmer on low for 5 minutes.",
      "Gently add paneer cubes and a splash of cream. Cook for 2 more minutes."
    ],
    tags: ["Indian", "Vegetarian", "Healthy", "Main Course"]
  },
  {
    name: "Vegetable Pasta",
    description: "Al dente penne pasta tossed with sautéed bell peppers, zucchini, garlic, and tomato marinara sauce.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 15,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Pasta", quantity: 200, unit: "g" },
      { name: "Tomato", quantity: 200, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Capsicum", quantity: 100, unit: "g" },
      { name: "Olive Oil", quantity: 20, unit: "ml" }
    ],
    instructions: [
      "Boil pasta in salted water until al dente, reserving 1/2 cup pasta water.",
      "In a skillet, heat olive oil and sauté minced garlic until fragrant.",
      "Add sliced bell peppers and cook for 3 minutes until crisp-tender.",
      "Add crushed tomatoes, oregano, and salt. Simmer for 8 minutes to thicken.",
      "Toss the pasta into the sauce, adding pasta water as needed to create a glossy emulsion."
    ],
    tags: ["Italian", "Vegetarian", "Quick Meals"]
  },
  {
    name: "Mushroom Soup",
    description: "Silky and earthy homemade cream of mushroom soup infused with garlic and fresh thyme.",
    category: "Soups & Salads",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 20,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Mushroom", quantity: 250, unit: "g" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Milk", quantity: 200, unit: "ml" },
      { name: "Butter", quantity: 30, unit: "g" }
    ],
    instructions: [
      "Melt butter in a soup pot. Sauté diced onions and minced garlic until soft.",
      "Add sliced mushrooms and cook until browned and juices evaporate.",
      "Add 1 tablespoon flour to form a roux, stirring for 1 minute.",
      "Slowly whisk in vegetable broth and warm milk. Bring to a gentle simmer.",
      "Blend half the soup for creaminess while keeping some mushroom chunks for texture. Season with black pepper."
    ],
    tags: ["Soups & Salads", "Comfort Food", "Vegetarian"]
  },
  {
    name: "Classic Fluffy Pancakes",
    description: "Golden, cloud-like breakfast pancakes made from simple pantry staples, perfect with honey or syrup.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Flour", quantity: 150, unit: "g" },
      { name: "Milk", quantity: 200, unit: "ml" },
      { name: "Egg", quantity: 1, unit: "pieces" },
      { name: "Sugar", quantity: 30, unit: "g" },
      { name: "Butter", quantity: 25, unit: "g" }
    ],
    instructions: [
      "Whisk flour, sugar, baking powder, and a pinch of salt together in a bowl.",
      "In a separate bowl, whisk milk, egg, and melted butter.",
      "Pour wet ingredients into dry ingredients and stir gently until just combined (lumps are fine).",
      "Ladle batter onto a greased hot griddle over medium heat.",
      "Flip when bubbles pop on the surface and cook reverse side until golden brown."
    ],
    tags: ["Breakfast", "Comfort Food", "Quick Meals"]
  },
  {
    name: "Garlic Bread",
    description: "Crispy toasted French baguette slices generously brushed with homemade roasted garlic herb butter.",
    category: "Snacks & Breads",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 3,
    ingredients: [
      { name: "Bread", quantity: 6, unit: "pieces" },
      { name: "Garlic", quantity: 20, unit: "g" },
      { name: "Butter", quantity: 50, unit: "g" },
      { name: "Coriander", quantity: 10, unit: "g" }
    ],
    instructions: [
      "Soften butter at room temperature.",
      "Finely grate garlic cloves and mix into butter with chopped parsley or coriander and salt.",
      "Spread the garlic butter generously on thick slices of crusty bread.",
      "Toast in an oven at 200°C for 8 minutes or on a stovetop skillet until crisp and golden brown."
    ],
    tags: ["Snacks & Breads", "Quick Meals", "Vegetarian"]
  },
  {
    name: "Toasted Vegetable Sandwich",
    description: "Crispy grilled sandwich layered with cucumber, tomato, boiled potato slices, and mint chutney.",
    category: "Snacks & Breads",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 5,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Bread", quantity: 4, unit: "pieces" },
      { name: "Tomato", quantity: 80, unit: "g" },
      { name: "Cucumber", quantity: 80, unit: "g" },
      { name: "Potato", quantity: 100, unit: "g" },
      { name: "Butter", quantity: 20, unit: "g" }
    ],
    instructions: [
      "Butter bread slices and spread green mint chutney if available.",
      "Layer with thinly sliced boiled potatoes, cucumber slices, and tomato rings.",
      "Sprinkle chaat masala and a pinch of black pepper.",
      "Cover with the second slice of bread and toast in a sandwich maker or skillet until golden and crunchy."
    ],
    tags: ["Snacks & Breads", "Vegetarian", "Quick Meals"]
  },
  {
    name: "Classic Fried Rice",
    description: "Fluffy stir-fried rice tossed with colorful crisp vegetables, soy sauce, and aromatic garlic.",
    category: "Rice & Noodles",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Rice", quantity: 300, unit: "g" },
      { name: "Carrot", quantity: 80, unit: "g" },
      { name: "Capsicum", quantity: 80, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Soy Sauce", quantity: 20, unit: "ml" }
    ],
    instructions: [
      "Heat oil in a wok on maximum heat until smoking.",
      "Add minced garlic, then toss in diced carrots and bell peppers. Stir fry for 2 minutes to keep crunch.",
      "Add cold cooked rice, spreading it across the wok.",
      "Drizzle soy sauce and vinegar around the edges of the pan. Toss vigorously for 3 minutes.",
      "Garnish with spring onions and black pepper."
    ],
    tags: ["Rice & Noodles", "Vegan", "Zero-Waste", "Quick Meals"]
  },
  {
    name: "Crispy Potato Wedges",
    description: "Oven-baked or pan-fried crispy potato wedges seasoned with paprika, garlic powder, and sea salt.",
    category: "Snacks & Breads",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 25,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Potato", quantity: 400, unit: "g" },
      { name: "Olive Oil", quantity: 25, unit: "ml" },
      { name: "Garlic", quantity: 10, unit: "g" }
    ],
    instructions: [
      "Wash potatoes well (leave skins on) and cut into equal wedge shapes.",
      "Soak wedges in cold water for 15 minutes to remove excess starch, then dry thoroughly with a towel.",
      "Toss with olive oil, minced garlic, paprika, and salt.",
      "Spread evenly on a baking tray and bake at 210°C for 25-30 minutes, flipping halfway until crispy."
    ],
    tags: ["Snacks & Breads", "Vegan", "Comfort Food", "Gluten-Free"]
  },
  {
    name: "Vegetable Stir Fry",
    description: "Crunchy colorful vegetables quickly tossed in a savory garlic ginger sauce over high heat.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 8,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Carrot", quantity: 100, unit: "g" },
      { name: "Capsicum", quantity: 100, unit: "g" },
      { name: "Mushroom", quantity: 100, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Soy Sauce", quantity: 25, unit: "ml" }
    ],
    instructions: [
      "Slice all vegetables into uniform strips.",
      "Heat sesame or vegetable oil in a wok until shimmering.",
      "Add garlic and sliced mushrooms, sauté for 2 minutes.",
      "Add carrots and bell peppers, stir frying constantly on high heat for 3-4 minutes.",
      "Pour soy sauce and a splash of water, toss rapidly until glazed, and serve immediately."
    ],
    tags: ["Vegan", "Healthy", "Quick Meals", "Low-Carb"]
  },
  {
    name: "Tomato Basil Soup",
    description: "Smooth roasted tomato soup simmered with garlic, olive oil, and fragrant fresh basil.",
    category: "Soups & Salads",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 20,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Tomato", quantity: 400, unit: "g" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Olive Oil", quantity: 15, unit: "ml" }
    ],
    instructions: [
      "Roughly chop tomatoes and onions.",
      "Heat olive oil in a pot, cook onions and garlic until translucent.",
      "Add tomatoes and a pinch of salt. Cook until softened and juicy.",
      "Add 1 cup of water or vegetable broth and simmer for 15 minutes.",
      "Puree with an immersion blender until silky. Season with black pepper and basil leaves."
    ],
    tags: ["Soups & Salads", "Healthy", "Zero-Waste", "Vegan"]
  },
  {
    name: "Shakshuka",
    description: "Eggs gently poached in a simmering skillet of spiced tomatoes, bell peppers, onions, and garlic.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 15,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Egg", quantity: 3, unit: "pieces" },
      { name: "Tomato", quantity: 250, unit: "g" },
      { name: "Capsicum", quantity: 100, unit: "g" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" }
    ],
    instructions: [
      "Heat olive oil in a wide skillet. Sauté chopped onions, garlic, and bell peppers until tender.",
      "Add diced tomatoes, cumin, paprika, and salt. Simmer for 10 minutes until a rich sauce forms.",
      "Make small wells in the tomato sauce using a spoon.",
      "Crack eggs directly into each well.",
      "Cover the skillet and cook on low heat for 5-8 minutes until egg whites are set and yolks remain runny."
    ],
    tags: ["Breakfast", "High-Protein", "Zero-Waste", "Mediterranean"]
  },
  {
    name: "Banana Oat Smoothie",
    description: "Creamy, naturally sweet breakfast smoothie blended with ripe bananas, rolled oats, and cold milk.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 0,
    difficulty: "Easy",
    servings: 1,
    ingredients: [
      { name: "Banana", quantity: 2, unit: "pieces" },
      { name: "Oats", quantity: 40, unit: "g" },
      { name: "Milk", quantity: 250, unit: "ml" },
      { name: "Honey", quantity: 15, unit: "g" }
    ],
    instructions: [
      "Peel ripe bananas and break into pieces.",
      "Add oats, bananas, milk, and a drizzle of honey into a blender.",
      "Blend on high speed for 60 seconds until completely smooth and frothy.",
      "Pour into a tall glass and enjoy immediately."
    ],
    tags: ["Breakfast", "Zero-Waste", "Healthy", "Quick Meals"]
  },
  {
    name: "Golden French Toast",
    description: "Bread slices soaked in a spiced egg-milk batter and pan-fried in butter until golden brown and custardy.",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Bread", quantity: 4, unit: "pieces" },
      { name: "Egg", quantity: 2, unit: "pieces" },
      { name: "Milk", quantity: 80, unit: "ml" },
      { name: "Sugar", quantity: 15, unit: "g" },
      { name: "Butter", quantity: 20, unit: "g" }
    ],
    instructions: [
      "In a shallow dish, whisk eggs, milk, sugar, and a pinch of cinnamon or cardamom.",
      "Dip bread slices into the egg mixture for 20 seconds on each side until saturated.",
      "Melt butter in a skillet over medium heat.",
      "Cook bread slices for 3 minutes on each side until deeply golden and cooked through.",
      "Serve warm dusted with powdered sugar."
    ],
    tags: ["Breakfast", "Comfort Food", "Leftover Recipes"]
  },
  {
    name: "Chickpea & Cucumber Salad",
    description: "Refreshing zero-cook Mediterranean salad packed with protein, diced cucumbers, and lemon dressing.",
    category: "Soups & Salads",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 0,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Chickpeas", quantity: 200, unit: "g" },
      { name: "Cucumber", quantity: 120, unit: "g" },
      { name: "Tomato", quantity: 100, unit: "g" },
      { name: "Lemon", quantity: 1, unit: "pieces" },
      { name: "Olive Oil", quantity: 15, unit: "ml" }
    ],
    instructions: [
      "Drain and rinse cooked or canned chickpeas.",
      "Dice cucumber and ripe tomatoes into bite-sized cubes.",
      "In a large salad bowl, combine chickpeas, cucumber, and tomatoes.",
      "Drizzle with extra virgin olive oil, freshly squeezed lemon juice, salt, and black pepper.",
      "Toss gently and serve chilled."
    ],
    tags: ["Soups & Salads", "Vegan", "High-Protein", "Gluten-Free"]
  },
  {
    name: "Vegetable Hakka Noodles",
    description: "Street-style stir-fried noodles tossed with julienned vegetables, garlic, and aromatic sauces.",
    category: "Rice & Noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Noodles", quantity: 200, unit: "g" },
      { name: "Carrot", quantity: 80, unit: "g" },
      { name: "Capsicum", quantity: 80, unit: "g" },
      { name: "Garlic", quantity: 15, unit: "g" },
      { name: "Soy Sauce", quantity: 20, unit: "ml" }
    ],
    instructions: [
      "Boil noodles al dente according to package instructions, drain, and toss with a few drops of oil.",
      "Heat a wok on high heat with oil. Add minced garlic and sauté for 30 seconds.",
      "Add shredded carrots and bell peppers, tossing vigorously for 2 minutes.",
      "Add boiled noodles, soy sauce, vinegar, and ground black pepper.",
      "Toss with tongs on high flame until thoroughly combined and aromatic."
    ],
    tags: ["Rice & Noodles", "Vegan", "Quick Meals"]
  },
  {
    name: "Aloo Jeera (Cumin Spiced Potatoes)",
    description: "Quick North Indian side dish of tender boiled potatoes sautéed with toasted cumin seeds and spices.",
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    preparationTime: 10,
    cookingTime: 12,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Potato", quantity: 350, unit: "g" },
      { name: "Cumin Seeds", quantity: 10, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" },
      { name: "Coriander", quantity: 15, unit: "g" }
    ],
    instructions: [
      "Boil and peel potatoes, cut into bite-sized cubes.",
      "Heat mustard oil or vegetable oil in a pan until warm.",
      "Add cumin seeds and let them sizzle until golden brown.",
      "Add slit green chillies, turmeric, red chilli powder, and dry mango powder (amchur).",
      "Toss potato cubes into the spices on medium-high heat until edges turn crisp and golden.",
      "Garnish generously with chopped cilantro."
    ],
    tags: ["Indian", "Vegan", "Gluten-Free", "Quick Meals"]
  },
  {
    name: "Egg Bhurji (Indian Scrambled Eggs)",
    description: "Flavor-packed scrambled eggs sautéed with onions, green chillies, tomatoes, and garam masala.",
    category: "Quick Meals",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 10,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { name: "Egg", quantity: 3, unit: "pieces" },
      { name: "Onion", quantity: 80, unit: "g" },
      { name: "Tomato", quantity: 80, unit: "g" },
      { name: "Green Chilli", quantity: 2, unit: "pieces" },
      { name: "Butter", quantity: 15, unit: "g" }
    ],
    instructions: [
      "Heat butter in a frying pan. Sauté chopped onions and green chillies until translucent.",
      "Add chopped tomatoes, turmeric, and chili powder. Cook until soft.",
      "Crack eggs directly into the pan or lightly whisk before pouring.",
      "Scramble eggs gently over medium-low heat until soft curds form.",
      "Finish with fresh coriander and serve hot with buttered toast or pav."
    ],
    tags: ["Indian", "High-Protein", "Quick Meals", "Breakfast"]
  },
  {
    name: "Zero-Waste Veggie Peel Broth",
    description: "Nutrient-dense savory homemade vegetable stock made from saved clean vegetable scraps, stems, and peelings.",
    category: "Soups & Salads",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    preparationTime: 5,
    cookingTime: 40,
    difficulty: "Easy",
    servings: 4,
    ingredients: [
      { name: "Carrot", quantity: 150, unit: "g" },
      { name: "Onion", quantity: 100, unit: "g" },
      { name: "Garlic", quantity: 20, unit: "g" },
      { name: "Potato", quantity: 150, unit: "g" }
    ],
    instructions: [
      "Gather saved clean vegetable peels and trim pieces (carrot ends, potato skins, onion skins, herb stems).",
      "Place scraps into a large stockpot and cover with 6 cups of water.",
      "Add smashed garlic cloves, peppercorns, and a bay leaf.",
      "Bring to a gentle boil, then simmer on low heat for 40 minutes to extract all flavors.",
      "Strain through a fine mesh sieve. Use as the base for soups, curries, and rice!"
    ],
    tags: ["Soups & Salads", "Zero-Waste", "Vegan", "Gluten-Free"]
  }
];

module.exports = recipesData;

