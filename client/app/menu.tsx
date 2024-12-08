import Ionicons from "@expo/vector-icons/Ionicons";
import { useGlobalSearchParams, Link } from "expo-router";
import { useState, useEffect } from 'react';
import { Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import MenuItem from "@/components/MenuItemCard";





export default function Menu() {
  const [menuData, setMenuData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useGlobalSearchParams();
  let images = params.imageList;
  
  const navigation = useNavigation();

navigation.setOptions({
  headerLeft: () => (
    <Link href="/(tabs)">
      <Ionicons name="home" size={24} color="#333" />
    </Link>
  ),
});
  
    
   
  
    const fetchMenuData = async () => {
      if (!images) {
        return;
      }
      
      let imageList: any[] = await Promise.all((images as string).split(",").map(async (image: string) => {
        return {
          "type": "image_url",
          "image_url": {
            "url": image,
          },
        };
      }));
      
      
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      
      try {
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                "role": "system",
                "content": [
                  {
                    "type": "text",
                    "text": `please create a json object with a property called name, being the name of the restaurant and a property called menu, listing every menu item according to this schema:\nconst menuItemSchema = new Schema({\n    menu_item_id: { type: Number, required: true, unique: true },\n    menu_id: { type: Number, required: true, ref: '\''Menu'\'' },\n    item_name: { type: String, required: true },\n    category: { type: String },\n    course: { type: String },\n    item_fulfilled_filters: [String],\n    item_price: { type: Number }\n});\nfilters should come from the following list and be assigned based on what the menu item is:\n\n 
                    Vegetarian – No meat, fish, or poultry.
Vegan – No animal products, including meat, dairy, eggs, or honey.
Gluten-Free – No wheat, barley, rye, or oats (unless certified gluten-free).
Lactose-Free – No dairy products containing lactose.
Nut-Free – No peanuts or tree nuts.
Soy-Free – No soy products.
Egg-Free – No eggs or egg-based products.
Keto/Low-Carb – High fat, very low carb diet.
Paleo – Focuses on whole foods, excluding grains, legumes, and processed foods.
Halal – Foods that meet Islamic dietary laws (no pork, alcohol, etc.).
Kosher – Foods prepared in compliance with Jewish dietary laws.
Low-Sodium – Minimal salt in foods.
Low-Fat – Reduced fat content.
Diabetic-Friendly – Foods that maintain stable blood sugar levels.
Allergen-Free – Avoidance of specific allergens (e.g., shellfish, sesame, etc.).
Main Ingredients
Proteins:
Chicken
Beef
Pork
Fish (e.g., salmon, tuna)
Shellfish (e.g., shrimp, crab)
Tofu/Tempeh
Beans/Legumes (e.g., lentils, chickpeas)
Eggs
Grains & Starches:
Rice (white, brown, jasmine, etc.)
Pasta (including gluten-free varieties)
Quinoa
Potatoes (sweet, white, etc.)
Bread (including gluten-free options)
Oats
Vegetables:
Leafy Greens (e.g., spinach, kale)
Root Vegetables (e.g., carrots, beets)
Cruciferous (e.g., broccoli, cauliflower)
Nightshades (e.g., tomatoes, eggplants)
Fruits:
Citrus (e.g., oranges, lemons)
Berries (e.g., strawberries, blueberries)
Tropical (e.g., mango, pineapple)
Apples, pears, etc.
Dairy:
Milk (regular, almond, soy, oat)
Cheese
Yogurt (dairy and non-dairy)
Spices & Condiments:
Herbs (e.g., basil, thyme, cilantro)
Spices (e.g., paprika, cumin, turmeric)
Sauces (e.g., soy sauce, ketchup, mustard)
Other Filters
By Taste Profile:
Savory
Sweet
Spicy
Sour
Umami
By Health Goals:
Healthy/Low-Calorie
High-Protein
High-Fiber
Low-Carb
Low-Sugar
By Cooking Method:
Baked
Grilled
Fried
Steamed
Raw
By Cuisine:
Italian
Indian
Mexican
Chinese
Middle Eastern
Mediterranean
Occasion:
Quick Meals
Meal Prep
Festive/Party
Comfort Food
Kid-Friendly
By Type of Dish:
Appetizer
Main Course
Side Dish
Snack
Dessert
By Food Temperature:
Hot
Cold
Room Temperature`
                  }
                ]
              },
              {
                role: "user",
                content: imageList,
              },
            ],
            response_format: {
              type: "json_object",
            },
        }),
        });
        const data = await response.json();
        
        setMenuData(JSON.parse(data.choices[0].message.content).menu);
        
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    useEffect(() => {
      const fetchMenuDataAsync = async () => {
        await fetchMenuData();
        setLoading(false);
        
      };
      fetchMenuDataAsync();
    }, [images]);
  
     console.log("state:",JSON.stringify(menuData, null, 2));
  

  // Render your menu data here
  return (
    <ScrollView>
    {loading && <Ionicons name="hourglass-outline" size={48} color="blue"></Ionicons> && <Text>Loading...</Text> 
    ||menuData == null && <Ionicons name="close-circle" size={48} color="red"></Ionicons> && <Text>No menu data</Text>
    || menuData && <Ionicons name="checkmark-circle" size={48} color="green"></Ionicons> && <Text>Menu created</Text>  }
    
    { menuData && menuData.map((item: any) => {
      return <MenuItem key={item.menu_item_id} itemName={item.item_name} price={item.item_price} category={item.category} course={item.course} fulfilledFilters={item.item_fulfilled_filters} />;
    })}
    </ScrollView>
  );
}