local Prototype = require('@rs_lib/imports/client/keybind/prototype')

local Keybind = {}

---@param keybind keybind
function Keybind:new(keybind)
    setmetatable(keybind, Prototype)

    RegisterCommand('+' .. keybind.command, function()
        keybind.pressed = true
        if keybind.disabled then
            return
        end
        if keybind.onPressed then
            keybind:onPressed()
        end
    end, false)

    RegisterCommand('-' .. keybind.command, function()
        keybind.pressed = false
        if keybind.disabled then
            return
        end
        if keybind.onReleased then
            keybind:onReleased()
        end
    end, false)

    RegisterKeyMapping('+' .. keybind.command, keybind.description, keybind.defaultMapper, keybind.defaultParameter)

    if keybind.alternateParameter then
        RegisterKeyMapping('~!+' .. keybind.command, keybind.description, keybind.alternateMapper, keybind.alternateParameter)
    end

    return keybind
end


return Keybind
