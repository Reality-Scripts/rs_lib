local Nui = require('@rs_lib/imports/client/nui')

local Keybind = require('@rs_lib/imports/client/keybind')

local History = {}

local Menu

local function openMenu(menu)
    if IsPauseMenuActive() then return end
    if not menu.itemIndex then
        menu.itemIndex = 0
    end
    if Menu then
        table.insert(History, Menu)
    end
    Menu = menu
    Nui.SendMessage('menu', 'open', menu)
end

exports('openMenu', openMenu)

local function closeMenu()
    if not Menu then return end
    History = {}
    Menu = nil
    Nui.SendMessage('menu', 'close')
end

exports('closeMenu', closeMenu)

local function moveMenu(index)
    if not Menu then return end
    index = index % #Menu.items
    if Menu.itemIndex == index then return end
    Menu.itemIndex = index
    Nui.SendMessage('menu', 'move', Menu.itemIndex)
    if not Menu.moved then return end
    Menu.moved(Menu.itemIndex)
end

exports('moveMenu', moveMenu)

local menuUp = Keybind:new({
    command = 'lib_menu_up',
    description = 'Menu Up',
    defaultParameter = 'UP',
    alternateMapper = 'PAD_ANALOGBUTTON',
    alternateParameter = 'LUP_INDEX',
})

function menuUp:onPressed()
    if not Menu then return end
    moveMenu(Menu.itemIndex - 1)
end

local menuDown = Keybind:new({
    command = 'lib_menu_down',
    description = 'Menu Down',
    defaultParameter = 'DOWN',
    alternateMapper = 'PAD_ANALOGBUTTON',
    alternateParameter = 'LDOWN_INDEX',
})

function menuDown:onPressed()
    if not Menu then return end
    moveMenu(Menu.itemIndex + 1)
end

local menuAccept = Keybind:new({
    command = 'lib_menu_accept',
    description = 'Menu Accept',
    defaultParameter = 'RETURN',
    alternateMapper = 'PAD_ANALOGBUTTON',
    alternateParameter = 'RDOWN_INDEX',
})

function menuAccept:onPressed()
    if not Menu then return end
    if not Menu.selected then return end
    Menu.selected(Menu.itemIndex)
end

local menuCancel = Keybind:new({
    command = 'lib_menu_cancel',
    description = 'Menu Cancel',
    defaultParameter = 'BACK',
    alternateMapper = 'PAD_ANALOGBUTTON',
    alternateParameter = 'RRIGHT_INDEX',
})

function menuCancel:onPressed()
    if not Menu then return end
    if Menu.canceled then
        Menu.canceled()
    end
    if Menu.closeable ~= false then
        local previous = table.remove(History)
        if previous then
            Menu = nil
            openMenu(previous)
        else
            closeMenu()
        end
    end
end

