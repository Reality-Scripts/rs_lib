local defaultColour = vector4(0, 0, 255, 1)

local Debug = {}

---@param coords vector3
---@param radius number
---@param colour? vector4
function Debug.DrawSphere(coords, radius, colour)
    if not colour then
        colour = defaultColour
    end
    DrawMarker(28,
        coords.x, coords.y, coords.z,
        0, 0, 0, 0, 0, 0,
        radius, radius, radius,
        colour.x, colour.y, colour.z, colour.w * 255,
        false, false, 0, false,
        ---@diagnostic disable-next-line
        nil, nil,
        false)
end

---@param tail vector3
---@param head vector3
---@param colour? vector4
function Debug.DrawLine(tail, head, colour)
    if not colour then
        colour = defaultColour
    end
    DrawLine(
        tail.x, tail.y, tail.z,
        head.x, head.y, head.z,
        colour.x, colour.y, colour.z, colour.w * 255
    )
end

---@param min vector3
---@param max vector3
---@param colour? vector4
function Debug.DrawBox(min, max, colour)
    if not colour then
        colour = defaultColour
    end
    DrawBox(
        min.x, min.y, min.z,
        max.x, max.y, max.z,
        colour.x, colour.y, colour.z, colour.w * 255
    )
end

---@param coords1 vector3
---@param coords2 vector3
---@param coords3 vector3
---@param colour? vector4
function Debug.DrawPoly(coords1, coords2, coords3, colour)
    if not colour then
        colour = defaultColour
    end
    DrawPoly(
        coords1.x, coords1.y, coords1.z,
        coords2.x, coords2.y, coords2.z,
        coords3.x, coords3.y, coords3.z,
        colour.x, colour.y, colour.z, colour.w * 255
    )
end

---@param coords1 vector3
---@param coords2 vector3
---@param coords3 vector3
---@param colour? vector4
---@param txd string
---@param txn string
---@param uv1 vector2
---@param uv2 vector2
---@param uv3 vector2
function Debug.DrawTexturedPoly(coords1, coords2, coords3, colour, txd, txn, uv1, uv2, uv3)
    if not colour then
        colour = defaultColour
    end
    DrawTexturedPoly(
        coords1.x, coords1.y, coords1.z,
        coords2.x, coords2.y, coords2.z,
        coords3.x, coords3.y, coords3.z,
        colour.x, colour.y, colour.z, colour.w * 255,
        txd, txn,
        uv1.x, uv1.y, 0,
        uv2.x, uv2.y, 0,
        uv3.x, uv3.y, 0
    )
end

---@param topLeft vector3
---@param bottomLeft vector3
---@param bottomRight vector3
---@param topRight vector3
---@param colour vector4
function Debug.DrawPolyFace(topLeft, bottomLeft, bottomRight, topRight, colour)
    Debug.DrawPoly(topLeft, bottomLeft, bottomRight, colour)
    Debug.DrawPoly(bottomRight, topRight, topLeft, colour)
end

---@param coords vector3
---@param min vector3
---@param max vector3
---@param min2 vector3
---@param max2 vector3
---@param colour? vector4
function Debug.DrawCuboid(coords, min, max, min2, max2, colour)
    if not colour then
        colour = defaultColour
    end
    local a = coords + min
    local b = coords + max
    local c = coords + min2
    local d = coords + max2
    local e = coords + vec3(min.x, min.y, max.z)
    local f = coords + vec3(max.x, max.y, min.z)
    local g = coords + vec3(min2.x, min2.y, max.z)
    local h = coords + vec3(max2.x, max2.y, max.z)
    Debug.DrawPolyFace(a, c, f, d, colour) -- Bottom
    Debug.DrawPolyFace(g, e, h, b, colour) -- Top
    Debug.DrawPolyFace(e, a, d, h, colour) -- Front
    Debug.DrawPolyFace(b, f, c, g, colour) -- Back
    Debug.DrawPolyFace(g, c, a, e, colour) -- Left
    Debug.DrawPolyFace(h, d, f, b, colour) -- Right
end


return Debug
