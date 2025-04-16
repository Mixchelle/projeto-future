from .models import MaturityAssessment, SecurityControl
from django.db.models import Avg

def calculate_maturity_results():
    results = (
        MaturityAssessment.objects
        .values("control__id", "control__name")
        .annotate(average_maturity=Avg("score"))
    )
    return [
        {
            "control_id": result["control__id"],
            "control_name": result["control__name"],
            "average_maturity": round(result["average_maturity"], 2),
        }
        for result in results
    ]
