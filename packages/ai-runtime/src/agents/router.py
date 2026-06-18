"""Smart task routing for multi-agent system"""
from typing import Any, Dict, Optional
from enum import Enum


class TaskType(str, Enum):
    """Types of tasks that can be routed"""
    DATA_QUALITY_CHECK = "data_quality_check"
    DATA_CLEANING = "data_cleaning"
    COST_ANALYSIS = "cost_analysis"
    TRANSFORMATION = "transformation"
    MONITORING = "monitoring"
    SCHEDULING = "scheduling"


class TaskPriority(str, Enum):
    """Task priority levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TaskRouter:
    """Routes tasks to appropriate agents based on type and priority"""

    def __init__(self):
        self.routing_rules: Dict[TaskType, str] = {}
        self.priority_weights: Dict[TaskPriority, int] = {
            TaskPriority.CRITICAL: 4,
            TaskPriority.HIGH: 3,
            TaskPriority.MEDIUM: 2,
            TaskPriority.LOW: 1,
        }

    def register_routing_rule(self, task_type: TaskType, agent_role: str) -> None:
        """Register routing rule for a task type"""
        self.routing_rules[task_type] = agent_role

    def route_task(
        self,
        task_type: TaskType,
        priority: TaskPriority = TaskPriority.MEDIUM,
        parameters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Route a task to appropriate agent"""
        agent_role = self.routing_rules.get(task_type)

        if not agent_role:
            # Default routing
            agent_role = self._default_route(task_type)

        return {
            "task_type": task_type.value,
            "agent_role": agent_role,
            "priority": priority.value,
            "priority_weight": self.priority_weights[priority],
            "parameters": parameters or {},
            "route_timestamp": __import__('datetime').datetime.utcnow().isoformat(),
        }

    def _default_route(self, task_type: TaskType) -> str:
        """Default routing when no rule is defined"""
        routing = {
            TaskType.DATA_QUALITY_CHECK: "data_quality",
            TaskType.DATA_CLEANING: "data_quality",
            TaskType.COST_ANALYSIS: "cost_optimizer",
            TaskType.TRANSFORMATION: "transformer",
            TaskType.MONITORING: "monitor",
            TaskType.SCHEDULING: "scheduler",
        }
        return routing.get(task_type, "general")

    def get_routing_table(self) -> Dict[str, str]:
        """Get current routing configuration"""
        return {
            task.value: role
            for task, role in self.routing_rules.items()
        }
