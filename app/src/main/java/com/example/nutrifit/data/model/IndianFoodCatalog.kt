package com.example.nutrifit.data.model

object IndianFoodCatalog {

    val foods = listOf(
        FoodItem(
            name = "e-Millet Crunchy Little Millet Choco Hearts (100g Pack)",
            portionGrams = 100f,
            calories = 407.86f,
            protein = 9.8f,
            carbs = 75.2f,
            fat = 7.54f,
            fiber = 5.2f,
            sugar = 37.5f,
            saturatedFat = 1.5f,
            transFat = 0.0f,
            cholesterol = 0.0f,
            brand = "e-Millet (Millet Snacks)",
            verifiedSource = "Official Brand Platform (milletsnacks.com)",
            groundingUrl = "https://milletsnacks.com",
            highlights = listOf(
                "Official Product Facts: 9.8g Protein, 75.2g Carbs, 7.54g Fat, 5.2g Fiber",
                "Clean Ingredients: 47% Multi-grain (Corn 25%, Samai 20%, Gram Dal 2%)",
                "Jaggery Sweetened (45%): 0% refined white sugar",
                "Non-Fried Extruded Snack: Cocoa, Cashew Nuts, Grits, Cardamom"
            ),
            ingredients = listOf(
                "Multi-grain Blend (47%): Corn Meal (25%), Little Millet Meal (Samai) (20%), Gram Dal Meal (2%)",
                "Sweeteners: Jaggery Powder (45%)",
                "Flavoring & Texture: Cocoa Powder, Cashew Nuts, Grits, Cardamom, Edible Vegetable Oil (Palm)"
            )
        ),
        FoodItem(
            name = "e-Millet Little Millet Choco Hearts (1 Serving ~30g)",
            portionGrams = 30f,
            calories = 122.36f,
            protein = 2.94f,
            carbs = 22.56f,
            fat = 2.26f,
            fiber = 1.56f,
            sugar = 11.25f,
            saturatedFat = 0.45f,
            transFat = 0.0f,
            cholesterol = 0.0f,
            brand = "e-Millet (Millet Snacks)",
            verifiedSource = "Official Brand Platform (milletsnacks.com)",
            groundingUrl = "https://milletsnacks.com",
            highlights = listOf(
                "Official Product Facts: 2.94g Protein, 22.56g Carbs, 2.26g Fat, 122.36 kcal",
                "Baked Non-Fried Extruded Snack",
                "Sweetened with natural Jaggery Powder",
                "Rich in Little Millet (Samai / சாமை)"
            )
        ),
        FoodItem(
            name = "e-Millet Sorghum (Jowar) Noodles (100g Pack)",
            portionGrams = 100f,
            calories = 365.54f,
            protein = 13.58f,
            carbs = 73.50f,
            fat = 1.01f,
            fiber = 9.36f,
            sugar = 6.25f,
            sodium = 820.00f,
            calcium = 184.00f,
            iron = 7.85f,
            brand = "e-Millet (Millet Snacks)",
            verifiedSource = "Official Brand Platform (milletsnacks.com)",
            groundingUrl = "https://milletsnacks.com/products/sorghum-noodles-with-masala",
            highlights = listOf(
                "No Maida: 33% Sorghum (Jowar / சோளம்) + 61.5% Whole Wheat",
                "No Added MSG & No Preservatives",
                "Diabetic Friendly & Low GI",
                "Not Fried (Air-Dried, 1.01g Fat)"
            ),
            ingredients = listOf(
                "Sorghum (Jowar / சோளம்) Millet Flour (33%)",
                "Whole Wheat Flour (61.5%)",
                "Natural Masala Seasoning Sachet (Spices, Salt, Cumin, Pepper)"
            )
        ),
        FoodItem(
            name = "e-Millet Sorghum Noodles (1 Serving ~60g)",
            portionGrams = 60f,
            calories = 219.32f,
            protein = 8.15f,
            carbs = 44.10f,
            fat = 1.01f,
            fiber = 5.62f,
            brand = "e-Millet (Millet Snacks)",
            verifiedSource = "Official Brand Platform (milletsnacks.com)",
            groundingUrl = "https://milletsnacks.com/products/sorghum-noodles-with-masala",
            highlights = listOf(
                "No Maida: 33% Sorghum + 61.5% Whole Wheat",
                "High Plant Protein: 8.15g per serving",
                "Clean label spice mix"
            )
        ),
        FoodItem(
            name = "Whole Wheat Roti (1 Roti ~40g)",
            portionGrams = 40f,
            calories = 120f,
            protein = 4f,
            carbs = 24f,
            fat = 1f,
            fiber = 3f,
            brand = "Traditional Indian Kitchen",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("100% Whole Wheat Atta", "Slow release carbohydrates", "Zero added fats")
        ),
        FoodItem(
            name = "Yellow Dal Tadka (1 Bowl ~150g)",
            portionGrams = 150f,
            calories = 140f,
            protein = 8f,
            carbs = 18f,
            fat = 4f,
            fiber = 4.5f,
            brand = "Traditional Indian Kitchen",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("High plant protein from Toor/Moong dal", "Cumin-mustard-garlic tempering")
        ),
        FoodItem(
            name = "Paneer Butter Masala (1 Bowl ~150g)",
            portionGrams = 150f,
            calories = 310f,
            protein = 14f,
            carbs = 12f,
            fat = 24f,
            fiber = 2.5f,
            brand = "North Indian Cuisine",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Fresh cottage cheese in rich tomato gravy", "High calcium & protein")
        ),
        FoodItem(
            name = "Steamed Idli (2 pieces ~100g)",
            portionGrams = 100f,
            calories = 130f,
            protein = 4.5f,
            carbs = 26f,
            fat = 0.5f,
            fiber = 1.5f,
            brand = "South Indian Cuisine",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Fermented rice and urad dal batter", "Zero oil, easily digestible gut-friendly")
        ),
        FoodItem(
            name = "Masala Dosa (1 regular ~120g)",
            portionGrams = 120f,
            calories = 250f,
            protein = 6f,
            carbs = 38f,
            fat = 8f,
            fiber = 3f,
            brand = "South Indian Cuisine",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Crispy crepe with spiced potato filling", "Served with sambar and chutney")
        ),
        FoodItem(
            name = "Vegetable Sambar (1 Bowl ~150g)",
            portionGrams = 150f,
            calories = 110f,
            protein = 4.5f,
            carbs = 16f,
            fat = 3f,
            fiber = 4f,
            brand = "South Indian Cuisine",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Lentil stew with drumstick, carrots, pumpkin", "Rich in dietary fiber and vitamins")
        ),
        FoodItem(
            name = "Cooked Brown Rice (1 Cup ~150g)",
            portionGrams = 150f,
            calories = 165f,
            protein = 3.5f,
            carbs = 34f,
            fat = 1.5f,
            fiber = 2.8f,
            brand = "Standard Grains",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Whole grain rice with intact bran", "Low glycemic index")
        ),
        FoodItem(
            name = "Chicken Biryani (1 Bowl ~200g)",
            portionGrams = 200f,
            calories = 360f,
            protein = 22f,
            carbs = 42f,
            fat = 12f,
            fiber = 2.5f,
            brand = "Hyderabadi / Indian Cuisine",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Aromatic basmati rice cooked with spiced chicken", "High protein meal")
        ),
        FoodItem(
            name = "Vegetable Poha (1 Plate ~120g)",
            portionGrams = 120f,
            calories = 180f,
            protein = 3.8f,
            carbs = 32f,
            fat = 4.5f,
            fiber = 2.2f,
            brand = "Indian Breakfast",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Flattened rice with peanuts, curry leaves, turmeric", "Iron-rich breakfast")
        ),
        FoodItem(
            name = "Mixed Vegetable Salad (1 Bowl ~100g)",
            portionGrams = 100f,
            calories = 45f,
            protein = 1.5f,
            carbs = 8f,
            fat = 0.5f,
            fiber = 3.5f,
            brand = "Fresh Farm Produce",
            verifiedSource = "ICMR - National Institute of Nutrition (NIN) Database",
            highlights = listOf("Cucumber, carrot, tomato, lemon dressing", "Hydrating & high micronutrient density")
        )
    )

