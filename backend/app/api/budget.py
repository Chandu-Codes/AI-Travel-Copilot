from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.entities import Expense, User, Trip
from ..schemas.all_schemas import BudgetOptimizationRequest, BudgetOptimizationResponse, ExpenseCreate, ExpenseResponse
from ..optimization.budget_optimizer import budget_optimizer

router = APIRouter(prefix="/budget", tags=["Budget & Expenses"])

@router.post("/optimize", response_model=BudgetOptimizationResponse)
def optimize_trip_budget(req: BudgetOptimizationRequest):
    return budget_optimizer.optimize_budget(
        total_budget_inr=req.total_budget_inr,
        travel_style=req.travel_style,
        duration_days=req.duration_days,
        travelers_count=req.travelers_count
    )

@router.get("/expenses", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).order_by(Expense.id.desc()).all()
    if not expenses:
        # Provide clean initial demo expenses for the active trip
        demo_expenses = [
            Expense(category="Flight", title="Roundtrip Flight Delhi - Goa", amount_inr=11200.0, date_str="10 Jun 2025", notes="IndiGo 6E-204"),
            Expense(category="Stay", title="BloomSuites Hotel 4 Nights", amount_inr=16800.0, date_str="10 Jun 2025", notes="Deluxe Room with Pool View"),
            Expense(category="Activities", title="Dudhsagar Jeep Safari Pass", amount_inr=3600.0, date_str="12 Jun 2025", notes="Guided forest tour for 2"),
            Expense(category="Food", title="Beach Shack Seafood Dinner", amount_inr=2400.0, date_str="11 Jun 2025", notes="Curlies Anjuna Sunset dinner")
        ]
        for e in demo_expenses:
            db.add(e)
        db.commit()
        expenses = db.query(Expense).all()
    return expenses

@router.post("/expenses", response_model=ExpenseResponse)
def add_expense(req: ExpenseCreate, db: Session = Depends(get_db)):
    new_expense = Expense(
        trip_id=req.trip_id,
        category=req.category,
        title=req.title,
        amount_inr=req.amount_inr,
        date_str=req.date_str or "Today",
        notes=req.notes or ""
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    exp = db.query(Expense).filter(Expense.id == expense_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(exp)
    db.commit()
    return {"message": "Expense deleted"}
