"""
AI Service for generating visualizations using OpenAI or Anthropic
"""
import json
import logging
from typing import Dict, Any, Optional
from openai import OpenAI
from anthropic import Anthropic
from app.config import settings
from app.models import VisualizationResponse

logger = logging.getLogger(__name__)


class AIService:
    """Service for generating visualizations using AI"""

    SYSTEM_PROMPT = """You are a visual learning assistant specialized in creating interactive, educational visualizations.

Your task: Given a topic, analyze it and create a structured visualization that helps users learn through interactive animations.

You MUST respond with ONLY valid JSON matching this structure (no markdown, no extra text):
{
    "success": true,
    "topic": "string (original topic)",
    "title": "string (display title)",
    "description": "string (2-3 sentence explanation)",
    "visualization_type": "tree|graph|flowchart|animation|comparison|timeline|process",
    "components": [
        {
            "id": "string (unique)",
            "type": "node|edge|shape|text|arrow",
            "properties": {
                "x": number (0-1000),
                "y": number (0-800),
                "width": number,
                "height": number,
                "color": "string (hex color)",
                "label": "string (optional)"
            },
            "content": "string (text content)",
            "connections": ["array of connected component IDs"]
        }
    ],
    "steps": [
        {
            "step_number": number,
            "description": "string (what happens)",
            "duration": number (seconds, 0.5-3.0),
            "changes": [
                {
                    "component_id": "string",
                    "property": "string",
                    "from": "any",
                    "to": "any"
                }
            ],
            "highlight": ["array of component IDs to highlight"]
        }
    ],
    "interactive_elements": [
        {
            "id": "string",
            "type": "button|slider|toggle|input",
            "label": "string",
            "action": "play|pause|reset|step_forward|step_back|speed_up|slow_down",
            "properties": {}
        }
    ],
    "metadata": {
        "difficulty": "beginner|intermediate|advanced",
        "category": "computer_science|biology|physics|math|history|other",
        "estimated_time": number (minutes),
        "key_concepts": ["array of strings"]
    }
}

Guidelines:
1. Choose the BEST visualization type for the topic
2. Keep it educational but engaging
3. Use 5-15 components (not too complex)
4. Create 3-8 animation steps that build understanding
5. Use clear, beginner-friendly language
6. Assign logical colors (e.g., green for success, red for errors, blue for data)
7. Position elements for clarity (spread them out with at least 150px spacing)
8. Make animations smooth (0.5-2 second durations)
9. IMPORTANT: For the "label" property, use SHORT text like numbers or single words (e.g., "50", "A", "Start")
10. Use "content" for longer descriptions (e.g., "Root Node (50)")
11. For trees/graphs: nodes should be 50-60px wide with clear spacing
12. Canvas is 1000x800px - use the full space, don't cluster in one corner
13. **CRITICAL FOR TREE VISUALIZATIONS**: Create animation steps that demonstrate tree traversal (in-order, pre-order, post-order, or level-order). Each step should highlight nodes in the traversal order, showing how the algorithm visits each node. For example, an in-order traversal visits left subtree → root → right subtree. Make sure the "highlight" array in each step contains the node IDs being visited in that order.

Examples of good topic-to-type mappings:
- "Binary Search Tree" → tree
- "How photosynthesis works" → process/flowchart
- "Merge Sort" → animation
- "Mitosis" → timeline
- "CPU vs GPU" → comparison
- "Neural Network" → graph

Respond with ONLY the JSON object. No markdown formatting, no explanations."""

    def __init__(self):
        """Initialize AI clients based on configuration"""
        self.provider = settings.ai_provider.lower()

        if self.provider == "openai":
            if not settings.openai_api_key:
                raise ValueError("OpenAI API key not configured")
            self.openai_client = OpenAI(api_key=settings.openai_api_key)
            self.model = settings.openai_model
            logger.info(f"Initialized OpenAI client with model: {self.model}")

        elif self.provider == "anthropic":
            if not settings.anthropic_api_key:
                raise ValueError("Anthropic API key not configured")
            self.anthropic_client = Anthropic(api_key=settings.anthropic_api_key)
            self.model = settings.anthropic_model
            logger.info(f"Initialized Anthropic client with model: {self.model}")

        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")

    async def generate_visualization(self, topic: str) -> VisualizationResponse:
        """
        Generate a visualization for the given topic using AI

        Args:
            topic: The topic to visualize

        Returns:
            VisualizationResponse object with structured visualization data

        Raises:
            Exception: If AI generation fails
        """
        try:
            logger.info(f"Generating visualization for topic: {topic}")

            if self.provider == "openai":
                response_data = await self._generate_with_openai(topic)
            elif self.provider == "anthropic":
                response_data = await self._generate_with_anthropic(topic)
            else:
                raise ValueError(f"Unsupported provider: {self.provider}")

            # Parse and validate response
            visualization = VisualizationResponse(**response_data)
            logger.info(
                f"Successfully generated {visualization.visualization_type} "
                f"visualization with {len(visualization.components)} components"
            )

            return visualization

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            raise Exception("AI returned invalid JSON response")

        except Exception as e:
            logger.error(f"Error generating visualization: {e}")
            raise Exception(f"Failed to generate visualization: {str(e)}")

    async def _generate_with_openai(self, topic: str) -> Dict[str, Any]:
        """Generate visualization using OpenAI GPT"""
        try:
            response = self.openai_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": f"Create a visualization for: {topic}"},
                ],
                temperature=0.7,
                max_tokens=4000,
            )

            content = response.choices[0].message.content
            if not content:
                raise Exception("Empty response from OpenAI")

            # Clean up potential markdown wrapping
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            elif content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            # Try to find JSON if there's text before/after
            if not content.startswith("{"):
                # Find first { and last }
                start = content.find("{")
                end = content.rfind("}")
                if start != -1 and end != -1:
                    content = content[start:end+1]

            return json.loads(content)

        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise

    async def _generate_with_anthropic(self, topic: str) -> Dict[str, Any]:
        """Generate visualization using Anthropic Claude"""
        try:
            message = self.anthropic_client.messages.create(
                model=self.model,
                max_tokens=4000,
                temperature=0.7,
                system=self.SYSTEM_PROMPT,
                messages=[{"role": "user", "content": f"Create a visualization for: {topic}"}],
            )

            # Extract text content
            content = ""
            for block in message.content:
                if hasattr(block, "text"):
                    content += block.text

            if not content:
                raise Exception("Empty response from Claude")

            # Claude might wrap JSON in markdown - clean it
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            return json.loads(content)

        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            raise


# Global AI service instance
ai_service: Optional[AIService] = None


def get_ai_service() -> AIService:
    """Get or create the global AI service instance"""
    global ai_service
    if ai_service is None:
        ai_service = AIService()
    return ai_service
