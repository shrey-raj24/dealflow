class PolicyEnforcerAgent:
    def route_workflow(self, risk_score: int):
        return "manager_review" if risk_score > 30 else "auto_approve"
