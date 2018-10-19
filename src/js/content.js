chrome.runtime.onMessage.addListener(
    function (data) {
        let { action, channel, invoiceTypes } = data
        switch (action) {
            case 'highlight':
                let list = []
                let doFilter = () => {
                    list = Array.from(document.querySelectorAll('.seat-row'))

                    list.forEach(price => {
                        price.style.borderTop = '';
                        price.style.borderBottom = '';
                        price.style.backgroundColor = '';
                    })

                    if (channel) {
                        list = list.filter(item => (item.getAttribute('channel') || '').indexOf(channel) >= 0)
                    }

                    if (invoiceTypes && invoiceTypes.length) {
                        list = list.filter(item => invoiceTypes.every(invoicetype => (item.getAttribute('invoicetype') || '').indexOf(invoicetype) >= 0))
                    }
                }

                let notify = (found) => {
                    chrome.runtime.sendMessage({
                        action: 'result',
                        found
                    })
                }

                let judge = () => {
                    if (list.length) {
                        var targetTop = list[0].parentElement.parentElement.offsetTop
                        list.forEach(price => {
                            price.style.borderTop = 'solid 1px red';
                            price.style.borderBottom = 'solid 1px red';
                            price.style.backgroundColor = '#ffe1d4';
                        })

                        window.scrollTo(0, targetTop)
                        notify(true)
                    } else {
                        let y = window.scrollY
                        window.scrollTo(0, y + 1000)
                        setTimeout(() => {
                            let y2 = window.scrollY
                            if (y2 > y) {
                                doFilter()
                                judge()
                            } else {
                                notify(false)
                            }
                        }, 100)
                    }
                }

                doFilter()
                judge()

                break
            default:
                break
        }
    }
)