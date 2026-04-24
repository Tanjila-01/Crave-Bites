from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Restaurant(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    rating = models.FloatField(default=0.0)
    delivery_time = models.CharField(max_length=50, help_text="e.g., '30-40 min'")
    min_order = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    cost_for_two = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    tags = models.CharField(max_length=255, help_text="Comma separated, e.g., 'Italian, Pizzas'")
    image_url = models.URLField(blank=True, null=True)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='menu_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, db_index=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_veg = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    image_url = models.URLField(blank=True, null=True)
    category = models.ForeignKey(Category, related_name='items', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"
