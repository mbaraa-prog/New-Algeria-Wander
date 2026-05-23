from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wilayas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='wilaya',
            name='tagline',
            field=models.CharField(blank=True, help_text='e.g. The White City on the Mediterranean', max_length=255),
        ),
    ]
