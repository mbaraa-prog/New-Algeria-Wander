from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='period',
            field=models.CharField(blank=True, help_text='e.g. March 15-22, Summer Season', max_length=50),
        ),
        migrations.AddField(
            model_name='event',
            name='external_image_url',
            field=models.URLField(blank=True, help_text='Cloudinary or external image URL', null=True),
        ),
    ]
