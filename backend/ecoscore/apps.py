"""
EcoScore app configuration
"""
from django.apps import AppConfig


class EcoscoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ecoscore'
    verbose_name = 'EcoScore'
    
    def ready(self):
        """Import signal handlers when the app is ready"""
        try:
            import ecoscore.signals
        except ImportError:
            pass