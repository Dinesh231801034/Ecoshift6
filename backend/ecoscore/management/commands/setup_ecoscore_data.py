"""
Management command to set up EcoScore data (ecoinvent processes and benchmarks)
"""
from django.core.management.base import BaseCommand
from ecoscore.mapping_data import create_ecoinvent_processes, create_benchmarks


class Command(BaseCommand):
    help = 'Set up EcoScore data including ecoinvent processes and benchmarks'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force update existing records',
        )

    def handle(self, *args, **options):
        self.stdout.write('Setting up EcoScore data...')
        
        # Create ecoinvent processes
        self.stdout.write('Creating ecoinvent processes...')
        created_processes, updated_processes = create_ecoinvent_processes()
        self.stdout.write(
            self.style.SUCCESS(
                f'Created {created_processes} new ecoinvent processes, '
                f'updated {updated_processes} existing processes'
            )
        )
        
        # Create benchmarks
        self.stdout.write('Creating benchmarks...')
        created_benchmarks, updated_benchmarks = create_benchmarks()
        self.stdout.write(
            self.style.SUCCESS(
                f'Created {created_benchmarks} new benchmarks, '
                f'updated {updated_benchmarks} existing benchmarks'
            )
        )
        
        self.stdout.write(
            self.style.SUCCESS('EcoScore data setup completed successfully!')
        )
