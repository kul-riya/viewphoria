# ViewPhoria


**Simplifying the process of viewing large-scale data with our metastore viewer for S3/Azure!**

Welcome to ViewPhoria's Repository! This was created during the CSI Inspiron 4.0 Hackathon, 2025 (Spoonsored by E6 Data and Mira).

## PROBLEM STATEMENT
While many metastore viewers allow registering Parquet, Delta, Hudi and Iceberg tables, most do not allow metadata exploration when only a storage location such as an S3 bucket is provided.

## What is Delta, Hudi, Parquet and Iceberg?
These are open source table formats designed for data lakes. Theya are optimised for storing huge amounts of data in an efficient manner. Formats such as Iceberg and hudi also provide functionality for "version control" -- allowing to track changes made to the data over time

*Why Parquet over CSV?*

Apache Parquet is a columnar storage file format designed for efficient data processing, particularly in the context of big data applications. It is an open-source format developed as part of the Apache Hadoop ecosystem, but it is widely used beyond Hadoop in various data processing frameworks, including Apache Spark, Apache Drill, and Amazon Athena.

These formats emphasize on the difference between the data itself and metadata.
While the data is stored in the form of tables and columns, the metadata is an entirely different concept.

*metadata:*  corresponds to the information *ABOUT* the data itself. It does not contain the data itself, but information about the data itself such as the number of columns, datatype of columns, timestamps, etc

So, all our metastore viewer needs to do is to extract the metadata from a bucket, and display it in an interactive manner.

## OUR SOLUTION
A web based metastore viewer that allows user to enter an s3 bucket and location and to fetch.

Users should be able to:
1) Login and Signup
2) Enter a s3/minIO bucket URL
3) Select the format that needs to be fetched
4) Manage Credentials effectively

## CHALLENGES
Each format has a very different layout and structure of metadata. For example:
1) *Parquet Files*: store data in a columnwise fashion. All the metadata of a parquet file is stored in the file itself(in the footer), and this format does not support snaphots and version control.

2) *Iceberg* : Stores data in parquet files, however the metadata of the entire dataset is stored in a set of `metatada.json` and `manifest.json` files. This format supports vesion control, and whenever a change is made to the dataset, new manifest and metadata files are generated as a `snapshot`

3) *Delta* : Stores data in paruet files and all the metadata in `.delta_logs/` folder. The folder contains commit json files that represent the changes made to the dataset

## APPROACH
1) #### *Metadata Extraction* :
    
    To tackle the various formats of the above files, we have decided to create a *Standardised Format* that can capture all the details from the above into a single syntax.

    The advantage of this is that there is no need to create 4 different frontend to address the unique features of each format. This also allows the project to be scaled easily-- all we have to do to add a new format is to add code to access metadata and code to standardise it!

    We use libraries like pyarrow, boto and s3fs to reliably extraact the metadata given the proper link and credentials, and pass the json generated into `standardizer.py` that parses the json and converts it to the standart format, which is then stored in the database. 

    The same json is then fetched from the frontend into a number of interactive components to visually display the data.

2) #### *Data Fetching* :

    Data stores like amazon S3 tend to place a limit on the number of times one can access a bucket via code. 

    Our solution to this problem is to give the user the choice of fetching locally or to request s3 again.

    The advantage is that the user can choose to update the metastore data if there have been any changes to it, and if there arent, they can safely view the metadata stored in the database without wasting a request.

    This not only saves on cost but also saves on server compute and is faster.

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


## DEVELOPERS
Created with <3 by 

1) Aman Morghade : https://github.com/xaman27x
2) Aryan Mehta : https://github.com/arymehta
3) Hardik Mutha : https://github.com/HardikMutha
4) Riya Kulkarni : https://github.com/kul-riya