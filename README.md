# Clinical Evidence Platform

의료진이 임상 질문을 시작점으로 교과서, 논문, 증례, 가이드라인, 학술 발표 자료, 연구 자료를 통합 탐색하고,  
AI 기반 요약·추천·학습·연구 지원까지 수행할 수 있는 통합 의학 지식 플랫폼입니다.

---

## Overview

Clinical Evidence Platform은 전공의, 의대생, 펠로우, 전문의 등 의료진이  
필요한 의학 정보를 한 곳에서 빠르게 탐색하고, 학습하고, 연구에 활용할 수 있도록 지원하는 플랫폼입니다.

이 서비스는 단순한 논문 검색 도구나 챗봇이 아니라,  
임상 질문을 중심으로 다양한 의학 자료를 연결하고 구조화하는 **Medical Knowledge Platform**을 목표로 합니다.

주요 탐색 대상은 다음과 같습니다.

- Textbooks
- Papers
- Case Reports
- Guidelines
- Conference Materials
- Research Materials
- Related Resources
- Recommended Resources

또한 학습 및 연구를 위한 다음 기능도 포함합니다.

- AI-based search interpretation
- Evidence summary and recommendation
- Textbook-based quiz generation
- Descriptive answer feedback
- Research dataset exploration
- Statistical analysis support
- Result visualization and organization

---

## Problem Statement

의료진은 실제 업무와 학습 과정에서 다음과 같은 문제를 자주 겪습니다.

- 임상 질문이 생겼을 때 자료가 여러 곳에 흩어져 있어 빠르게 찾기 어렵다.
- 교과서, 논문, 증례, 가이드라인, 학술 자료를 각각 따로 찾아야 한다.
- 검색 결과가 많아도 어떤 자료를 먼저 봐야 할지 판단하기 어렵다.
- 단순 검색을 넘어 학습과 연구로 이어지는 흐름이 분리되어 있다.
- 전공의나 연구 초심자는 데이터 분석과 결과 정리에 어려움을 겪는다.

Clinical Evidence Platform은 이러한 문제를 해결하기 위해  
**검색 → 열람 → 요약 → 학습 → 연구 지원**까지 이어지는 하나의 통합 흐름을 제공합니다.

---

## Core Goals

- 의료진의 의학 자료 탐색 시간을 줄인다.
- 임상 질문 하나로 다양한 자료를 통합 탐색할 수 있도록 한다.
- 교과서, 논문, 증례, 가이드라인, 학술 자료를 구조적으로 연결한다.
- AI를 활용해 자료를 요약하고, 비교하고, 추천한다.
- 교과서 기반 문제 생성과 서술형 답변 피드백을 통해 학습을 지원한다.
- 연구 데이터 탐색, 분석, 시각화를 통해 연구 workflow를 지원한다.
- 장기적으로 의료진을 위한 통합 지식 탐색·학습·연구 플랫폼을 구축한다.

---

## Main Domains

### 1. Integrated Search
- 임상 질문 입력
- 키워드 및 자연어 검색
- AI 기반 질의 해석
- 검색어 확장
- 필터 적용
- 연관 자료 / 추천 자료 제공

### 2. Medical Resources
- 교과서 열람
- 논문 열람
- 증례 열람
- 가이드라인 열람
- 학술 발표자료 열람
- 연구자료 열람

### 3. AI Support
- 질문 의미 해석
- AI 요약
- 자료 비교
- 연관 자료 추천
- 유사 주제 연결

### 4. Learning
- 교과서 기반 문제 생성
- 페이지/단원 범위 선택
- 난이도 및 세밀도 설정
- 서술형 답변 작성
- AI 피드백 제공
- 복습 추천

### 5. Research Support
- 연구 데이터 업로드
- 데이터 탐색
- 통계 분석 지원
- 결과 시각화
- 분석 결과 정리

### 6. User Management
- 회원가입 / 로그인
- 사용자 프로필 관리
- 전공과 및 관심 분야 설정
- 북마크
- 검색 기록 및 학습 기록 관리

### 7. Admin Management
- 자료 등록 / 수정 / 삭제
- 자료 검수 및 승인
- 출처 검증
- 신고 및 오류 관리
- 운영 로그 관리

---

## Initial Baseline

현재 프로젝트는 서비스 전체 구조를 먼저 설계하고,  
이를 기반으로 단계적으로 구현을 진행하는 방식으로 개발됩니다.

초기 베이스라인 범위는 다음과 같습니다.

- 서비스 구조 설계
- 요구사항 정의
- API 명세
- ERD 설계
- 검색 프로토타입 구축
- 기본 프론트엔드 / 백엔드 연결

---

## Future Direction

이 프로젝트는 단기적으로는 검색 중심 프로토타입을 고도화하고,  
장기적으로는 다음을 포함하는 대규모 플랫폼을 목표로 합니다.

- 자료 유형별 고도화된 검색
- AI 기반 추천 및 비교 강화
- 교과서 기반 학습 기능 확장
- 연구 분석 기능 확장
- 관리자 검수 체계 강화
- 의료진 맞춤형 개인화 기능
- 통합 웹 플랫폼 및 반응형 사용자 경험 제공

---

## Tech Scope

Planned stack includes:

- Frontend: Next.js
- Backend: FastAPI
- Database: MySQL
- AI Layer: LLM-based search / summary / recommendation
- Search & Retrieval: integrated resource search architecture
- Analytics: research data analysis and visualization pipeline

---

## Project Status

This project is currently in the **baseline design and architecture stage**.

Completed:
- Repository setup
- Initial documentation
- Requirements definition
- API specification drafting
- ERD baseline design
- Search prototype connection

In Progress:
- Detailed requirements refinement
- Information architecture
- Wireframing
- Full-scope service planning
