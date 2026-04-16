from datetime import datetime

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import (
    User,
    Specialty,
    UserProfile,
    UserSpecialty,
    Resource,
    ResourceSegment,
)


def get_or_create_specialty(db, code: str, name_ko: str, name_en: str) -> Specialty:
    existing = db.execute(
        select(Specialty).where(Specialty.code == code)
    ).scalar_one_or_none()

    if existing:
        return existing

    specialty = Specialty(
        code=code,
        name_ko=name_ko,
        name_en=name_en,
    )
    db.add(specialty)
    db.flush()
    return specialty


def get_or_create_user(db, email: str, hashed_password: str, name: str) -> User:
    existing = db.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing:
        return existing

    user = User(
        email=email,
        hashed_password=hashed_password,
        name=name,
        is_active=True,
    )
    db.add(user)
    db.flush()
    return user


def get_or_create_user_profile(
    db,
    user_id: int,
    institution_name: str,
    position: str,
    bio: str,
    interests_json: str,
    learning_preferences_json: str,
) -> UserProfile:
    existing = db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    ).scalar_one_or_none()

    if existing:
        return existing

    profile = UserProfile(
        user_id=user_id,
        institution_name=institution_name,
        position=position,
        bio=bio,
        interests_json=interests_json,
        learning_preferences_json=learning_preferences_json,
    )
    db.add(profile)
    db.flush()
    return profile


def get_or_create_user_specialty(
    db,
    user_id: int,
    specialty_id: int,
    is_primary: bool = True,
) -> UserSpecialty:
    existing = db.execute(
        select(UserSpecialty).where(
            UserSpecialty.user_id == user_id,
            UserSpecialty.specialty_id == specialty_id,
        )
    ).scalar_one_or_none()

    if existing:
        return existing

    user_specialty = UserSpecialty(
        user_id=user_id,
        specialty_id=specialty_id,
        is_primary=is_primary,
    )
    db.add(user_specialty)
    db.flush()
    return user_specialty


def get_or_create_resource(
    db,
    *,
    resource_type: str,
    title: str,
    title_en: str | None,
    origin_region: str | None,
    language: str | None,
    publication_date: datetime | None,
    publisher: str | None,
    source_url: str | None,
    abstract_text: str | None,
    specialty_id: int | None,
    created_by: int | None,
    status: str = "active",
) -> Resource:
    existing = db.execute(
        select(Resource).where(Resource.title == title)
    ).scalar_one_or_none()

    if existing:
        return existing

    resource = Resource(
        resource_type=resource_type,
        title=title,
        title_en=title_en,
        origin_region=origin_region,
        language=language,
        publication_date=publication_date,
        publisher=publisher,
        source_url=source_url,
        abstract_text=abstract_text,
        specialty_id=specialty_id,
        created_by=created_by,
        status=status,
    )
    db.add(resource)
    db.flush()
    return resource


def get_or_create_segment(
    db,
    *,
    resource_id: int,
    segment_type: str,
    chapter_title: str | None,
    section_title: str | None,
    page_start: int | None,
    page_end: int | None,
    content_text: str,
    embedding_model: str | None = None,
    embedding_vector_ref: str | None = None,
    lexical_weight: float | None = None,
) -> ResourceSegment:
    existing = db.execute(
        select(ResourceSegment).where(
            ResourceSegment.resource_id == resource_id,
            ResourceSegment.content_text == content_text,
        )
    ).scalar_one_or_none()

    if existing:
        return existing

    segment = ResourceSegment(
        resource_id=resource_id,
        segment_type=segment_type,
        chapter_title=chapter_title,
        section_title=section_title,
        page_start=page_start,
        page_end=page_end,
        content_text=content_text,
        embedding_model=embedding_model,
        embedding_vector_ref=embedding_vector_ref,
        lexical_weight=lexical_weight,
    )
    db.add(segment)
    db.flush()
    return segment


