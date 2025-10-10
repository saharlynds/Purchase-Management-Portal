from sqlalchemy.orm import Session
from . import models, schemas
from . import security
from sqlalchemy import extract
from fastapi import HTTPException
from sqlalchemy import func


def get_company_by_name(db: Session, name: str):
    return db.query(models.Company).filter(models.Company.name == name).first()

def get_companies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Company).offset(skip).limit(limit).all()

def create_company(db: Session, company: schemas.CompanyCreate):
    db_company = models.Company(
        name=company.name,
        company_type=company.company_type,
        company_size=company.company_size,
        region=company.region
    )
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username, 
        password_hash=hashed_password, 
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_purchase(db: Session, purchase: schemas.PurchaseCreate, user_id: int):
    db_purchase = models.Purchase(**purchase.dict(), created_by_user_id=user_id)
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

def get_purchases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Purchase).offset(skip).limit(limit).all()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(name=product.name)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_purchase(db: Session, purchase_id: int):
    return db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()

def update_purchase(db: Session, purchase_id: int, purchase: schemas.PurchaseUpdate):
    db_purchase = get_purchase(db, purchase_id=purchase_id)
    if not db_purchase:
        return None
    
    update_data = purchase.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_purchase, key, value)
        
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

def get_purchases_by_month(db: Session, year: int, month: int):
    return db.query(models.Purchase).filter(
        extract('year', models.Purchase.purchase_date) == year,
        extract('month', models.Purchase.purchase_date) == month
    ).all()

def get_purchases_by_company(db: Session, company_id: int):
    return db.query(models.Purchase).filter(models.Purchase.company_id == company_id).all()

def delete_company(db: Session, company_id: int):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not company:
        return False

    related_purchases = db.query(models.Purchase).filter(models.Purchase.company_id == company_id).count()
    if related_purchases > 0:
        raise HTTPException(status_code=400, detail="Cannot delete company with existing purchases")
        
    db.delete(company)
    db.commit()
    return True


def get_monthly_summary(db: Session):
    
    result = db.query(
        extract('year', models.Purchase.purchase_date).label('year'),
        extract('month', models.Purchase.purchase_date).label('month'),
        func.sum(models.Purchase.amount).label('total_amount')
    ).group_by('year', 'month').order_by('year', 'month').all()
    
    return [{"month": f"{row.year}-{str(row.month).zfill(2)}", "total_amount": row.total_amount} for row in result]

def get_product_summary(db: Session):
    return db.query(
        models.Product.name.label("product_name"),
        func.sum(models.Purchase.amount).label("total_amount")
    ).join(models.Product).group_by(models.Product.name).all()

def get_company_summary(db: Session):
    return db.query(
        models.Company.name.label("company_name"),
        func.sum(models.Purchase.amount).label("total_amount")
    ).join(models.Company).group_by(models.Company.name).order_by(func.sum(models.Purchase.amount).desc()).all()
