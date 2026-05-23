from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='external_image_url',
            field=models.URLField(blank=True, help_text='Cloudinary or external image URL', null=True),
        ),
        migrations.AddField(
            model_name='place',
            name='cuisine',
            field=models.CharField(blank=True, help_text='e.g. Algerian, Mediterranean', max_length=100),
        ),
        migrations.AddField(
            model_name='place',
            name='price_range',
            field=models.CharField(blank=True, help_text='e.g. $, $$, $$$', max_length=10),
        ),
        migrations.AddField(
            model_name='place',
            name='must_try',
            field=models.TextField(blank=True, help_text='Recommended dishes, comma-separated'),
        ),
        migrations.AddField(
            model_name='place',
            name='stars',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='place',
            name='highlights',
            field=models.TextField(blank=True, help_text='Key amenities/highlights, comma-separated'),
        ),
        migrations.AddField(
            model_name='place',
            name='opening_hours',
            field=models.CharField(blank=True, help_text='e.g. Daily 9:00-17:00', max_length=255),
        ),
        migrations.AddField(
            model_name='place',
            name='practical_info',
            field=models.TextField(blank=True, help_text='Visitor information and tips'),
        ),
    ]
