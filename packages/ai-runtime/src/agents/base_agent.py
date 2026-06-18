"""Base agent class for all autonomous agents"""
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List, Optional
from enum import Enum
import uuid


class AgentStatus(str, Enum):
    """Agent execution status"""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    IDLE = "idle"


class AgentTask:
    """Represents a task for an agent to execute"""

    def __init__(
        self,
        task_id: Optional[str] = None,
        name: str = "",
        description: str = "",
        priority: int = 1,
        parameters: Optional[Dict[str, Any]] = None,
    ):
        self.task_id = task_id or str(uuid.uuid4())
        self.name = name
        self.description = description
        self.priority = priority
        self.parameters = parameters or {}
        self.created_at = datetime.utcnow()
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None
        self.status = AgentStatus.PENDING
        self.result: Optional[Any] = None
        self.error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "task_id": self.task_id,
            "name": self.name,
            "description": self.description,
            "priority": self.priority,
            "parameters": self.parameters,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "status": self.status.value,
            "result": self.result,
            "error": self.error,
        }


class BaseAgent(ABC):
    """Base class for all agents"""

    def __init__(self, agent_id: str, name: str, description: str = ""):
        self.agent_id = agent_id
        self.name = name
        self.description = description
        self.status = AgentStatus.IDLE
        self.memory: List[Dict[str, Any]] = []
        self.task_queue: List[AgentTask] = []
        self.completed_tasks: List[AgentTask] = []
        self.config: Dict[str, Any] = {}
        self.tools: Dict[str, callable] = {}

    @abstractmethod
    async def execute(self, task: AgentTask) -> Any:
        """Execute a task"""
        pass

    async def add_task(self, task: AgentTask) -> None:
        """Add a task to the queue"""
        self.task_queue.append(task)

    async def process_tasks(self) -> None:
        """Process all tasks in the queue"""
        while self.task_queue:
            task = self.task_queue.pop(0)
            await self.execute(task)
            self.completed_tasks.append(task)

    def add_memory(self, memory_entry: Dict[str, Any]) -> None:
        """Add entry to agent memory"""
        memory_entry["timestamp"] = datetime.utcnow().isoformat()
        self.memory.append(memory_entry)

    def get_memory(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieve recent memory entries"""
        return self.memory[-limit:]

    def register_tool(self, name: str, tool: callable) -> None:
        """Register a tool for the agent to use"""
        self.tools[name] = tool

    async def call_tool(self, tool_name: str, **kwargs) -> Any:
        """Call a registered tool"""
        if tool_name not in self.tools:
            raise ValueError(f"Tool {tool_name} not registered")
        return await self.tools[tool_name](**kwargs)

    def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "description": self.description,
            "status": self.status.value,
            "tasks_queued": len(self.task_queue),
            "tasks_completed": len(self.completed_tasks),
            "memory_entries": len(self.memory),
        }


class DataQualityAgent(BaseAgent):
    """Agent that monitors and improves data quality"""

    def __init__(self, agent_id: str):
        super().__init__(
            agent_id,
            "Data Quality Monitor",
            "Monitors data quality and detects issues"
        )

    async def execute(self, task: AgentTask) -> Any:
        """Execute data quality task"""
        self.status = AgentStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.status = AgentStatus.RUNNING

        try:
            result = await self._check_data_quality(task.parameters)
            task.result = result
            task.status = AgentStatus.SUCCESS
            self.add_memory({
                "type": "data_quality_check",
                "task_id": task.task_id,
                "result": result
            })
            return result
        except Exception as e:
            task.error = str(e)
            task.status = AgentStatus.FAILED
            self.add_memory({
                "type": "error",
                "task_id": task.task_id,
                "error": str(e)
            })
            return None
        finally:
            task.completed_at = datetime.utcnow()
            self.status = AgentStatus.IDLE

    async def _check_data_quality(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Check data quality for a dataset"""
        dataset_id = parameters.get("dataset_id")

        # Simulate quality checks
        issues = []

        # Check for missing values
        missing_threshold = parameters.get("missing_threshold", 0.1)
        if missing_threshold > 0:
            issues.append({
                "type": "missing_values",
                "severity": "warning",
                "description": f"Columns with >{missing_threshold*100}% missing values"
            })

        # Check for duplicates
        if parameters.get("check_duplicates", True):
            issues.append({
                "type": "duplicates",
                "severity": "warning",
                "description": "Potential duplicate rows detected"
            })

        # Check schema consistency
        if parameters.get("check_schema", True):
            issues.append({
                "type": "schema_drift",
                "severity": "info",
                "description": "Column types consistent with catalog"
            })

        return {
            "dataset_id": dataset_id,
            "checks_performed": [
                "missing_values",
                "duplicates",
                "schema_consistency",
                "outlier_detection"
            ],
            "issues_found": len(issues),
            "issues": issues,
            "quality_score": 0.85,
        }


class CostOptimizerAgent(BaseAgent):
    """Agent that optimizes query costs and resource usage"""

    def __init__(self, agent_id: str):
        super().__init__(
            agent_id,
            "Cost Optimizer",
            "Optimizes costs and resource usage"
        )

    async def execute(self, task: AgentTask) -> Any:
        """Execute cost optimization task"""
        self.status = AgentStatus.RUNNING
        task.started_at = datetime.utcnow()
        task.status = AgentStatus.RUNNING

        try:
            result = await self._optimize_costs(task.parameters)
            task.result = result
            task.status = AgentStatus.SUCCESS
            return result
        except Exception as e:
            task.error = str(e)
            task.status = AgentStatus.FAILED
            return None
        finally:
            task.completed_at = datetime.utcnow()
            self.status = AgentStatus.IDLE

    async def _optimize_costs(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze and optimize costs"""
        pipeline_id = parameters.get("pipeline_id")

        return {
            "pipeline_id": pipeline_id,
            "current_cost": 250.00,
            "estimated_optimized_cost": 150.00,
            "savings": 100.00,
            "savings_percentage": 40.0,
            "recommendations": [
                {
                    "type": "query_optimization",
                    "description": "Add missing index on join column",
                    "estimated_savings": 50.00
                },
                {
                    "type": "partitioning",
                    "description": "Partition large table by date",
                    "estimated_savings": 35.00
                },
                {
                    "type": "caching",
                    "description": "Cache frequently accessed views",
                    "estimated_savings": 15.00
                }
            ]
        }
