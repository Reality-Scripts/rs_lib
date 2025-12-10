local prototype = {}

function prototype:__index(key)
    return GetStateBagValue(self.name, key)
end

function prototype:__pairs()
    local index = 0
    return function(keys)
        index = index + 1
        return keys[index]
    end, GetStateBagKeys(self.name)
end

local StateBag = {}

function StateBag:new(name)
    return setmetatable({
        name = name
    }, prototype)
end

return StateBag