    fun search(query: String): List<FoodItem> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return foods
        return foods.filter {
            it.name.lowercase().contains(q) ||
            it.brand?.lowercase()?.contains(q) == true ||
            it.highlights.any { h -> h.lowercase().contains(q) }
        }
    }

    fun findMatch(query: String, portionGrams: Float = 100f): FoodItem? {
        val q = query.trim().lowercase()
        val found = foods.firstOrNull {
            it.name.lowercase().contains(q) ||
            (q.contains("choco") && it.name.lowercase().contains("choco")) ||
            (q.contains("sorghum") && it.name.lowercase().contains("sorghum")) ||
            (q.contains("noodle") && it.name.lowercase().contains("noodles")) ||
            (q.contains("roti") && it.name.lowercase().contains("roti")) ||
            (q.contains("dal") && it.name.lowercase().contains("dal")) ||
            (q.contains("paneer") && it.name.lowercase().contains("paneer")) ||
            (q.contains("dosa") && it.name.lowercase().contains("dosa")) ||
            (q.contains("idli") && it.name.lowercase().contains("idli")) ||
            (q.contains("rice") && it.name.lowercase().contains("rice")) ||
            (q.contains("biryani") && it.name.lowercase().contains("biryani")) ||
            (q.contains("poha") && it.name.lowercase().contains("poha"))
        } ?: return null

        if (portionGrams != found.portionGrams && portionGrams > 0) {
            val scale = portionGrams / found.portionGrams
            return found.copy(
                portionGrams = portionGrams,
                calories = (found.calories * scale * 10).toInt() / 10f,
                protein = (found.protein * scale * 10).toInt() / 10f,
                carbs = (found.carbs * scale * 10).toInt() / 10f,
                fat = (found.fat * scale * 10).toInt() / 10f,
                fiber = (found.fiber * scale * 10).toInt() / 10f,
                sugar = found.sugar?.let { (it * scale * 10).toInt() / 10f },
                sodium = found.sodium?.let { (it * scale * 10).toInt() / 10f }
            )
        }
        return found
    }
}
