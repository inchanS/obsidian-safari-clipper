Promise.all([
    import('https://unpkg.com/turndown@6.0.0?module'),
    import('https://unpkg.com/@tehshrike/readability@0.2.0')
]).then(async ([{default: Turndown}, {default: Readability}]) => {

    /* Optional vault name */
    const vault = "inchan";

    /* Optional folder name such as "Clippings/" */
    const folder = "00 inbox/";

    /* Optional tags  */
    const tags = "clippings";

    let html = "";

    function getSelectionHtml() {
        if (typeof window.getSelection != "undefined") {
            let sel = window.getSelection();
            if (sel.rangeCount) {
                let container = document.createElement("div");
                for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
    }

    const selection = getSelectionHtml();

    const {title, byline, content} = new Readability(document.cloneNode(true)).parse();

    function getSanitizedFileName(fileName) {
        // Windows에서 파일명으로 사용할 수 없는 문자들: / \ ? % * : | " < >
        // 이 문자들을 모두 찾아 하이픈(-)으로 변경하는 정규식
        const illegalCharsRegex = /[\/\?%*:|"<>\\]/g;

        // 정규식을 사용하여 모든 금지 문자를 '-'로 한 번에 치환
        return fileName.replace(illegalCharsRegex, '-');
    }

    const fileName = getSanitizedFileName(title);

    let markdownify;
    if (selection) {
        markdownify = selection;
    } else {
        markdownify = content;
    }

    let vaultName;
    if (vault) {
        vaultName = '&vault=' + encodeURIComponent(`${vault}`);
    } else {
        vaultName = '';
    }

    const markdownBody = new Turndown({
        headingStyle: 'atx',
        hr: '---',
        bulvarListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
    }).turndown(markdownify);

    let date = new Date();

    function convertDate(date) {
        let yyyy = date.getFullYear().toString();
        let mm = (date.getMonth() + 1).toString();
        let dd = date.getDate().toString();
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let mmChars = mm.split('');
        let ddChars = dd.split('');
        return yyyy + "-" + (mmChars[1] ? mm : "0" + mmChars[0]) + "-" + (ddChars[1] ? dd : "0" + ddChars[0]) + "T" + hours + ":" + minutes;
    }

    const today = convertDate(date);

    const fileContent =
        "---" + "\n"
        + "date : " + today + "  \n"
        + "lastmod : \n"
        + "title : " + fileName + "  \n"
        + "tags : " + tags + "\n\n"
        + "aliases : \n"
        + "---" + "\n"
        + "- tagLinks:: \n"
        + "- related links:: \n"
        + "- source: [" + title + "](" + document.URL + ")  \n"
        + "---  " + "\n"
        + markdownBody;

    document.location.href = "obsidian://new?"
        + "file=" + encodeURIComponent(folder + fileName)
        + "&content=" + encodeURIComponent(fileContent)
        + vaultName;
})