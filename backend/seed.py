import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from restaurants.models import Category, Restaurant, MenuItem

def seed():
    # Clear existing
    Category.objects.all().delete()
    Restaurant.objects.all().delete()
    MenuItem.objects.all().delete()

    print("Seeding Categories...")
    cats = [
        Category.objects.create(name='Biryani', image_url='https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80'),
        Category.objects.create(name='Pizzas', image_url='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80'),
        Category.objects.create(name='Burgers', image_url='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'),
        Category.objects.create(name='Chinese', image_url='https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80'),
        Category.objects.create(name='South Indian', image_url='https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=80'),
        Category.objects.create(name='Desserts', image_url='https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80'),
        Category.objects.create(name='North Indian', image_url='https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80')
    ]

    print("Seeding Restaurants...")
    restaurants_data = [
        ("Meghana Foods", 4.6, "35-45 mins", 200, 600, "Biryani, Andhra", "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80"),
        ("Truffles", 4.4, "25-30 mins", 150, 500, "Burgers, American, Desserts", "https://images.unsplash.com/photo-1586816001966-79b736744398?w=500&q=80"),
        ("Domino's Pizza", 4.1, "30 mins", 0, 400, "Pizzas, Fast Food", "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&q=80"),
        ("Empire Restaurant", 4.3, "40-50 mins", 250, 700, "North Indian, Biryani", "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80"),
        ("Leon's Burgers", 4.5, "20-30 mins", 100, 350, "Burgers, Beverages", "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80"),
        ("Mainland China", 4.7, "45-55 mins", 300, 1200, "Chinese, Asian", "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80"),
        ("A2B - Adyar Ananda Bhavan", 4.2, "30-40 mins", 150, 300, "South Indian, Sweets", "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=80"),
        ("Polar Bear", 4.6, "15-25 mins", 100, 250, "Desserts, Ice Cream", "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80"),
        ("KFC", 4.0, "20-30 mins", 0, 500, "American, Fast Food", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80"),
        ("Corner House", 4.8, "25-35 mins", 0, 300, "Desserts", "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80")
    ]

    restaurants = []
    for data in restaurants_data:
        r = Restaurant.objects.create(
            name=data[0], rating=data[1], delivery_time=data[2],
            min_order=data[3], cost_for_two=data[4], tags=data[5], image_url=data[6]
        )
        restaurants.append(r)

    print("Seeding Menu Items...")
    # Add many items to Meghana Foods
    MenuItem.objects.create(restaurant=restaurants[0], name="Chicken Boneless Biryani", price=360, is_veg=False, category=cats[0], image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[0], name="Mutton Biryani", price=420, is_veg=False, category=cats[0], image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[0], name="Paneer Biryani", price=300, is_veg=True, category=cats[0], image_url="https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[0], name="Chicken 65", price=250, is_veg=False, category=cats[6], image_url="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200&q=80")
    
    # Truffles
    MenuItem.objects.create(restaurant=restaurants[1], name="All American Cheese Burger", price=280, is_veg=False, category=cats[2], image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[1], name="Crispy Veg Burger", price=190, is_veg=True, category=cats[2], image_url="https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[1], name="Ferrero Rocher Shake", price=220, is_veg=True, category=cats[5], image_url="https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&q=80")
    
    # Domino's
    MenuItem.objects.create(restaurant=restaurants[2], name="Farmhouse Pizza", price=450, is_veg=True, category=cats[1], image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[2], name="Pepperoni Pizza", price=550, is_veg=False, category=cats[1], image_url="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[2], name="Garlic Breadsticks", price=120, is_veg=True, category=cats[1], image_url="https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=200&q=80")
    
    # Empire
    MenuItem.objects.create(restaurant=restaurants[3], name="Empire Special Chicken Kebab", price=240, is_veg=False, category=cats[6], image_url="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[3], name="Butter Chicken", price=320, is_veg=False, category=cats[6], image_url="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[3], name="Garlic Naan", price=60, is_veg=True, category=cats[6], image_url="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=80")
    
    # Leon's Burgers
    MenuItem.objects.create(restaurant=restaurants[4], name="Leon's Classic Chicken Burger", price=250, is_veg=False, category=cats[2], image_url="https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[4], name="Peri Peri Fries", price=120, is_veg=True, category=cats[2], image_url="https://images.unsplash.com/photo-1576107232684-1279f390859f?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[4], name="Chilled Coke", price=60, is_veg=True, category=cats[2], image_url="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80")
    
    # Mainland China
    MenuItem.objects.create(restaurant=restaurants[5], name="Hakka Noodles", price=280, is_veg=True, category=cats[3], image_url="https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[5], name="Chilli Chicken", price=340, is_veg=False, category=cats[3], image_url="https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[5], name="Veg Spring Rolls", price=210, is_veg=True, category=cats[3], image_url="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&q=80")

    # A2B
    MenuItem.objects.create(restaurant=restaurants[6], name="Masala Dosa", price=110, is_veg=True, category=cats[4], image_url="https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[6], name="Idli Vada", price=80, is_veg=True, category=cats[4], image_url="https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[6], name="Filter Coffee", price=40, is_veg=True, category=cats[4], image_url="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80")

    # Polar Bear
    MenuItem.objects.create(restaurant=restaurants[7], name="Death by Chocolate", price=250, is_veg=True, category=cats[5], image_url="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[7], name="Vanilla Ice Cream", price=120, is_veg=True, category=cats[5], image_url="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&q=80")

    # KFC
    MenuItem.objects.create(restaurant=restaurants[8], name="Hot & Crispy Chicken", price=350, is_veg=False, category=cats[2], image_url="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[8], name="Classic Zinger Burger", price=199, is_veg=False, category=cats[2], image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80")

    # Corner House
    MenuItem.objects.create(restaurant=restaurants[9], name="Hot Chocolate Fudge", price=280, is_veg=True, category=cats[5], image_url="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80")
    MenuItem.objects.create(restaurant=restaurants[9], name="Brownie Sundae", price=210, is_veg=True, category=cats[5], image_url="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80")

    print("Seeding complete.")

if __name__ == '__main__':
    seed()

