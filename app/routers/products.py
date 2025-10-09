# محتوای کامل برای app/routers/products.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_current_user 

router = APIRouter(
    prefix="/products", 
    tags=["Products"]
)

# @router.post("/", response_model=schemas.Product)
# def create_new_product(
#     product: schemas.ProductCreate, 
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user)
# ):
#     
#     if current_user.role not in ["user1", "user2"]:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="You do not have permission to create a product"
#         )
#     return crud.create_product(db=db, product=product)

@router.get("/", response_model=List[schemas.Product])
def read_all_products(db: Session = Depends(get_db)):
    return crud.get_products(db=db)