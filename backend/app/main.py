"""
Main FastAPI application for Visual Learning Platform
"""
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.models import (
    VisualizationRequest,
    VisualizationResponse,
    ErrorResponse,
    HealthResponse,
)
from app.ai_service import get_ai_service

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown events"""
    # Startup
    logger.info("Starting Visual Learning Platform API")
    logger.info(f"AI Provider: {settings.ai_provider}")
    logger.info(f"CORS Origins: {settings.cors_origins_list}")

    # Initialize AI service
    try:
        get_ai_service()
        logger.info("AI Service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize AI service: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down Visual Learning Platform API")


# Create FastAPI app
app = FastAPI(
    title="Visual Learning Platform API",
    description="AI-powered API for generating interactive educational visualizations",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# Add rate limit handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            details=str(exc) if settings.debug else None,
        ).model_dump(),
    )


# Routes
@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "message": "Visual Learning Platform API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/health",
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        ai_provider=settings.ai_provider,
    )


@app.post(
    "/api/generate-visualization",
    response_model=VisualizationResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        429: {"model": ErrorResponse, "description": "Rate limit exceeded"},
        500: {"model": ErrorResponse, "description": "Server error"},
    },
)
@limiter.limit(f"{settings.max_requests_per_minute}/minute")
async def generate_visualization(request: Request, body: VisualizationRequest):
    """
    Generate an interactive visualization for a given topic

    This endpoint uses AI (OpenAI GPT or Anthropic Claude) to analyze the topic
    and generate a structured visualization with components, animations, and
    interactive elements.

    Rate limit: 10 requests per minute per IP address
    """
    try:
        logger.info(f"Received visualization request for topic: {body.topic}")

        # Get AI service
        ai_service = get_ai_service()

        # Generate visualization
        visualization = await ai_service.generate_visualization(body.topic)

        logger.info(
            f"Successfully generated visualization for: {body.topic} "
            f"(type: {visualization.visualization_type})"
        )

        return visualization

    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Error generating visualization: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(
                error="Failed to generate visualization",
                details=str(e) if settings.debug else None,
            ).model_dump(),
        )


@app.get("/api/examples", response_model=dict)
async def get_examples():
    """Get example topics for software engineering and computer science learning"""
    return {
        "examples": [
            {
                "category": "Data Structures",
                "topics": [
                    "Binary Search Tree",
                    "Hash Tables",
                    "Linked Lists",
                    "Stack and Queue",
                    "AVL Trees",
                ],
            },
            {
                "category": "Algorithms",
                "topics": [
                    "Merge Sort Algorithm",
                    "Quick Sort Algorithm",
                    "Depth-First Search",
                    "Breadth-First Search",
                    "Dijkstra's Algorithm",
                ],
            },
            {
                "category": "System Design",
                "topics": [
                    "Load Balancer Architecture",
                    "Database Sharding",
                    "Microservices Pattern",
                    "Caching Strategy (Redis)",
                    "Message Queue (Kafka)",
                ],
            },
            {
                "category": "Programming Concepts",
                "topics": [
                    "Object-Oriented Programming",
                    "Recursion vs Iteration",
                    "Big O Notation",
                    "Dynamic Programming",
                    "Memory Management",
                ],
            },
            {
                "category": "Web & Networks",
                "topics": [
                    "How DNS Works",
                    "HTTP Request Lifecycle",
                    "TCP/IP Protocol Stack",
                    "RESTful API Design",
                    "WebSocket Communication",
                ],
            },
            {
                "category": "AI & ML",
                "topics": [
                    "Neural Network Architecture",
                    "Convolutional Neural Networks",
                    "Decision Trees",
                    "K-Means Clustering",
                    "Gradient Descent",
                ],
            },
        ]
    }


@app.get("/api/bst-demo", response_class=HTMLResponse)
async def get_bst_demo():
    """
    Serve the interactive BST demo HTML page
    
    This is a fully functional Binary Search Tree visualizer with:
    - Interactive node insertion
    - Tree traversals (in-order, pre-order, post-order, level-order)
    - Visual animations
    - Example trees
    """
    try:
        static_dir = Path(__file__).parent / "static"
        bst_demo_path = static_dir / "bst_demo.html"
        
        if not bst_demo_path.exists():
            raise HTTPException(status_code=404, detail="BST demo file not found")
        
        with open(bst_demo_path, "r", encoding="utf-8") as f:
            html_content = f.read()
        
        return HTMLResponse(content=html_content, status_code=200)
    
    except Exception as e:
        logger.error(f"Error serving BST demo: {e}")
        raise HTTPException(status_code=500, detail="Failed to load BST demo")


@app.post("/api/chatbot", response_model=dict)
async def chatbot(request: Request, body: dict):
    """
    Interactive chatbot for answering questions about visualizations

    Provides contextual answers about data structures, algorithms, and concepts
    """
    try:
        message = body.get("message", "")
        context = body.get("context", {})

        logger.info(f"Chatbot question: {message} | Context: {context}")

        # Get AI service
        ai_service = get_ai_service()

        # Create a prompt for the chatbot
        system_prompt = """You are a helpful teaching assistant specializing in software engineering,
        computer science, data structures, algorithms, system design, and programming concepts.
        Provide clear, concise, educational answers. Use bullet points and examples when helpful.
        Keep responses under 200 words."""

        context_info = f"The user is currently viewing a {context.get('tree_type', 'tree')} " \
                      f"with {context.get('traversal', 'standard')} traversal." if context else ""

        full_prompt = f"{context_info}\n\nQuestion: {message}"

        # Generate response using AI
        if settings.ai_provider == "openai":
            response = ai_service.openai_client.chat.completions.create(
                model=ai_service.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_prompt},
                ],
                temperature=0.7,
                max_tokens=300,
            )
            answer = response.choices[0].message.content
        else:  # anthropic
            message_obj = ai_service.anthropic_client.messages.create(
                model=ai_service.model,
                max_tokens=300,
                temperature=0.7,
                system=system_prompt,
                messages=[{"role": "user", "content": full_prompt}],
            )
            answer = "".join([block.text for block in message_obj.content if hasattr(block, "text")])

        return {"response": answer}

    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return {
            "response": "I'm having trouble processing that question. Try asking about:\n"
                       "• Time/space complexity\n"
                       "• Tree operations\n"
                       "• Use cases\n"
                       "• Comparison with other structures"
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info",
    )
