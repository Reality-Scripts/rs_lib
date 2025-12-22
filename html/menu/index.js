/**
 * @type {Object.<string, HTMLTemplateElement>}
 */
const templates = {
    menu: document.head.querySelector('template#menu'),
    item: document.head.querySelector('template#item'),
    list: document.head.querySelector('template#list'),
}
/**
 * @type {Object.<string, HTMLElement>}
 */
const elements = {}

/** @typedef {{text: string, fontFamily: string, textAlign: string, color: string, backgroundColor: string, backgroundImage: string}} MenuHeader */
/** @typedef {'start' | 'center' | 'end'} MenuAlign */
/** @typedef {{label: string}} MenuItem */

const Menu = {
    /**
     * @param {string} title
     */
    updateTitle(title) {
        elements.title.innerText = title ?? ''
    },
    updatePosition() {
        elements.position.innerText = `${this.index + 1}/${this.items.length}`
    },
    createItem({label}) {
        const element = templates.item.content.cloneNode(true)
        element.querySelector('div.label').innerText = label
        return element.firstElementChild
    },
    createVisibleItems() {
        for (const item of this.items.slice(
            this.firstVisibleItemIndex =
                this.index < this.maxVisibleItems ? 0
                : this.index - this.maxVisibleItems + 1,
            this.firstVisibleItemIndex + this.maxVisibleItems
        )) elements.items.append(this.createItem(item))
    },
    updateVisibleItems() {
        elements.item.classList.remove('selected')

        const lastVisibleItemIndex = Menu.firstVisibleItemIndex + Menu.maxVisibleItems - 1
        if (Menu.index < Menu.firstVisibleItemIndex) {
            const indexOffset = Menu.firstVisibleItemIndex - Menu.index
            if (indexOffset < Menu.maxVisibleItems) {
                for (let elementIndex = Menu.firstVisibleItemIndex - 1; elementIndex >= Menu.index; elementIndex--) {
                    elements.items.lastElementChild.remove()
                    elements.items.prepend(Menu.createItem(Menu.items[elementIndex]))
                }
                Menu.firstVisibleItemIndex -= indexOffset
            } else {
                elements.items.replaceChildren()
                Menu.createVisibleItems()
            }
        } else if (Menu.index > lastVisibleItemIndex) {
            const indexOffset = Menu.index - lastVisibleItemIndex
            if (indexOffset < Menu.maxVisibleItems) {
                for (let elementIndex = lastVisibleItemIndex + 1; elementIndex <= Menu.index; elementIndex++) {
                    elements.items.firstElementChild.remove()
                    elements.items.append(Menu.createItem(Menu.items[elementIndex]))
                }
                Menu.firstVisibleItemIndex += indexOffset
            } else {
                elements.items.replaceChildren()
                Menu.createVisibleItems()
            } 
        }
    },
    /**
     * @param {MenuHeader} header
     */
    updateHeader(header) {
        if (header === undefined) {
            elements.header.classList.add('hidden')
            elements.header.innerText = ''
            elements.header.removeAttribute('style')
            return
        }
        elements.header.classList.remove('hidden')
        const {text, fontFamily, textAlign, color, backgroundColor, backgroundImage} = header
        elements.header.innerText = text ?? ''
        Object.assign(elements.header.style, {
            fontFamily: fontFamily ?? 'unset',
            textAlign: textAlign,
            color: color,
            backgroundColor: backgroundColor,
            backgroundImage: backgroundImage && `url(${backgroundImage})`
        })
    },
    updateSelectedItem() {
        elements.item = elements.items.children[this.index - this.firstVisibleItemIndex]
        elements.item.classList.add('selected')
    },
    updateArrows() {
        elements.arrows.classList[this.items.length > this.maxVisibleItems ? 'remove' : 'add']('hidden')
    },
    updateDescription() {
        elements.description.innerText = this.items[this.index].description ?? ''
    },
    /**
     * @param {MenuAlign} align
     */
    updateAlign(align) {
        elements.menu.firstElementChild.style.alignSelf = align
    }
}

const messages = {
    /**
     * @param {{header: MenuHeader, title: string, items: MenuItem[], index: integer, maxVisibleItems: integer, align: MenuAlign}}
     */
    open({header, title, items, index = 0, maxVisibleItems = 7, align = 'start'}) {
        if (!document.body.childElementCount) {
            elements.menu = templates.menu.content.cloneNode(true)
            elements.header = elements.menu.querySelector('div.header')
            elements.title = elements.menu.querySelector('div.title')
            elements.position = elements.menu.querySelector('div.position')
            elements.items = elements.menu.querySelector('div.items')
            elements.arrows = elements.menu.querySelector('div.arrows')
            elements.description = elements.menu.querySelector('div.description')
        }

        Menu.items = items
        Menu.index = Math.min(Math.max(index, 0), Menu.items.length)
        Menu.maxVisibleItems = maxVisibleItems

        Menu.updateHeader(header)
        Menu.updateTitle(title)
        Menu.updatePosition()
        Menu.createVisibleItems()
        Menu.updateSelectedItem()
        Menu.updateArrows()
        Menu.updateDescription()
        Menu.updateAlign(align)

        if (!document.body.childElementCount)
            document.body.replaceChildren(elements.menu)
    },
    /**
     * @param {integer} index
     */
    move(index) {
        if (Menu.index === undefined) return
        if (index < 0 || index >= Menu.items.length) return
        if (index === Menu.index) return
        Menu.index = index

        Menu.updatePosition()
        Menu.updateVisibleItems()
        Menu.updateSelectedItem()
        Menu.updateDescription()
    },
    close() {
        Menu.items = undefined
        Menu.index = undefined
        Menu.maxVisibleItems = undefined

        elements.menu = undefined
        elements.header = undefined
        elements.title = undefined
        elements.position = undefined
        elements.items = undefined
        elements.arrows = undefined
        elements.description = undefined

		document.body.replaceChildren()
    }
}

addEventListener('message', ({data}) =>
    Array.isArray(data) &&
	messages[data.shift()]?.(...data)
)