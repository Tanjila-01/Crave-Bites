import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from restaurants.models import Category, Restaurant, MenuItem


# ✅ IMAGE MAP (ALL UNIQUE)
IMAGE_MAP = {
    "Margherita Pizza": "https://images.unsplash.com/photo-1601924928586-6d1b3fbbf9f0",
    "Pepperoni Pizza": "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
    "Garlic Bread": "https://images.unsplash.com/photo-1619535860434-5c0b8b8b7a3d",
    "Choco Lava Cake": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    "Diet Coke": "https://images.unsplash.com/photo-1580910051074-3eb694886505",

    "Whopper Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    "Veggie Burger": "https://images.unsplash.com/photo-1550547660-d9450f859349",
    "French Fries": "https://images.unsplash.com/photo-1576107232684-1279f390859f",
    "Chicken Nuggets": "https://images.unsplash.com/photo-1606756790138-261d2b21cd59",
    "Chocolate Shake": "https://images.unsplash.com/photo-1577805947697-89e18249d767",

    "Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    "Paneer Tikka Masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
    "Garlic Naan": "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    "Samosa": "https://images.unsplash.com/photo-1601050690117-94f5f6fa0e8b",
    "Gulab Jamun": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0",

    "Kung Pao Chicken": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
    "Spring Rolls": "https://images.unsplash.com/photo-1601315488950-3b5047998b38",
    "Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    "Sweet and Sour Pork": "https://images.unsplash.com/photo-1625944525903-b2f1c0f4b1d1",
    "Wonton Soup": "https://images.unsplash.com/photo-1604908812875-8b8d5b0c1eaa",

    "Death by Chocolate": "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    "Vanilla Sundae": "https://images.unsplash.com/photo-1570197788417-0e82375c9371",
    "Strawberry Ice Cream": "https://images.unsplash.com/photo-1505253210343-0c7c9c8e1b1f",
    "Cheesecake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    "Coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93",

    "Masala Dosa": "https://images.unsplash.com/photo-1630409346824-4f0e7b080087",
    "Idli Sambar": "https://images.unsplash.com/photo-1626074353765-517a681e40be",
    "Medu Vada": "https://images.unsplash.com/photo-1626074353735-5d8c0b3e0f3b",
    "Filter Coffee": "https://images.unsplash.com/photo-1498804103079-a6351b050096",
    "Pongal": "https://images.unsplash.com/photo-1630409346707-c8b0c3f4b4a1",

    "Fried Chicken Bucket": "https://images.unsplash.com/photo-1562967916-eb82221dfb92",
    "Zinger Burger": "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
    "Popcorn Chicken": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
    "Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
    "Pepsi": "https://images.unsplash.com/photo-1586201375761-83865001e31c",

    "Greek Salad": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    "Caesar Salad": "https://images.unsplash.com/photo-1551248429-40975aa4de74",
    "Fresh Orange Juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
    "Avocado Toast": "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2",
    "Fruit Bowl": "https://images.unsplash.com/photo-1505252585461-04db1eb84625",

    "Cappuccino": "https://images.unsplash.com/photo-1511920170033-f8396924c348",
    "Iced Latte": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
    "Blueberry Muffin": "https://images.unsplash.com/photo-1604908554165-7c6c0f8a1e58",
    "Croissant": "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    "Brownie": "https://images.unsplash.com/photo-1599599810069-b541999978c4",

    "Spaghetti Bolognese": "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
    "Penne Arrabbiata": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
    "Pizza Romana": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
    "Italian Garlic Bread": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c",

    "Crunchy Taco": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    "Bean Burrito": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    "Nachos": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
    "Quesadilla": "https://images.unsplash.com/photo-1617196038435-68b2b5d9f1d3",
    "Churros": "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",

    "Chicken Shawarma": "https://images.unsplash.com/photo-1561651823-34feb02250e4",
    "Falafel": "https://images.unsplash.com/photo-1598515213692-5f1e1f6a5c8d",
    "Hummus with Pita": "https://images.unsplash.com/photo-1604909053197-7b63f1f6e9f0",
    "Mutton Kebab": "https://images.unsplash.com/photo-1544025162-d76694265947",
    "Baklava": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
}


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
        ("Domino's Pizza","Pizza",["Margherita Pizza","Pepperoni Pizza","Garlic Bread","Choco Lava Cake","Diet Coke"]),
        ("Burger King","Burger",["Whopper Burger","Veggie Burger","French Fries","Chicken Nuggets","Chocolate Shake"]),
        ("Indian Dhaba","North Indian",["Butter Chicken","Paneer Tikka Masala","Garlic Naan","Samosa","Gulab Jamun"]),
        ("Mainland China","Chinese",["Kung Pao Chicken","Spring Rolls","Fried Rice","Sweet and Sour Pork","Wonton Soup"]),
        ("Corner House","Desserts",["Death by Chocolate","Vanilla Sundae","Strawberry Ice Cream","Cheesecake","Coffee"]),
        ("Saravana Bhavan","South Indian",["Masala Dosa","Idli Sambar","Medu Vada","Filter Coffee","Pongal"]),
        ("KFC","Fast Food",["Fried Chicken Bucket","Zinger Burger","Popcorn Chicken","Fries","Pepsi"]),
        ("Fresh Salad Co","Italian",["Greek Salad","Caesar Salad","Fresh Orange Juice","Avocado Toast","Fruit Bowl"]),
        ("Starbucks","Beverages",["Cappuccino","Iced Latte","Blueberry Muffin","Croissant","Brownie"]),
        ("Little Italy","Italian",["Spaghetti Bolognese","Penne Arrabbiata","Tiramisu","Italian Garlic Bread","Pizza Romana"]),
        ("Taco Bell","Mexican",["Crunchy Taco","Bean Burrito","Nachos","Quesadilla","Churros"]),
        ("Al Amanah","Middle Eastern",["Chicken Shawarma","Falafel","Hummus with Pita","Mutton Kebab","Baklava"]),
    ]

    rest_urls = [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
        "https://images.unsplash.com/photo-1466978913421-bac2e104d3c8",
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        "https://images.unsplash.com/photo-1544148103-0773bf10d330",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f"
    ]

    for i, (rname, tag, items) in enumerate(restaurants_data):
        print(f"Creating restaurant {i+1}: {rname}")

        r = Restaurant.objects.create(
            name=rname,
            description="Delicious food",
            address="123 Food Street",
            phone_number="1800-000-0000",
            rating=4.5,
            delivery_time="30-40 min",
            min_order=150,
            cost_for_two=400,
            tags=tag,
            image_url=rest_urls[i] + "?q=80&w=500",
            is_open=True
        )

        for item in items:
            MenuItem.objects.create(
                restaurant=r,
                name=item,
                description=f"Delicious {item}",
                price=100,
                is_veg=True,
                category=cats[tag],
                image_url=IMAGE_MAP[item]
            )

    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    print("Creating Users...")
    User.objects.all().delete()
    User.objects.create_superuser(username='admin', email='admin@cravebites.com', password='adminpassword')
    User.objects.create_user(username='testuser', email='test@cravebites.com', password='password123')
    print("Test users created: 'admin':'adminpassword' and 'testuser':'password123'")

    print("🎉 FULL DATABASE SEEDED SUCCESSFULLY!")


if __name__ == "__main__":
    seed_data()