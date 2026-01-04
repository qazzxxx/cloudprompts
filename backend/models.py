from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    color: str = Field(default="blue") # For UI badges
    icon: Optional[str] = Field(default=None) # Icon name
    sort_order: int = Field(default=0)
    
    projects: List["Project"] = Relationship(back_populates="category")

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    is_favorite: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    category: Optional[Category] = Relationship(back_populates="projects")
    versions: List["Version"] = Relationship(back_populates="project", sa_relationship_kwargs={"cascade": "all, delete"})

class Version(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    version_num: int
    content: str
    changelog: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    project: Optional[Project] = Relationship(back_populates="versions")
