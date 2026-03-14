from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from beanie import PydanticObjectId
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.models.task import Task
from app.models.user import User
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("", response_model=List[TaskResponse])
async def get_tasks(current_user: User = Depends(get_current_user)):
    print(f"Fetching tasks for user: {current_user.email} (ID: {current_user.id}, Role: {current_user.role})")
    if current_user.role == "admin":
        tasks = await Task.find_all().to_list()
    else:
        tasks = await Task.find(Task.owner.id == current_user.id).to_list()
        
    print(f"Found {len(tasks)} tasks")
    return [{"id": str(t.id), "owner_id": str(t.owner.id), **t.model_dump(exclude={"id", "owner"})} for t in tasks]

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    task = await Task.get(task_id, fetch_links=True)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    if current_user.role != "admin" and task.owner.id != current_user.id:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this task")
         
    return {"id": str(task.id), "owner_id": str(task.owner.id), **task.dict()}

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreate, current_user: User = Depends(get_current_user)):
    print(f"Creating task for user: {current_user.email} (ID: {current_user.id})")
    task_dict = task_data.model_dump()
    new_task = Task(**task_dict, owner=current_user)
    await new_task.insert()
    print(f"Task created with ID: {new_task.id}")
    return {"id": str(new_task.id), "owner_id": str(current_user.id), **new_task.model_dump(exclude={"id", "owner"})}

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: PydanticObjectId, task_data: TaskUpdate, current_user: User = Depends(get_current_user)):
    task = await Task.get(task_id, fetch_links=True)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    if current_user.role != "admin" and task.owner.id != current_user.id:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to modify this task")
    
    update_data = task_data.model_dump(exclude_unset=True)
    if update_data:
        for key, value in update_data.items():
            setattr(task, key, value)
        task.updated_at = datetime.utcnow()
        await task.save()
        
    return {"id": str(task.id), "owner_id": str(task.owner.id), **task.model_dump(exclude={"id", "owner"})}

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    task = await Task.get(task_id, fetch_links=True)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    if current_user.role != "admin" and task.owner.id != current_user.id:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this task")
         
    await task.delete()
