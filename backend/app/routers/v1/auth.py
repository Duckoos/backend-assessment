from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from app.schemas.user import UserRegister, UserResponse, TokenResponse
from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token
from app.middleware.auth import get_current_user, require_role

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        # Default role is "user" initially, unless we want to seed an admin
    )
    
    await new_user.insert()
    
    access_token = create_access_token(subject=str(new_user.id))
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
         raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Incorrect email or password",
             headers={"WWW-Authenticate": "Bearer"},
         )
         
    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return dict(current_user, id=str(current_user.id))

@router.get("/users", response_model=List[UserResponse])
async def list_users(admin: User = Depends(require_role("admin"))):
    users = await User.find_all().to_list()
    # Pydantic will serialize this correctly due to the id mapping needed for MongoDB 
    return [{"id": str(u.id), **u.dict()} for u in users]
