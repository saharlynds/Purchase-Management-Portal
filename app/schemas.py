from pydantic import BaseModel
from typing import Optional
from datetime import date


class CompanyBase(BaseModel):
    name: str
    company_type: str
    company_size: str
    region: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    class Config:
        orm_mode = True
        
        
class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    

class Product(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

# --- Purchase Schemas ---
class PurchaseBase(BaseModel):
    purchase_date: date
    product_id: int
    amount: float
    count: int
    company_id: int

class PurchaseCreate(PurchaseBase):
    pass

class Purchase(PurchaseBase):
    id: int
    created_by_user_id: int
    company: Company
    product: Product 

    class Config:
        from_attributes = True
        

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True
        
class PurchaseUpdate(BaseModel):
    purchase_date: Optional[date] = None
    product_id: Optional[int] = None
    amount: Optional[float] = None
    count: Optional[int] = None
    company_id: Optional[int] = None
    

class MonthlySummary(BaseModel):
    month: str
    total_amount: float

class ProductSummary(BaseModel):
    product_name: str
    total_amount: float

class CompanySummary(BaseModel):
    company_name: str
    total_amount: float