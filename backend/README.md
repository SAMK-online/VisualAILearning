# Visual Learning Platform - Backend API

FastAPI backend for AI-powered interactive educational visualizations.

## Features

- **AI-Powered Generation**: Uses OpenAI GPT-4 or Anthropic Claude to generate visualizations
- **RESTful API**: Clean, documented API endpoints
- **Rate Limiting**: Protects against abuse (10 requests/minute per IP)
- **CORS Enabled**: Ready for frontend integration
- **Type-Safe**: Full Pydantic validation
- **Production-Ready**: Structured logging, error handling, health checks

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Choose your AI provider
OPENAI_API_KEY=sk-your-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-key-here

AI_PROVIDER=openai  # or 'anthropic'
```

### 4. Run the Server

```bash
# Development mode (auto-reload)
python run.py

# Or using uvicorn directly
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## API Endpoints

### POST `/api/generate-visualization`

Generate an interactive visualization for a topic.

**Request Body:**
```json
{
  "topic": "Binary Search Tree"
}
```

**Response:**
```json
{
  "success": true,
  "topic": "Binary Search Tree",
  "title": "Binary Search Tree Visualization",
  "description": "A binary search tree is a data structure...",
  "visualization_type": "tree",
  "components": [...],
  "steps": [...],
  "interactive_elements": [...],
  "metadata": {...}
}
```

### GET `/api/examples`

Get example topics to inspire users.

### GET `/health`

Health check endpoint.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── config.py         # Configuration management
│   ├── models.py         # Pydantic models
│   └── ai_service.py     # AI integration (OpenAI/Claude)
├── requirements.txt       # Python dependencies
├── .env.example          # Environment template
├── .env                  # Your local config (gitignored)
├── run.py                # Development server
└── README.md
```

## Configuration

All configuration is managed through environment variables (see `.env.example`):

- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `AI_PROVIDER`: Which AI to use (`openai` or `anthropic`)
- `OPENAI_MODEL`: OpenAI model (default: `gpt-4`)
- `ANTHROPIC_MODEL`: Claude model (default: `claude-3-5-sonnet-20241022`)
- `MAX_REQUESTS_PER_MINUTE`: Rate limit (default: 10)
- `CORS_ORIGINS`: Allowed origins (default: `http://localhost:5173,http://localhost:3000`)

## Rate Limiting

- **Default**: 10 requests per minute per IP address
- Customize via `MAX_REQUESTS_PER_MINUTE` environment variable
- Returns HTTP 429 when limit exceeded

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional details (debug mode only)"
}
```

## Testing

Test the API using the interactive docs at `/api/docs` or with curl:

```bash
curl -X POST http://localhost:8000/api/generate-visualization \
  -H "Content-Type: application/json" \
  -d '{"topic": "Merge Sort Algorithm"}'
```

## Production Deployment

### Using Uvicorn

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DEBUG=False
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=https://yourdomain.com
```

## Security

- API keys stored in environment variables (never committed)
- Rate limiting enabled by default
- CORS configured for specific origins
- Input validation with Pydantic
- Structured logging for monitoring

## License

MIT
