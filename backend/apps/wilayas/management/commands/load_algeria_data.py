import os
from django.core.management.base import BaseCommand, CommandError
from apps.wilayas.management.commands.import_dataset import Command as ImportDatasetCommand


class Command(BaseCommand):
    help = 'Load the Algeria dataset JSON into the database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file-path',
            default=os.path.join('backend', 'data', 'algeria_wander_data.json'),
            help='Path to the Algeria dataset JSON file.',
        )

    def handle(self, *args, **options):
        file_path = options['file_path']

        if not os.path.exists(file_path):
            raise CommandError(f'File not found: {file_path}')

        importer = ImportDatasetCommand()
        importer.stdout = self.stdout
        importer.stderr = self.stderr
        importer.style = self.style

        return importer.handle(*args, **{'file_path': file_path})
