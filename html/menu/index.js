/**
 * @param {string} name
 */
async function TriggerNUICallback(name, data) {
	return fetch(`https://${GetParentResourceName()}/${name}`, data !== undefined ? {
        method: 'post',
        body: JSON.stringify(data)
    } : undefined).then(response => response.json())
}

/**
 * @type {Object.<string, HTMLTemplateElement>}
 */
const templates = {
    menu: document.head.querySelector('template#menu'),
    item: document.head.querySelector('template#item')
}

/** @typedef {{label: string}} menuItem */

/**
 * @param {HTMLElement} menuItemsElement
 * @param {menuItem} item
 */
function createMenuItemElement(item) {
    const menuItemElement = templates.item.content.cloneNode(true)
    menuItemElement.querySelector('div.label').innerText = item.label
    return menuItemElement.firstElementChild
}

let positionElement
let arrowsElement
let descriptionElement

let menuItemsElement

let menuItems
let menuItemIndex
let menuMaxVisibleItems

let menuFirstVisibleItemIndex

let menuItem

function drawHeader(element, header) {
    if (header === undefined)
        return element.remove()

    const {text, textAlign, font, color, backgroundColor, backgroundImage} = header

    if (text !== undefined)
        element.innerText = text

    if (textAlign !== undefined)
        element.style.textAlign = textAlign

    if (font !== undefined)
        element.style.fontFamily = font

    if (color !== undefined)
        element.style.color = color

    if (backgroundColor !== undefined)
        element.style.backgroundColor = backgroundColor

    if (backgroundImage !== undefined)
        element.style.backgroundImage = `url(${backgroundImage})`
}

function drawPosition() {
    positionElement.innerText = `${menuItemIndex + 1}/${menuItems.length}`
}

function drawMenuItems() {
    menuFirstVisibleItemIndex = menuItemIndex < menuMaxVisibleItems ? 0 : menuItemIndex - menuMaxVisibleItems + 1
    for (const item of menuItems.slice(menuFirstVisibleItemIndex, menuFirstVisibleItemIndex + menuMaxVisibleItems))
        menuItemsElement.append(createMenuItemElement(item))
}

function drawSelectedMenuItem() {
    menuItem = menuItemsElement.children[menuItemIndex - menuFirstVisibleItemIndex]
    menuItem.classList.add('selected')
}

function drawDescription() {
    const {description} = menuItems[menuItemIndex]
    if (description)
        descriptionElement.innerText = description
    else
        descriptionElement.replaceChildren()
}

const messages = {
    /**
     * @param {{title: string, items: menuItem[], currentItem: integer, maxItems: integer, align: 'start' | 'center' | 'end'}}
     */
    open({header, title, items, itemIndex = 0, maxVisibleItems = 7, align = 'start'}) {
		const element = templates.menu.content.cloneNode(true)

        element.firstElementChild.style.alignSelf = align

        positionElement = element.querySelector('div.position')
        menuItemsElement = element.querySelector('div.items')
        descriptionElement = element.querySelector('div.description')

        menuItems = items
        menuItemIndex = itemIndex
        menuMaxVisibleItems = maxVisibleItems

        drawHeader(element.querySelector('div.header'), header)
        if (title !== undefined)
            element.querySelector('div.title').innerText = title
        if (items.length <= maxVisibleItems)
            element.querySelector('div.arrows').remove()

        drawPosition()
        drawMenuItems()
        drawSelectedMenuItem()
        drawDescription()

		document.body.replaceChildren(element)
    },
    /**
     * @param {integer} index
     */
    move(index) {
        if (index < 0 || index >= menuItems.length) return
        if (index === menuItemIndex) return

        menuItem.classList.remove('selected')
        menuItemIndex = index

        drawPosition()

        const lastVisibleItemIndex = menuFirstVisibleItemIndex + menuMaxVisibleItems - 1
        if (menuItemIndex < menuFirstVisibleItemIndex) {
            const indexOffset = menuFirstVisibleItemIndex - menuItemIndex
            if (indexOffset < menuMaxVisibleItems) {
                for (let elementIndex = menuFirstVisibleItemIndex - 1; elementIndex >= menuItemIndex; elementIndex--) {
                    menuItemsElement.lastElementChild.remove()
                    menuItemsElement.prepend(createMenuItemElement(menuItems[elementIndex]))
                }
                menuFirstVisibleItemIndex -= indexOffset
            } else {
                menuItemsElement.replaceChildren()
                drawMenuItems()
            }
        } else if (menuItemIndex > lastVisibleItemIndex) {
            const indexOffset = menuItemIndex - lastVisibleItemIndex
            if (indexOffset < menuMaxVisibleItems) {
                for (let elementIndex = lastVisibleItemIndex + 1; elementIndex <= menuItemIndex; elementIndex++) {
                    menuItemsElement.firstElementChild.remove()
                    menuItemsElement.append(createMenuItemElement(menuItems[elementIndex]))
                }
                menuFirstVisibleItemIndex += indexOffset
            } else {
                menuItemsElement.replaceChildren()
                drawMenuItems()
            } 
        }

        drawSelectedMenuItem()
        drawDescription()
    },
    close() {
		document.body.replaceChildren()
    }
}

addEventListener('message', ({data}) =>
    Array.isArray(data) &&
	messages[data.shift()]?.(...data)
)