from django.urls import path
from . import views

urlpatterns = [
    # System root
    path('', views.root_view),
    path('api/', views.root_view),
    path('api/v1/', views.root_view),
    path('api/v1/stats', views.stats_view),
    path('api/stats', views.stats_view),

    # Authentication
    path('api/v1/auth/login', views.login_view),
    path('api/v1/auth/register', views.register_view),
    path('api/auth/login', views.login_view),
    path('api/auth/register', views.register_view),

    # Dedicated AI Detection Engines
    path('api/v1/scan/phishing', views.scan_phishing_view),
    path('api/scan/phishing', views.scan_phishing_view),
    path('api/v1/scan/malware', views.scan_malware_view),
    path('api/scan/malware', views.scan_malware_view),
    path('api/v1/scan/deepfake', views.scan_deepfake_view),
    path('api/scan/deepfake', views.scan_deepfake_view),

    # Unified Threat Analysis
    path('api/v1/analyze/threat', views.analyze_threat_view),
    path('api/analyze/threat', views.analyze_threat_view),
    path('api/analyze-threat', views.analyze_threat_view),

    # Incidents & Forensics
    path('api/v1/incidents', views.get_incidents_view),
    path('api/incidents', views.get_incidents_view),
    path('api/v1/incidents/<str:incident_id>/', views.get_incident_detail_view),
    path('api/incidents/<str:incident_id>/', views.get_incident_detail_view),
    path('api/v1/incidents/<str:incident_id>/response', views.incident_response_view),
    path('api/incidents/<str:incident_id>/response', views.incident_response_view),

    # Threat Intel & IOCs
    path('api/v1/threat-intelligence', views.threat_intel_view),
    path('api/threat-intel', views.threat_intel_view),

    # AI Security Copilot
    path('api/v1/copilot', views.copilot_view),
    path('api/copilot', views.copilot_view),

    # Audit Logs & Live Telemetry
    path('api/v1/audit-logs', views.audit_logs_view),
    path('api/audit-logs', views.audit_logs_view),
    path('api/v1/live-monitor/stream', views.live_stream_view),
    path('api/live-stream', views.live_stream_view),
]
