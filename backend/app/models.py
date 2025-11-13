"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Literal


class VisualizationRequest(BaseModel):
    """Request model for generating visualizations"""

    topic: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="The topic to visualize",
        examples=["Binary Search Tree", "How photosynthesis works", "Merge Sort algorithm"],
    )


class VisualComponent(BaseModel):
    """Individual visual element in the visualization"""

    id: str = Field(..., description="Unique identifier for this component")
    type: str = Field(..., description="Type of visual element (node, edge, shape, text)")
    properties: Dict[str, Any] = Field(
        default_factory=dict, description="Visual properties (position, color, size, etc.)"
    )
    content: Optional[str] = Field(None, description="Text content if applicable")
    connections: List[str] = Field(
        default_factory=list, description="IDs of connected components"
    )


class AnimationStep(BaseModel):
    """Single step in an animation sequence"""

    step_number: int = Field(..., ge=0, description="Step number in sequence")
    description: str = Field(..., description="Explanation of what happens in this step")
    duration: float = Field(default=1.0, ge=0.1, le=10.0, description="Duration in seconds")
    changes: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Changes to apply (element IDs and property updates)",
    )
    highlight: List[str] = Field(
        default_factory=list, description="Component IDs to highlight"
    )


class InteractiveElement(BaseModel):
    """Interactive control for the visualization"""

    id: str = Field(..., description="Unique identifier")
    type: Literal["button", "slider", "toggle", "input"] = Field(
        ..., description="Type of interactive element"
    )
    label: str = Field(..., description="Display label")
    action: str = Field(..., description="Action to perform when interacted with")
    properties: Dict[str, Any] = Field(default_factory=dict, description="Additional properties")


class VisualizationResponse(BaseModel):
    """Response model containing the generated visualization"""

    success: bool = Field(default=True, description="Whether generation was successful")
    topic: str = Field(..., description="Original topic requested")
    title: str = Field(..., description="Display title for the visualization")
    description: str = Field(..., description="Brief explanation of the concept")
    visualization_type: Literal[
        "tree", "graph", "flowchart", "animation", "comparison", "timeline", "process"
    ] = Field(..., description="Type of visualization")
    components: List[VisualComponent] = Field(
        default_factory=list, description="Visual elements to render"
    )
    steps: List[AnimationStep] = Field(
        default_factory=list, description="Animation steps in sequence"
    )
    interactive_elements: List[InteractiveElement] = Field(
        default_factory=list, description="Interactive controls"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Additional metadata (difficulty, category, etc.)"
    )


class ErrorResponse(BaseModel):
    """Error response model"""

    success: bool = Field(default=False)
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")


class HealthResponse(BaseModel):
    """Health check response"""

    status: str = Field(default="healthy")
    version: str = Field(default="1.0.0")
    ai_provider: str = Field(..., description="Currently configured AI provider")


# Portfolio Architect Models
class ResumeParseRequest(BaseModel):
    """Request model for parsing resume"""
    
    base64Data: str = Field(..., description="Base64 encoded resume file")
    mimeType: str = Field(..., description="MIME type of the file")


class PortfolioLink(BaseModel):
    """Portfolio social link"""
    
    name: str = Field(..., description="Link name (e.g., GitHub, LinkedIn)")
    url: str = Field(..., description="URL of the link")


class PortfolioExperience(BaseModel):
    """Portfolio work experience"""
    
    role: str = Field(..., description="Job role/title")
    company: str = Field(..., description="Company name")
    startDate: str = Field(..., description="Start date (e.g., 'June 2020')")
    endDate: str = Field(..., description="End date or 'Present'")
    description: str = Field(..., description="Job description and achievements")


class PortfolioProject(BaseModel):
    """Portfolio project"""
    
    name: str = Field(..., description="Project name")
    description: str = Field(..., description="Project description")
    technologies: List[str] = Field(..., description="Technologies used")
    demoUrl: Optional[str] = Field(None, description="Live demo URL")
    sourceUrl: Optional[str] = Field(None, description="Source code URL")


class PortfolioDataResponse(BaseModel):
    """Response model for parsed portfolio data"""
    
    name: str = Field(..., description="Candidate's full name")
    title: str = Field(..., description="Professional title")
    summary: str = Field(..., description="Professional summary")
    email: str = Field(..., description="Email address")
    imageUrl: Optional[str] = Field(None, description="Profile picture URL")
    links: List[PortfolioLink] = Field(..., description="Social/professional links")
    skills: List[str] = Field(..., description="Technical skills")
    experience: List[PortfolioExperience] = Field(..., description="Work experience")
    projects: List[PortfolioProject] = Field(..., description="Projects")
