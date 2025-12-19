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

function drawComponents() {
    positionElement.innerText = `${menuItemIndex + 1}/${menuItems.length}`
    const {description} = menuItems[menuItemIndex]
    if (description)
        descriptionElement.innerText = description
    else
        descriptionElement.replaceChildren()
}

function drawMenuItems() {
    menuFirstVisibleItemIndex = menuItemIndex < menuMaxVisibleItems ? 0 : menuItemIndex - menuMaxVisibleItems + 1
    for (const item of menuItems.slice(menuFirstVisibleItemIndex, menuFirstVisibleItemIndex + menuMaxVisibleItems))
        menuItemsElement.append(createMenuItemElement(item))
    menuItem = menuItemsElement.children[menuItemIndex - menuFirstVisibleItemIndex]
    menuItem.classList.add('selected')
    drawComponents()
}

const messages = {
    /**
     * @param {{title: string, items: menuItem[], currentItem: integer, maxItems: integer, align: 'start' | 'center' | 'end'}}
     */
    open({header, title, items, itemIndex = 0, maxVisibleItems = 7, align = 'start'}) {
		const element = templates.menu.content.cloneNode(true)

        element.firstElementChild.style.alignSelf = align

        const headerElement = element.querySelector('div.header')
        if (header === undefined)
            headerElement.remove()
        else if (header.text)
            headerElement.innerText = header.text

        if (title !== undefined)
            element.querySelector('div.title').innerText = title

        positionElement = element.querySelector('div.position')
        if (items.length <= maxVisibleItems)
            element.querySelector('div.arrows').remove()
        descriptionElement = element.querySelector('div.description')

        menuItemsElement = element.querySelector('div.items')

        menuItems = items
        menuItemIndex = itemIndex
        menuMaxVisibleItems = maxVisibleItems

        drawMenuItems()

		document.body.replaceChildren(element)
    },
    /**
     * @param {integer} index
     */
    move(index) {
        if (index < 0 || index >= menuItems.length) return
        if (index === menuItemIndex) return
        const lastVisibleItemIndex = menuFirstVisibleItemIndex + menuMaxVisibleItems
        if (index < menuFirstVisibleItemIndex) {
            const indexOffset = menuFirstVisibleItemIndex - index
            if (indexOffset < menuMaxVisibleItems) {
                for (let elementIndex = menuFirstVisibleItemIndex - 1; elementIndex >= index; elementIndex--) {
                    menuItemsElement.lastElementChild.remove()
                    menuItemsElement.prepend(createMenuItemElement(menuItems[elementIndex]))
                }
                menuFirstVisibleItemIndex -= indexOffset
            } else {
                menuItemsElement.replaceChildren()
                menuItemIndex = index
                drawMenuItems()
                return
            }
        } else if (index >= lastVisibleItemIndex) {
            const indexOffset = index - lastVisibleItemIndex + 1
            if (indexOffset < menuMaxVisibleItems) {
                for (let elementIndex = lastVisibleItemIndex; elementIndex <= index; elementIndex++) {
                    menuItemsElement.firstElementChild.remove()
                    menuItemsElement.append(createMenuItemElement(menuItems[elementIndex]))
                }
                menuFirstVisibleItemIndex += indexOffset
            } else {
                menuItemsElement.replaceChildren()
                menuItemIndex = index
                drawMenuItems()
                return
            } 
        }
        menuItem.classList.remove('selected')
        menuItemIndex = index
        menuItem = menuItemsElement.children[index - menuFirstVisibleItemIndex]
        menuItem.classList.add('selected')
        drawComponents()
    },
    close() {
		document.body.replaceChildren()
    }
}

addEventListener('message', ({data}) =>
    Array.isArray(data) &&
	messages[data.shift()]?.(...data)
)