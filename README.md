# Baadal Lens

**Simplifying the process of viewing large-scale data with our metastore viewer for S3/Azure!**

## Folder Structure

```
baadal_lens/
├── frontend/                 # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Shared components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── visualizations/ # D3.js and Three.js visualizations
│   │   │   └── forms/        # Input forms
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.tsx  # Landing/intro page
│   │   ├── services/         # API client services
│   │   │   ├── api.js        # Base API configuration
│   │   │   ├── metadataService.js # Metadata-related API calls
│   │   │   └── queryService.js # SQL query-related API calls
│   │   ├── store/            # State management
│   │   │   ├── reducers/     
│   │   │   └── actions/
│   │   ├── utils/            # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json   
│   └── vite.config.ts
│
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── routes/
│   │   │   │   ├── metadata.py
│   │   │   │   ├── query.py
│   │   │   │   └── auth.py
│   │   │   └── dependencies.py
│   │   ├── core/             # Core application code
│   │   │   ├── config.py     # Configuration
│   │   │   ├── security.py   # Auth handling
│   │   │   └── errors.py     # Error handling
│   │   ├── models/           # Database models
│   │   │   ├── metadata.py
│   │   ├── schemas/       
│   │   │   ├── metadata.py
│   │   │   └── query.py
│   │   ├── services/         # Business logic
│   │   │   ├── metadata_extractor/ # Extraction logic
│   │   │   │   ├── parquet.py
│   │   │   │   ├── iceberg.py
│   │   │   │   ├── delta.py
│   │   │   │   └── hudi.py
│   │   │   ├── standardizer.py  # Standardizing different formats
│   │   │   ├── storage_service.py # S3/Azure connections
│   │   │   └── query_service.py # Query execution
│   │   ├── db/               # Database
│   │   │   ├── db.py
│   │   └── main.py           # FastAPI app initialization
│   ├── tests/                # Test suite
│   │   ├── api/
│   │   ├── services/
│   │   └── conftest.py
│   ├── pyproject.toml
│   └── requirements.txt
│
├── docker/                   # Docker configuration
│   ├── frontend/
│   │   └── Dockerfile
│   ├── backend/
│   │   └── Dockerfile
│   └── docker-compose.yml
│
└── README.md
```
