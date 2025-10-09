from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/monthly", response_model=List[schemas.Purchase])
def get_monthly_report(
    year: int, 
    month: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "user3":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this report"
        )
    return crud.get_purchases_by_month(db=db, year=year, month=month)

@router.get("/company", response_model=List[schemas.Purchase])
def get_company_report(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "user3":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this report"
        )
    return crud.get_purchases_by_company(db=db, company_id=company_id)


@router.get("/summary/monthly", response_model=List[schemas.MonthlySummary])
def get_monthly_summary_report(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "user3":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
    return crud.get_monthly_summary(db=db)

@router.get("/summary/by-product", response_model=List[schemas.ProductSummary])
def get_product_summary_report(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "user3":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
    return crud.get_product_summary(db=db)

@router.get("/summary/by-company", response_model=List[schemas.CompanySummary])
def get_company_summary_report(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "user3":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")
    return crud.get_company_summary(db=db)