from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"]
)

@router.post("/", response_model=schemas.Purchase)
def create_new_purchase(
    purchase: schemas.PurchaseCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role not in ["user1", "user2"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to create a purchase"
        )
    return crud.create_purchase(db=db, purchase=purchase, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Purchase])
def read_all_purchases(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role not in ["user1", "user3"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view purchases"
        )
    purchases = crud.get_purchases(db, skip=skip, limit=limit)
    return purchases

@router.put("/{purchase_id}", response_model=schemas.Purchase)
def update_existing_purchase(
    purchase_id: int, 
    purchase: schemas.PurchaseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "user1":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit a purchase"
        )
    
    updated_purchase = crud.update_purchase(db=db, purchase_id=purchase_id, purchase=purchase)
    if updated_purchase is None:
        raise HTTPException(status_code=404, detail="Purchase not found")
        
    return updated_purchase