## Obsidian-Safari-Clipper

* update 2026-11-10 Tue 18:09
  * [Obsidian Web Clipper](https://obsidian.md/clipper) 공식 도구가 지원됨에 따라 현재 프로젝트는 아카이브 처리

Safari 브라우저에서 현재 웹사이트를 Markdown 형식으로 변환하여 Obsidian Vault에 저장하는 Alfred 워크플로우  

![Obsidian 웹 클리핑 도구](obsidian-clipping.webp)

## 주요 기능

- Safari 브라우저에서 현재 페이지를 Markdown으로 변환
- 전체 페이지 또는 선택한 텍스트만 클리핑 가능
- Obsidian Vault에 자동 저장
- 날짜, 제목, 태그, 원본 URL 등의 메타데이터 자동 추가
- 플랫폼별 파일명 호환성 보장

## 사용된 기술

- [Turndown](https://github.com/mixmark-io/turndown) - HTML을 Markdown으로 변환
- [Readability](https://github.com/mozilla/readability) - 웹 콘텐츠 파싱
- Alfred 워크플로우
- AppleScript 및 JavaScript

## 시스템 요구사항

- macOS
- Safari 브라우저
- Alfred 앱 (유료 버전의 워크플로우 기능 필요)
- Obsidian

## 설치 방법

1. 프로젝트 파일 다운로드
2. `obsidian-webclipping.js` 파일을 사용하고자 하는 폴더에 복사
3. Alfred에서 새 워크플로우 생성:
    - 새로운 워크플로우 생성
    - `Keyword`를 원하는 명령어로 설정 (예: "webclip")
    - `Run Script` 액션 추가
    - 언어를 `applescript`로 설정하고 `with input as argv` 옵션 선택
    - 아래 스크립트 내용 붙여넣기:

```
-- JavaScript 파일의 경로를 설정
set jsFilePath to (POSIX path of (path to home folder)) & "scripts/obsidian_webclipping/obsidian-webclipping.js"

-- JavaScript 파일의 내용을 읽기
set jsCode to do shell script "cat " & quoted form of jsFilePath

-- Safari에 JavaScript 코드를 실행하도록 명령
tell application "Safari"
	do JavaScript jsCode in current tab of window 1
end tell
```


## 커스터마이징

`obsidian-webclipping.js` 파일을 편집하여 다음 설정을 변경 가능:

```javascript
/* Obsidian Vault 이름 */
const vault = "inchan";

/* 저장할 폴더 경로 */
const folder = "00 inbox/";

/* 기본 태그 */
const tags = "clippings";
```


## 사용 방법

1. Safari에서 저장하려는 웹페이지 열기
2. Alfred 실행 및 설정한 키워드 입력 (예: "webclip")
3. 웹페이지가 Markdown으로 변환되어 Obsidian에 자동으로 저장됨

## 제한 사항

- 현재 Safari 브라우저만 지원
- 개인 사용 목적으로 만들어져 설치 과정이 간소화되어 있지 않음
- Vault 이름, 폴더 경로 등을 스크립트에서 직접 수정해야 함

## 문제 해결

일반적인 문제:
- **페이지가 저장되지 않음**: Obsidian이 실행 중인지 확인하고, Vault 이름이 올바르게 설정되었는지 확인
- **내용이 제대로 변환되지 않음**: 일부 복잡한 웹사이트는 완벽하게 변환되지 않을 수 있음

## 향후 개선 사항

- Chrome, Firefox 등 다른 브라우저 지원
- UI를 통한 설정 변경 기능
- 더 나은 오류 처리
- 변환 옵션 커스터마이징

## 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.

---
