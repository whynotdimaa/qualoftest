from django.db import migrations
from django.utils.text import slugify
import uuid


def generate_unique_slug(model, value):
    base_slug = slugify(value, allow_unicode=True) or str(uuid.uuid4())[:8]
    slug = base_slug
    counter = 1
    while model.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def fill_blank_slugs(apps, schema_editor):
    Category = apps.get_model('main', 'Category')
    Post = apps.get_model('main', 'Post')

    for category in Category.objects.filter(slug=''):
        category.slug = generate_unique_slug(Category, category.name)
        category.save()

    for post in Post.objects.filter(slug=''):
        post.slug = generate_unique_slug(Post, post.title)
        post.save()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_category_id_alter_post_id'),
    ]

    operations = [
        migrations.RunPython(fill_blank_slugs, migrations.RunPython.noop),
    ]
