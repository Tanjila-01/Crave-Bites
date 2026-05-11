import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from restaurants.models import Category, Restaurant, MenuItem

def seed_data():
    print("Clearing old data...")
    Category.objects.all().delete()
    Restaurant.objects.all().delete()

    print("Creating Categories...")
    category_names = [
        "Pizza","Burger","North Indian","Chinese","Desserts",
        "South Indian","Fast Food","Beverages","Italian","Mexican","Middle Eastern"
    ]
    
    cat_urls = [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591", # Pizza
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", # Burger
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe", # North Indian
        "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0", # Chinese
        "https://images.unsplash.com/photo-1551024601-bec78aea704b", # Desserts
        "https://images.unsplash.com/photo-1589301760014-a929cdac6239", # South Indian
        "https://images.unsplash.com/photo-1512058564366-18510be2db19", # Fast Food
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf", # Beverages
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601", # Italian
        "https://images.unsplash.com/photo-1565299524944-cb1976d81447", # Mexican
        "https://images.unsplash.com/photo-1528892186981-d1c9ccfc6d8f"  # Middle Eastern
    ]

    cats = {name: Category.objects.create(name=name, image_url=cat_urls[i] + "?q=80&w=500&cat=1") for i, name in enumerate(category_names)}

    print("Creating Restaurants & Menu Items...")

    restaurants_data = [
        # Bangalore
        {"name": "Domino's Pizza", "city": "Bangalore", "tag": "Pizza"},
        {"name": "KFC", "city": "Bangalore", "tag": "Fast Food"},
        {"name": "Burger King", "city": "Bangalore", "tag": "Burger"},
        {"name": "Pizza Hut", "city": "Bangalore", "tag": "Pizza"},
        {"name": "Empire Restaurant", "city": "Bangalore", "tag": "North Indian"},
        {"name": "Meghana Foods", "city": "Bangalore", "tag": "South Indian"},
        {"name": "Truffles", "city": "Bangalore", "tag": "Burger"},
        {"name": "Starbucks", "city": "Bangalore", "tag": "Beverages"},
        {"name": "Subway", "city": "Bangalore", "tag": "Fast Food"},
        {"name": "California Burrito", "city": "Bangalore", "tag": "Mexican"},
        {"name": "McDonald's", "city": "Bangalore", "tag": "Burger"},
        {"name": "Beijing Bites", "city": "Bangalore", "tag": "Chinese"},
        {"name": "Leon Grill", "city": "Bangalore", "tag": "Fast Food"},
        {"name": "A2B", "city": "Bangalore", "tag": "South Indian"},
        {"name": "Corner House", "city": "Bangalore", "tag": "Desserts"},

        # Mumbai
        {"name": "Bademiya", "city": "Mumbai", "tag": "North Indian"},
        {"name": "Leopold Cafe", "city": "Mumbai", "tag": "Fast Food"},
        {"name": "Burger King", "city": "Mumbai", "tag": "Burger"},
        {"name": "KFC", "city": "Mumbai", "tag": "Fast Food"},
        {"name": "Pizza Hut", "city": "Mumbai", "tag": "Pizza"},
        {"name": "Starbucks", "city": "Mumbai", "tag": "Beverages"},
        {"name": "Subway", "city": "Mumbai", "tag": "Fast Food"},
        {"name": "Mainland China", "city": "Mumbai", "tag": "Chinese"},
        {"name": "Barbeque Nation", "city": "Mumbai", "tag": "North Indian"},

        # Delhi
        {"name": "Haldiram's", "city": "Delhi", "tag": "North Indian"},
        {"name": "Bikanervala", "city": "Delhi", "tag": "North Indian"},
        {"name": "Domino's", "city": "Delhi", "tag": "Pizza"},
        {"name": "KFC", "city": "Delhi", "tag": "Fast Food"},
        {"name": "Wow Momo", "city": "Delhi", "tag": "Chinese"},
        {"name": "Burger King", "city": "Delhi", "tag": "Burger"},
        {"name": "Starbucks", "city": "Delhi", "tag": "Beverages"},
        {"name": "Sagar Ratna", "city": "Delhi", "tag": "South Indian"},
        {"name": "Barbeque Nation", "city": "Delhi", "tag": "North Indian"},
    ]

    rest_images = [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836", # Plate of food
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", # Healthy food bowl
        "https://images.unsplash.com/photo-1493770348161-369560ae357d", # Cooking food
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327", # Food dish
        "https://images.unsplash.com/photo-1414235077428-33898dd1448c", # Gourmet plate
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", # BBQ food
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543", # Sandwich plate
        "https://images.unsplash.com/photo-1484723091792-c1fb5da03189", # Pizza flatlay
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", # Pizza and pasta
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187"  # Cake slice
    ]

    food_items = {
        "Pizza": [
            {"name": "Margherita Pizza", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Pizza_Margherita.jpg?width=500"},
            {"name": "Pepperoni Pizza", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Pepperoni_pizza.jpg?width=500"},
            {"name": "Farmhouse Pizza", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Vegetarian_pizza.jpg?width=500"},
            {"name": "Cheese Burst Pizza", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Cheese_pizza.jpg?width=500"},
            {"name": "BBQ Chicken Pizza", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/BBQ_chicken_pizza.jpg?width=500"}
        ],
        "Burger": [
            {"name": "Whopper Burger", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Whopper.jpg?width=500"},
            {"name": "Chicken Burger", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken_sandwich.jpg?width=500"},
            {"name": "Veggie Burger", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Veggie_burger.jpg?width=500"},
            {"name": "Cheese Burger", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Cheeseburger.jpg?width=500"},
            {"name": "Double Patty Burger", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Double_cheeseburger.jpg?width=500"}
        ],
        "North Indian": [
            {"name": "Butter Chicken", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Butter_chicken.jpg?width=500"},
            {"name": "Paneer Tikka Masala", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Paneer_tikka_masala.jpg?width=500"},
            {"name": "Dal Makhani", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Dal_Makhani.jpg?width=500"},
            {"name": "Garlic Naan", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Garlic_naan.jpg?width=500"},
            {"name": "Tandoori Roti", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Tandoori_roti.jpg?width=500"}
        ],
        "Chinese": [
            {"name": "Hakka Noodles", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Hakka_noodles.jpg?width=500"},
            {"name": "Manchurian", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Gobi_Manchurian.jpg?width=500"},
            {"name": "Fried Rice", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Fried_rice.jpg?width=500"},
            {"name": "Chilli Chicken", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Chilli_chicken.jpg?width=500"},
            {"name": "Spring Rolls", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Spring_rolls.jpg?width=500"}
        ],
        "Desserts": [
            {"name": "Chocolate Cake", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Chocolate_cake.jpg?width=500"},
            {"name": "Ice Cream Sundae", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Ice_cream_sundae.jpg?width=500"},
            {"name": "Brownie", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Chocolate_brownie.jpg?width=500"},
            {"name": "Cheesecake", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Cheesecake.jpg?width=500"},
            {"name": "Gulab Jamun", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Gulab_jamun.jpg?width=500"}
        ],
        "South Indian": [
            {"name": "Masala Dosa", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Masala_dosa.jpg?width=500"},
            {"name": "Idli Sambar", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Idli_sambar.jpg?width=500"},
            {"name": "Medu Vada", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Medu_vada.jpg?width=500"},
            {"name": "Uttapam", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Uttapam.jpg?width=500"},
            {"name": "Filter Coffee", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_filter_coffee.jpg?width=500"}
        ],
        "Fast Food": [
            {"name": "French Fries", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/French_fries.jpg?width=500"},
            {"name": "Chicken Wings", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Buffalo_wings.jpg?width=500"},
            {"name": "Garlic Bread", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Garlic_bread.jpg?width=500"},
            {"name": "Popcorn Chicken", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Popcorn_chicken.jpg?width=500"},
            {"name": "Nachos", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Nachos.jpg?width=500"}
        ],
        "Beverages": [
            {"name": "Cold Coffee", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Iced_coffee.jpg?width=500"},
            {"name": "Iced Tea", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Iced_tea.jpg?width=500"},
            {"name": "Mango Shake", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Mango_shake.jpg?width=500"},
            {"name": "Coca Cola", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Coca-Cola.jpg?width=500"},
            {"name": "Fresh Lime Soda", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Limeade.jpg?width=500"}
        ],
        "Italian": [
            {"name": "Pasta Alfredo", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Fettuccine_Alfredo.jpg?width=500"},
            {"name": "Spaghetti Bolognese", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Spaghetti_Bolognese.jpg?width=500"},
            {"name": "Lasagna", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Lasagne.jpg?width=500"},
            {"name": "Risotto", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Risotto.jpg?width=500"},
            {"name": "Tiramisu", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Tiramisu.jpg?width=500"}
        ],
        "Mexican": [
            {"name": "Tacos", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Tacos.jpg?width=500"},
            {"name": "Burrito Bowl", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Burrito_bowl.jpg?width=500"},
            {"name": "Quesadilla", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Quesadilla.jpg?width=500"},
            {"name": "Fajitas", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Fajitas.jpg?width=500"},
            {"name": "Churros", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Churros.jpg?width=500"}
        ],
        "Middle Eastern": [
            {"name": "Chicken Shawarma", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Shawarma.jpg?width=500"},
            {"name": "Falafel Wrap", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Falafel.jpg?width=500"},
            {"name": "Hummus Pita", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Hummus.jpg?width=500"},
            {"name": "Mutton Kebab", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Seekh_kebab.jpg?width=500"},
            {"name": "Baklava", "image": "https://commons.wikimedia.org/wiki/Special:FilePath/Baklava.jpg?width=500"}
        ]
    }

    for i, data in enumerate(restaurants_data):
        print(f"Creating restaurant: {data['name']} in {data['city']}")
        r = Restaurant.objects.create(
            name=data['name'],
            description=f"Best {data['tag']} in {data['city']}",
            address=f"Main Street, {data['city']}",
            phone_number="1800-111-2222",
            rating=round(random.uniform(3.5, 5.0), 1),
            delivery_time=f"{random.randint(15, 45)} min",
            min_order=random.choice([99, 149, 199]),
            cost_for_two=random.choice([300, 400, 500, 800]),
            tags=data['tag'],
            image_url=rest_images[i % len(rest_images)] + "?q=80&w=500",
            is_open=True,
            city=data['city']
        )

        items_for_tag = food_items.get(data['tag'], food_items["Fast Food"])
        for item_data in items_for_tag:
            is_veg = random.choice([True, False])
            # Force desserts and beverages to be veg mostly
            if data['tag'] in ['Desserts', 'Beverages', 'South Indian']:
                is_veg = True
                
            MenuItem.objects.create(
                restaurant=r,
                name=item_data["name"],
                description=f"Delicious {item_data['name']}",
                price=random.randint(99, 499),
                is_veg=is_veg,
                category=cats[data['tag']],
                image_url=item_data["image"]
            )

    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    print("Creating Users...")
    User.objects.filter(username__in=['admin', 'testuser']).delete()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(username='admin', email='admin@cravebites.com', password='adminpassword')
    if not User.objects.filter(username='testuser').exists():
        User.objects.create_user(username='testuser', email='test@cravebites.com', password='password123')
    print("Test users ensured: 'admin':'adminpassword' and 'testuser':'password123'")

    print("FULL DATABASE SEEDED SUCCESSFULLY!")


if __name__ == "__main__":
    seed_data()