from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.db.session import SessionLocal
from app.models import (
    Resource,
    ResourceSegment,
    SearchQuery,
    SearchQueryResult,
    Specialty,
    User,
    UserProfile,
    UserSpecialty,
)


def get_or_create_user(db: Session) -> User:
    user = db.scalar(select(User).where(User.email == "demo.clinician@example.com"))
    if user is None:
        user = User(
            email="demo.clinician@example.com",
            full_name="Dr. Mina Park",
        )
        db.add(user)
        db.flush()
    return user


def get_or_create_specialty(db: Session, name: str, description: str) -> Specialty:
    specialty = db.scalar(select(Specialty).where(Specialty.name == name))
    if specialty is None:
        specialty = Specialty(name=name, description=description)
        db.add(specialty)
        db.flush()
    return specialty


def get_or_create_user_profile(db: Session, user: User) -> UserProfile:
    profile = db.scalar(select(UserProfile).where(UserProfile.user_id == user.id))
    if profile is None:
        profile = UserProfile(
            user_id=user.id,
            institution="Seoul Clinical Evidence Center",
            role="Attending Physician",
            bio="Evidence-focused clinician using the platform for search, review, and learning workflows.",
        )
        db.add(profile)
        db.flush()
    return profile


def get_or_create_user_specialty(
    db: Session,
    user: User,
    specialty: Specialty,
    proficiency_level: str,
) -> UserSpecialty:
    link = db.scalar(
        select(UserSpecialty).where(
            UserSpecialty.user_id == user.id,
            UserSpecialty.specialty_id == specialty.id,
        )
    )
    if link is None:
        link = UserSpecialty(
            user_id=user.id,
            specialty_id=specialty.id,
            proficiency_level=proficiency_level,
        )
        db.add(link)
        db.flush()
    return link


def get_or_create_resource(
    db: Session,
    *,
    title: str,
    resource_type: str,
    abstract: str,
    source_url: str,
) -> Resource:
    resource = db.scalar(select(Resource).where(Resource.title == title))
    if resource is None:
        resource = Resource(
            title=title,
            resource_type=resource_type,
            abstract=abstract,
            source_url=source_url,
        )
        db.add(resource)
        db.flush()
    return resource


def get_or_create_resource_segment(
    db: Session,
    resource: Resource,
    segment_index: int,
    content: str,
) -> ResourceSegment:
    segment = db.scalar(
        select(ResourceSegment).where(
            ResourceSegment.resource_id == resource.id,
            ResourceSegment.segment_index == segment_index,
        )
    )
    if segment is None:
        segment = ResourceSegment(
            resource_id=resource.id,
            segment_index=segment_index,
            content=content,
        )
        db.add(segment)
        db.flush()
    return segment


def get_or_create_search_query(db: Session, user: User, query_text: str) -> SearchQuery:
    query = db.scalar(
        select(SearchQuery).where(
            SearchQuery.user_id == user.id,
            SearchQuery.query_text == query_text,
        )
    )
    if query is None:
        query = SearchQuery(user_id=user.id, query_text=query_text)
        db.add(query)
        db.flush()
    return query


def get_or_create_search_query_result(
    db: Session,
    query: SearchQuery,
    resource: Resource,
    *,
    rank: int,
    score: float,
    snippet: str,
) -> SearchQueryResult:
    result = db.scalar(
        select(SearchQueryResult).where(
            SearchQueryResult.search_query_id == query.id,
            SearchQueryResult.resource_id == resource.id,
        )
    )
    if result is None:
        result = SearchQueryResult(
            search_query_id=query.id,
            resource_id=resource.id,
            rank=rank,
            score=score,
            snippet=snippet,
        )
        db.add(result)
        db.flush()
    return result


def seed_core_data() -> None:
    with SessionLocal() as db:
        user = get_or_create_user(db)

        cardiology = get_or_create_specialty(
            db,
            "Cardiology",
            "Clinical evidence and decision support for cardiovascular care.",
        )
        internal_medicine = get_or_create_specialty(
            db,
            "Internal Medicine",
            "Broad evidence synthesis across adult medicine workflows.",
        )
        critical_care = get_or_create_specialty(
            db,
            "Critical Care",
            "High-acuity evidence review for ICU and emergency scenarios.",
        )

        get_or_create_user_profile(db, user)
        get_or_create_user_specialty(db, user, cardiology, "advanced")
        get_or_create_user_specialty(db, user, internal_medicine, "advanced")
        get_or_create_user_specialty(db, user, critical_care, "intermediate")

        resource_one = get_or_create_resource(
            db,
            title="Contemporary Anticoagulation Strategies in Atrial Fibrillation",
            resource_type="systematic_review",
            abstract="A synthesis of recent evidence comparing anticoagulation strategies for stroke prevention in adults with atrial fibrillation.",
            source_url="https://example.org/resources/atrial-fibrillation-anticoagulation",
        )
        resource_two = get_or_create_resource(
            db,
            title="Early Mobilization Protocols for Critically Ill Adults",
            resource_type="clinical_guideline",
            abstract="Practice recommendations and implementation notes for ICU mobilization pathways in medically complex patients.",
            source_url="https://example.org/resources/icu-early-mobilization",
        )

        get_or_create_resource_segment(
            db,
            resource_one,
            0,
            "Direct oral anticoagulants remained favorable for stroke prevention with lower intracranial bleeding risk in most reviewed cohorts.",
        )
        get_or_create_resource_segment(
            db,
            resource_one,
            1,
            "Evidence quality was highest in older adults with non-valvular atrial fibrillation and moderate bleeding risk.",
        )
        get_or_create_resource_segment(
            db,
            resource_two,
            0,
            "Early mobilization protocols were associated with shorter ICU stays when implemented with multidisciplinary screening.",
        )
        get_or_create_resource_segment(
            db,
            resource_two,
            1,
            "Reported harms were uncommon but most studies excluded patients with unstable hemodynamics or active myocardial ischemia.",
        )

        query = get_or_create_search_query(
            db,
            user,
            "best evidence for anticoagulation strategy in non-valvular atrial fibrillation",
        )
        get_or_create_search_query_result(
            db,
            query,
            resource_one,
            rank=1,
            score=0.97,
            snippet="Direct oral anticoagulants remained favorable for stroke prevention with lower intracranial bleeding risk.",
        )
        get_or_create_search_query_result(
            db,
            query,
            resource_two,
            rank=2,
            score=0.72,
            snippet="Early mobilization guidance is less directly relevant but includes important anticoagulation safety considerations in ICU patients.",
        )

        db.commit()

        print("Seed complete.")
        print("user=demo.clinician@example.com")
        print("specialties=3")
        print("resources=2")
        print("resource_segments=4")
        print("search_queries=1")
        print("search_query_results=2")


if __name__ == "__main__":
    seed_core_data()
