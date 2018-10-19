document.addEventListener('DOMContentLoaded', () => {
    let setMessage = (msg) => {
        document.querySelector('#msg').innerHTML = msg
    }

    chrome.runtime.onMessage.addListener(
        function (data) {
            let { action, found } = data
            switch (action) {
                case 'result':
                    if (found) {
                        setMessage('已经将符合条件运价高亮~')
                    } else {
                        setMessage('未找到符合条件运价~')
                    }
                    break
                default:
                    break
            }
        })

    document.querySelector('#find').addEventListener('click', function () {
        setMessage('查找中，莫慌张...')
        var channel = document.querySelector('#channel').value
        var invoiceTypes = Array.from(document.querySelectorAll('#invoicetype input[type="checkbox"]')).filter(checkbox => checkbox.checked).map(checkbox => checkbox.id)

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0]
            chrome.tabs.sendMessage(activeTab.id, { action: 'highlight', channel, invoiceTypes })
        })
    })
})