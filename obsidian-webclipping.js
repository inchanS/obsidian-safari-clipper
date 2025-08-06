 Promise.all([
        import('https://unpkg.com/turndown@6.0.0?module'), 
        import('https://unpkg.com/@tehshrike/readability@0.2.0')
    ]).then(async ([{ default: Turndown }, { default: Readability }]) => {

        /* Optional vault name */
        const vault = "inchan";

        /* Optional folder name such as "Clippings/" */
        const folder = "00 inbox/";

        /* Optional tags  */
        const tags = "clippings";

        function getSelectionHtml() {
            let html = "";
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

        const { title, byline, content } = new Readability(document.cloneNode(true)).parse();

        function getFileName(fileName) {
            let userAgent = window.navigator.userAgent,
                platform = window.navigator.platform,
                windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

            if (windowsPlatforms.indexOf(platform) !== -1) {
                fileName = fileName.replace(':', '').replace(/[/\\?%*|"<>]/g, '-');
            } else {
                fileName = fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-');
            }
            return fileName;
        }
        const fileName = getFileName(title);

        let markdownify;
        if (selection) {
            markdownify = selection;
        } else {
            markdownify = content;
        }

        if (vault) {
            let vaultName = '&vault=' + encodeURIComponent(`${vault}`);
        } else {
            let vaultName = '';
        }

        const markdownBody = new Turndown({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
        }).turndown(markdownify);

        let date = new Date();

        function convertDate(date) { 
            let yyyy = date.getFullYear().toString();
            let mm = (date.getMonth()+1).toString();
            let dd = date.getDate().toString();
            let hours = date.getHours().toString().padStart(2, '0');
            let minutes = date.getMinutes().toString().padStart(2, '0');
            let mmChars = mm.split('');
            let ddChars = dd.split('');
            return yyyy + "-" + (mmChars[1]?mm:"0"+mmChars[0]) + "-" + (ddChars[1]?dd:"0"+ddChars[0]) + "T" + hours + ":" + minutes; 
        }

        const today = convertDate(date);

        const fileContent =
            "---" + "\n"
            + "date : " + today + "  \n"
            + "lastmod : \n"
            + "title : " + title + "  \n"
            + "tags : " + tags + "\n\n"
            + "aliases : \n"
            + "---" + "\n"
            + "- tagLinks:: \n"
            + "- related links:: \n"
            + "- source: [" + title + "](" + document.URL + ")  \n"
            + "---  " + "\n"
            + markdownBody ;

        document.location.href = "obsidian://new?"
            + "file=" + encodeURIComponent(folder + fileName)
            + "&content=" + encodeURIComponent(fileContent)
            + vaultName ;
    })