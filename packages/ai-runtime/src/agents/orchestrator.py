"""Multi-agent orchestrator for coordinating autonomous agents"""
from typing import Any, Dict, List, Optional
from enum import Enum
import asyncio
from datetime import datetime


class AgentRole(str, Enum):
    """Role of an agent in the system"""
    DATA_QUALITY = "data_quality"
    COST_OPTIMIZER = "cost_optimizer"
    TRANSFORMER = "transformer"
    MONITOR = "monitor"
    SCHEDULER = "scheduler"


class MultiAgentOrchestrator:
    """Orchestrates multiple autonomous agents"""

    def __init__(self):
        self.agents: Dict[str, Any] = {}
        self.execution_log: List[Dict[str, Any]] = []
        self.task_assignments: Dict[str, List[str]] = {}

    def register_agent(self, agent: Any) -> None:
        """Register an agent with the orchestrator"""
        self.agents[agent.agent_id] = agent
        self.task_assignments[agent.agent_id] = []

    async def delegate_task(
        self,
        task: Any,
        role_preference: Optional[AgentRole] = None
    ) -> str:
        """Delegate a task to the most suitable agent"""
        # Find suitable agent
        suitable_agents = self._find_suitable_agents(task, role_preference)

        if not suitable_agents:
            raise ValueError("No suitable agent found for task")

        # Select agent with lowest load
        selected_agent = min(suitable_agents, key=lambda a: len(self.task_assignments[a]))

        # Assign task
        await self.agents[selected_agent].add_task(task)
        self.task_assignments[selected_agent].append(task.task_id)

        # Log execution
        self._log_execution({
            "timestamp": datetime.utcnow().isoformat(),
            "task_id": task.task_id,
            "assigned_to": selected_agent,
            "status": "assigned"
        })

        return selected_agent

    async def execute_tasks(self) -> Dict[str, Any]:
        """Execute tasks for all agents in parallel"""
        tasks = []
        for agent in self.agents.values():
            tasks.append(agent.process_tasks())

        await asyncio.gather(*tasks)

        return self._get_execution_summary()

    def _find_suitable_agents(
        self,
        task: Any,
        role_preference: Optional[AgentRole] = None
    ) -> List[str]:
        """Find agents suitable for a task"""
        suitable = []

        for agent_id, agent in self.agents.items():
            # Check if agent can handle task type
            if hasattr(task, 'task_type'):
                if self._can_handle(agent, task.task_type):
                    suitable.append(agent_id)
            else:
                suitable.append(agent_id)

        return suitable

    def _can_handle(self, agent: Any, task_type: str) -> bool:
        """Check if agent can handle task type"""
        # Simple capability matching
        agent_name = agent.name.lower()
        task_lower = task_type.lower()

        if "quality" in agent_name and "quality" in task_lower:
            return True
        if "cost" in agent_name and "cost" in task_lower:
            return True
        if "transform" in agent_name and "transform" in task_lower:
            return True

        return True  # Default: any agent can handle

    def _log_execution(self, log_entry: Dict[str, Any]) -> None:
        """Log task execution"""
        self.execution_log.append(log_entry)

    def _get_execution_summary(self) -> Dict[str, Any]:
        """Get summary of executions"""
        total_tasks = sum(len(tasks) for tasks in self.task_assignments.values())

        return {
            "total_agents": len(self.agents),
            "total_tasks_executed": total_tasks,
            "agent_status": {
                agent_id: agent.get_status()
                for agent_id, agent in self.agents.items()
            },
            "recent_executions": self.execution_log[-10:]
        }

    def get_agent_metrics(self, agent_id: str) -> Dict[str, Any]:
        """Get metrics for a specific agent"""
        if agent_id not in self.agents:
            raise ValueError(f"Agent {agent_id} not found")

        agent = self.agents[agent_id]

        return {
            "agent_id": agent_id,
            "status": agent.get_status(),
            "memory_entries": len(agent.memory),
            "recent_memory": agent.get_memory(5),
            "completed_tasks": len(agent.completed_tasks),
        }

    def get_system_health(self) -> Dict[str, Any]:
        """Get overall system health"""
        agent_statuses = [agent.status.value for agent in self.agents.values()]

        return {
            "total_agents": len(self.agents),
            "agents_running": sum(1 for s in agent_statuses if s == "running"),
            "agents_idle": sum(1 for s in agent_statuses if s == "idle"),
            "total_executions": len(self.execution_log),
            "execution_success_rate": self._calculate_success_rate(),
        }

    def _calculate_success_rate(self) -> float:
        """Calculate task success rate"""
        if not self.execution_log:
            return 0.0

        successful = sum(
            1 for log in self.execution_log
            if log.get("status") == "success"
        )

        return successful / len(self.execution_log)
