-- not mine

--[[Bug :3]] 
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")
local RunService = game:GetService("RunService")
local RobloxReplicatedStorage = game:GetService("RobloxReplicatedStorage")
local Heartbeat = RunService.Heartbeat
local Request =
    RobloxReplicatedStorage:WaitForChild("RequestDeviceCameraCFrame")
local Replicate = RobloxReplicatedStorage:WaitForChild(
                      "ReplicateDeviceCameraCFrame")
local RobloxGui = CoreGui:WaitForChild("RobloxGui")
local PlayerViewCore = RobloxGui:WaitForChild("CoreScripts/PlayerView")
PlayerViewCore.Enabled = false
local Socket = {}
if not shared.Socket then
    local Frequency = 20
    local Interval = 1 / Frequency
    local Accumulator = 0
    RunService.Heartbeat:Connect(function(Delta)
        Accumulator = Accumulator + Delta
        while Accumulator >= Interval do
            Accumulator = Accumulator - Interval
            for _, Player in next, Players:GetPlayers() do
                Request:FireServer(Player.UserId)
            end
        end
    end)
end
shared.Socket = true
Request.OnClientEvent:Connect(function() end)
function Socket.Connect(Port)
    local Connection
    local Socket = {
        Send = function(self, ...)
            Replicate:FireServer({...})
        end,
        Close = function(self)
            Connection:Disconnect()
            self.OnClose()
        end,
        OnMessage = {
            Connections = {},
            Connect = function(self, f)
                table.insert(self.Connections, f)
            end,
            Fire = function(self, ...)
                for _, Connection in pairs(self.Connections) do
                    Connection(...)
                end
            end
        },
        OnClose = function() end
    } --[[4DBug made this module]]
    Connection = Replicate.OnClientEvent:Connect(
                     function(Player, Cast, Arguments)
            if CFrame.new(Port, Port, Port) == Cast then
                Socket.OnMessage:Fire(Player, unpack(Arguments))
            end
        end)
    return Socket
end
return Socket