def seed():
    db = SessionLocal()
    try:
        # 1) specialties
        anesthesia = get_or_create_specialty(
            db,
            code="ANESTHESIOLOGY",
            name_ko="마취통증의학과",
            name_en="Anesthesiology and Pain Medicine",
        )
        internal = get_or_create_specialty(
            db,
            code="INTERNAL_MEDICINE",
            name_ko="내과",
            name_en="Internal Medicine",
        )
        emergency = get_or_create_specialty(
            db,
            code="EMERGENCY_MEDICINE",
            name_ko="응급의학과",
            name_en="Emergency Medicine",
        )

        # 2) demo user
        demo_user = get_or_create_user(
            db,
            email="r1.anesthesia@example.com",
            hashed_password="demo_hashed_password",
            name="Anesthesia R1 Demo",
        )

        # 3) profile + specialty
        get_or_create_user_profile(
            db,
            user_id=demo_user.id,
            institution_name="Demo University Hospital",
            position="Resident Year 1",
            bio="마취통증의학과 전공의 1년차 데모 사용자",
            interests_json='["difficult airway", "induction hypotension", "PONV"]',
            learning_preferences_json='{"quiz_mode":"standard","language":"ko"}',
        )

        get_or_create_user_specialty(
            db,
            user_id=demo_user.id,
            specialty_id=anesthesia.id,
            is_primary=True,
        )

        # 4) resources
        r1 = get_or_create_resource(
            db,
            resource_type="textbook",
            title="기도관리 기본 원칙",
            title_en="Principles of Airway Management",
            origin_region="international",
            language="en",
            publication_date=datetime(2023, 1, 15),
            publisher="Demo Textbook Publisher",
            source_url="https://example.com/airway-textbook",
            abstract_text="기도 평가, 삽관 전략, rescue airway 계획에 대한 기본 개념을 다룬다.",
            specialty_id=anesthesia.id,
            created_by=demo_user.id,
        )

        r2 = get_or_create_resource(
            db,
            resource_type="paper",
            title="마취 유도 후 저혈압 위험인자 분석",
            title_en="Risk Factors for Post-Induction Hypotension",
            origin_region="domestic",
            language="ko",
            publication_date=datetime(2024, 3, 20),
            publisher="Korean Journal of Anesthesiology",
            source_url="https://example.com/induction-hypotension-paper",
            abstract_text="마취 유도 후 저혈압 발생에 영향을 주는 환자 특성과 예측 요인을 분석한 연구.",
            specialty_id=anesthesia.id,
            created_by=demo_user.id,
        )

        r3 = get_or_create_resource(
            db,
            resource_type="guideline",
            title="수술 전 평가와 ASA 분류 적용 가이드",
            title_en="Preoperative Evaluation and ASA Classification Guide",
            origin_region="international",
            language="en",
            publication_date=datetime(2022, 9, 1),
            publisher="Perioperative Guideline Council",
            source_url="https://example.com/preop-guideline",
            abstract_text="수술 전 환자 평가, ASA classification, 동반질환 확인 포인트를 정리한 가이드라인.",
            specialty_id=anesthesia.id,
            created_by=demo_user.id,
        )

        r4 = get_or_create_resource(
            db,
            resource_type="case_report",
            title="척추마취 후 심한 저혈압 증례",
            title_en="Severe Hypotension After Spinal Anesthesia: A Case Report",
            origin_region="domestic",
            language="ko",
            publication_date=datetime(2021, 11, 5),
            publisher="Anesthesia Case Review",
            source_url="https://example.com/spinal-hypotension-case",
            abstract_text="척추마취 후 저혈압이 발생한 환자의 진단, 처치, 경과를 다룬 증례.",
            specialty_id=anesthesia.id,
            created_by=demo_user.id,
        )

        r5 = get_or_create_resource(
            db,
            resource_type="conference_material",
            title="PONV 예방 전략 최신 발표 자료",
            title_en="Latest Conference Material on PONV Prevention",
            origin_region="international",
            language="en",
            publication_date=datetime(2024, 10, 10),
            publisher="Global Anesthesia Congress",
            source_url="https://example.com/ponv-conference",
            abstract_text="수술 후 오심구토 예방 전략, 위험도 평가, 약물 선택을 요약한 학술발표 자료.",
            specialty_id=anesthesia.id,
            created_by=demo_user.id,
        )

        # 5) segments
        get_or_create_segment(
            db,
            resource_id=r1.id,
            segment_type="section",
            chapter_title="기도관리",
            section_title="기도 평가",
            page_start=12,
            page_end=15,
            content_text="Mallampati score, mouth opening, thyromental distance, neck mobility는 삽관 난이도 예측에 중요한 요소이다.",
            lexical_weight=1.0,
        )

        get_or_create_segment(
            db,
            resource_id=r1.id,
            segment_type="section",
            chapter_title="기도관리",
            section_title="어려운 기도 전략",
            page_start=16,
            page_end=21,
            content_text="예상 어려운 기도에서는 awake technique, video laryngoscope 준비, rescue airway 계획을 사전에 고려해야 한다.",
            lexical_weight=1.0,
        )

        get_or_create_segment(
            db,
            resource_id=r2.id,
            segment_type="section",
            chapter_title="Results",
            section_title="Risk Factors",
            page_start=None,
            page_end=None,
            content_text="고령, 저혈량 상태, 기저 심혈관질환, 높은 유도약 용량은 post-induction hypotension과 유의하게 연관되었다.",
            lexical_weight=1.0,
        )

        get_or_create_segment(
            db,
            resource_id=r3.id,
            segment_type="section",
            chapter_title="Preoperative Evaluation",
            section_title="ASA Classification",
            page_start=4,
            page_end=7,
            content_text="ASA classification은 수술 전 전신상태 평가의 표준적 기준으로 사용되며, 마취 위험도 판단의 기초 자료가 된다.",
            lexical_weight=1.0,
        )

        get_or_create_segment(
            db,
            resource_id=r4.id,
            segment_type="section",
            chapter_title="Case Presentation",
            section_title="Management",
            page_start=None,
            page_end=None,
            content_text="척추마취 직후 저혈압이 발생하였고, 수액, vasopressor, 자세 조정을 통해 혈압을 안정화하였다.",
            lexical_weight=1.0,
        )

        get_or_create_segment(
            db,
            resource_id=r5.id,
            segment_type="section",
            chapter_title="PONV Prevention",
            section_title="Risk Stratification",
            page_start=None,
            page_end=None,
            content_text="여성, 비흡연, PONV 병력, opioid 사용은 PONV 고위험군 분류에 중요하며, 다중 약제 예방 전략이 권고된다.",
            lexical_weight=1.0,
        )

        db.commit()
        print("✅ Seed data inserted successfully.")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()