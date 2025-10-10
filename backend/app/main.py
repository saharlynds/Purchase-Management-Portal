from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .database import engine, Base, get_db
from .routers import companies, auth, purchases, products, reports
from . import crud, models, schemas

Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.on_event("startup")
def create_initial_products():
    db = next(get_db())
    
    fixed_products = ["product1", "product2", "product3"]
    existing_products = {p.name for p in crud.get_products(db)}
    
    for product_name in fixed_products:
        if product_name not in existing_products:
            product_schema = schemas.ProductCreate(name=product_name)
            crud.create_product(db=db, product=product_schema)
            print(f"Created initial product: {product_name}")
    
    db.close()

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(companies.router)
app.include_router(auth.router)
app.include_router(purchases.router)
app.include_router(products.router)
app.include_router(reports.router)

@app.get("/")
def read_root():
    return {"Status": "API is running!"}