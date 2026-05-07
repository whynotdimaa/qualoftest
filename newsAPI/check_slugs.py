import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.main.models import Post

qs = Post.objects.filter(slug='')
print(qs.count())
print(list(qs.values('id', 'title', 'slug')[:20]))
