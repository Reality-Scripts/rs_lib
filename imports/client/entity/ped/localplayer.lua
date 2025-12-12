local Entity = require('@rs_lib/imports/client/entity')

local Ped = require('@rs_lib/imports/client/entity/ped')

---@class localPlayer: ped
---@field id integer
---@field netid integer
---@field dead boolean
---@field aiming boolean
---@field weapon? integer
---@field vehicle? integer
---@field vehicleSeat? integer
---@field enteringVehicle? integer
---@field enteringVehicleSeat? integer
local LocalPlayer = Ped:new({
    model = 'player_zero',
    coords = vector3(0, 0, 0),
    dead = false,
    aiming = false
})
LocalPlayer.handle = PlayerPedId()
LocalPlayer.id = PlayerId()
LocalPlayer.netid = GetPlayerServerId(LocalPlayer.id)

function LocalPlayer:Delete() end

---@param heading? number
---@param coords vector3 | vector4
function LocalPlayer:Spawn(coords, heading)
    NetworkResurrectLocalPlayer(coords.x, coords.y, coords.z, coords.w or heading, 0, false)
end

---@param model string
function LocalPlayer:SetModel(model)
    Entity.LoadModel(model)
    self.model, self.hash = model, joaat(model)
    SetPlayerModel(self.id, self.hash)
    self.handle = PlayerPedId()
    SetPedDefaultComponentVariation(self.handle)
    Entity.UnloadModel(self.model)
end

function LocalPlayer:IsDead()
    return IsPlayerDead(self.id)
end

function LocalPlayer:IsInvincible()
    return GetPlayerInvincible(self.id)
end

---@param invincible boolean
function LocalPlayer:SetInvincible(invincible)
    return SetPlayerInvincible(self.id, invincible)
end


return LocalPlayer
